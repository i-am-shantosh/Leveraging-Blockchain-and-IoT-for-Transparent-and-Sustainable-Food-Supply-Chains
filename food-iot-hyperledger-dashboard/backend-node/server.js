const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Load environment variables (if .env exists)
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Defaults if .env is missing
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const walletPath = path.join(__dirname, 'wallet');
const connectionProfilePath = path.resolve(
    __dirname,
    '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
);
const channelName = 'mychannel';
const chaincodeName = 'sensor';

// Helper function to connect to Fabric and get contract
async function getContract() {
    const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork(channelName);
    return network.getContract(chaincodeName);
}

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Missing token' });

    jwt.verify(authHeader, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/logData', authenticateToken, async (req, res) => {
    const { sensorId, temperature, humidity, timestamp } = req.body;
    if (!sensorId || !temperature || !humidity || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const contract = await getContract();
        const result = await contract.submitTransaction(
            'logData',
            sensorId,
            temperature.toString(),
            humidity.toString(),
            timestamp
        );
        res.json({ status: 'success', data: JSON.parse(result.toString()) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/queryData/:sensorId', authenticateToken, async (req, res) => {
    try {
        const contract = await getContract();
        const result = await contract.evaluateTransaction('queryData', req.params.sensorId);
        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

