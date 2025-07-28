'use strict';

const { Contract } = require('fabric-contract-api');

class SensorContract extends Contract {
    async initLedger(ctx) {
        console.info('Ledger initialized');
    }

    async logData(ctx, sensorId, temperature, humidity, timestamp) {
        const data = { sensorId, temperature, humidity, timestamp };
        await ctx.stub.putState(sensorId + timestamp, Buffer.from(JSON.stringify(data)));
        return JSON.stringify(data);
    }

    async queryData(ctx, sensorId) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            const record = JSON.parse(res.value.value.toString('utf8'));
            if (record.sensorId === sensorId) {
                allResults.push(record);
            }
            res = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = SensorContract;

