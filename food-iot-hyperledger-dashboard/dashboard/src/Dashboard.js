import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';

function Dashboard() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/queryData/sensor1', {
          headers: { Authorization: token }
        });
        if (response.data.length > 0) {
          const latest = response.data[response.data.length - 1];
          setTemperature(parseFloat(latest.temperature));
          setHumidity(parseFloat(latest.humidity));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>IoT Sensor Dashboard</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
        <div>
          <h3>Temperature</h3>
          <GaugeChart id="temp-gauge" nrOfLevels={20} percent={temperature / 100} textColor="#000" />
          <p>{temperature} °C</p>
        </div>
        <div>
          <h3>Humidity</h3>
          <GaugeChart id="humidity-gauge" nrOfLevels={20} percent={humidity / 100} textColor="#000" />
          <p>{humidity} %</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
