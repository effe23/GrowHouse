import { useState, useEffect } from 'react';
import Image from 'next/image';
import LineChart from './LineChart';

interface SensorData {
  temp: number[];
  humidity: number[];
  light: number[];
  soil_moisture: number[];
  timestamps: string[];
  pump_status: string;
}

interface PlantDetailsProps {
  plant: {
    id: number;
    name: string;
    src: string;
  };
  data: SensorData;
}

const calculateSoilMoisturePercentage = (value: number): number => {
  const minMoisture = 25000;
  const maxMoisture = 56000;

  if (value <= minMoisture) return 100;
  if (value >= maxMoisture) return 0;

  return Math.round(((maxMoisture - value) / (maxMoisture - minMoisture)) * 100);
};

const calculateLightIntensityPercentage = (value: number): number => {
  const minLight = 1000;
  const maxLight = 65000;

  if (value <= minLight) return 0;
  if (value >= maxLight) return 100;

  return Math.round(((value - minLight) / (maxLight - minLight)) * 100);
};

const checkSoilMoisture = async (soilMoisture: number, pumpStatus: string) => {
  const sendEmailNotification = async (subject: string, text: string) => {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, text }),
    });
  };

  const threshold = 30;
  const notificationInterval = 300000;

  const getLastNotificationTime = (): number => {
    const lastTime = localStorage.getItem('lastNotificationTime');
    return lastTime ? parseInt(lastTime) : 0;
  };

  const setLastNotificationTime = (time: number) => {
    localStorage.setItem('lastNotificationTime', time.toString());
  };

  const currentTime = Date.now();
  const lastNotificationTime = getLastNotificationTime();

  if (soilMoisture < threshold && (currentTime - lastNotificationTime > notificationInterval)) {
    await sendEmailNotification('Soil Moisture Alert', 'The soil moisture level is low. Please water your plants.');
    setLastNotificationTime(currentTime);
  }

  if (pumpStatus === 'ON') {
    await sendEmailNotification('Pump Activated', 'The pump has been activated.');
  }
};

export default function PlantDetails({ plant, data }: PlantDetailsProps) {
  const [ledStatus, setLedStatus] = useState({ red: 0, green: 0, blue: 0 });
  const [pumpStatus, setPumpStatus] = useState(data.pump_status);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensor-data', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        if (response.ok) {
          const result: SensorData = await response.json();
          setPumpStatus(result.pump_status);

          const latestSoilMoisture = calculateSoilMoisturePercentage(result.soil_moisture[result.soil_moisture.length - 1]);
          await checkSoilMoisture(latestSoilMoisture, result.pump_status);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const updateLedStatus = async (color: string, value: number) => {
    const newStatus = { ...ledStatus, [color]: value };
    const response = await fetch('/api/control-led', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStatus),
    });

    if (response.ok) {
      setLedStatus(newStatus);
    } else {
      console.error('Failed to update LED status');
    }
  };

  const togglePump = async () => {
    const newStatus = pumpStatus === 'OFF' ? 'ON' : 'OFF';
    const response = await fetch('/api/control-pump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      setPumpStatus(newStatus);
    } else {
      console.error('Failed to update pump status');
    }
  };

  if (!data || !data.temp || !data.humidity || !data.light || !data.soil_moisture || !data.timestamps) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hero min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">{plant.name}</h1>
      <div className="hero-content flex-col lg:flex-row items-start gap-8 p-4 max-w-4xl w-full">
        <div className="grid grid-cols-1 gap-4 w-full lg:w-1/3">
          <div
            className="card bg-red-50 shadow-md hover-expand relative"
            onMouseEnter={() => setHoveredCard('temp')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg">Temperature</h2>
              <p className="text-4xl font-bold">{data.temp.length > 0 ? data.temp[0] : 'N/A'} °C</p>
              {hoveredCard === 'temp' && (
                <div className="absolute top-0 right-full mr-4 p-4 bg-white shadow-lg rounded-lg chart-container">
                  <LineChart data={data.temp} labels={data.timestamps} />
                </div>
              )}
            </div>
          </div>
          <div
            className="card bg-blue-50 shadow-md hover-expand relative"
            onMouseEnter={() => setHoveredCard('humidity')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg">Humidity</h2>
              <p className="text-4xl font-bold">{data.humidity.length > 0 ? data.humidity[0] : 'N/A'} %</p>
              {hoveredCard === 'humidity' && (
                <div className="absolute top-0 right-full mr-4 p-4 bg-white shadow-lg rounded-lg chart-container">
                  <LineChart data={data.humidity} labels={data.timestamps} />
                </div>
              )}
            </div>
          </div>
          <div
            className="card bg-yellow-50 shadow-md hover-expand relative"
            onMouseEnter={() => setHoveredCard('light')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg">Light</h2>
              <p className="text-4xl font-bold">
                {data.light.length > 0 ? calculateLightIntensityPercentage(data.light[0]) : 'N/A'} %
              </p>
              {hoveredCard === 'light' && (
                <div className="absolute top-0 right-full mr-4 p-4 bg-white shadow-lg rounded-lg chart-container">
                  <LineChart data={data.light.map(calculateLightIntensityPercentage)} labels={data.timestamps} />
                </div>
              )}
            </div>
          </div>
          <div
            className="card bg-green-50 shadow-md hover-expand relative"
            onMouseEnter={() => setHoveredCard('soil')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg">Soil Moisture</h2>
              <p className="text-4xl font-bold">
                {data.soil_moisture.length > 0 ? calculateSoilMoisturePercentage(data.soil_moisture[0]) : 'N/A'} %
              </p>
              {hoveredCard === 'soil' && (
                <div className="absolute bottom-0 right-full mr-4 p-4 bg-white shadow-lg rounded-lg chart-container">
                  <LineChart data={data.soil_moisture.map(calculateSoilMoisturePercentage)} labels={data.timestamps} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-left w-full lg:w-1/3">
          <div className="card bg-base-100 shadow-md mb-4" style={{ height: '295px' }}>
            <div className="card-body p-0">
              <div className="relative" style={{ width: '100%', height: '100%' }}>
                <Image src={plant.src} alt={plant.name} layout="fill" objectFit="cover" className="rounded-lg" />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md mb-4" style={{ height: '140px' }}>
            <div className="card-body p-4 flex flex-col justify-between">
              <h2 className="card-title">Control Grow Light</h2>
              <div className="flex flex-row space-x-4 items-center justify-around">
                <div className="flex flex-col items-center">
                  <span className="label-text mb-2">Red</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={ledStatus.red === 1}
                    onChange={(e) => updateLedStatus('red', e.target.checked ? 1 : 0)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="label-text mb-2">Green</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={ledStatus.green === 1}
                    onChange={(e) => updateLedStatus('green', e.target.checked ? 1 : 0)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="label-text mb-2">Blue</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={ledStatus.blue === 1}
                    onChange={(e) => updateLedStatus('blue', e.target.checked ? 1 : 0)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md" style={{ height: '140px' }}>
            <div className="card-body p-4 flex flex-col justify-between">
              <h2 className="card-title">Control Pump</h2>
              <button
                onClick={togglePump}
                className={`btn ${pumpStatus === 'ON' ? 'btn-danger' : 'btn-success'}`}
              >
                {pumpStatus === 'ON' ? 'Turn Pump Off' : 'Turn Pump On'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hover-expand {
          transition: all 0.3s ease;
        }
        .hover-expand:hover {
          transform: translateX(-30px);
        }
        .chart-container {
          width: 350px;
          height: 295px;
        }
      `}</style>
    </div>
  );
}
