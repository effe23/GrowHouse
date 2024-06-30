"use client";
import { useState, useEffect } from 'react';
import PlantGrid from './components/PlantGrid';
import PlantDetails from './components/PlantDetails';

interface SensorData {
  temp: number[];
  humidity: number[];
  light: number[];
  soil_moisture: number[];
  timestamps: string[];
  pump_status: string;
}

export default function Home() {
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [data, setData] = useState<SensorData | null>({
    temp: [],
    humidity: [],
    light: [],
    soil_moisture: [],
    timestamps: [],
    pump_status: 'OFF',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensor-data');
        if (response.ok) {
          const result: SensorData = await response.json();
          setData(result);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectPlant = (id: number) => {
    setSelectedPlant(id);
  };

  if (selectedPlant === 1 && data) {
    return <PlantDetails data={data} plant={{ id: 1, name: 'Plant 1', src: '/plant1.svg' }} />;
  }

  return (
    <div>
      <PlantGrid onSelect={handleSelectPlant} />
    </div>
  );
}
