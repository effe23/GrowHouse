import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../config/db';

interface SensorData {
  temp: number;
  humidity: number;
  light: number;
  soil_moisture: number;
  timestamp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('GrowHouse');

  if (req.method === 'POST') {
    const { temp, humidity, light, soil_moisture, timestamp = Date.now() } = req.body;
    await db.collection('sensorData').insertOne({
      temp,
      humidity,
      light,
      soil_moisture,
      timestamp,
    });
    res.status(200).json({ message: 'Data received' });
  } else if (req.method === 'GET') {
    const sensorData = await db.collection('sensorData').find({}).sort({ timestamp: -1 }).limit(1800).toArray();
    const formattedData = sensorData.map(data => ({
      temp: data.temp,
      humidity: data.humidity,
      light: data.light,
      soil_moisture: data.soil_moisture,
      timestamp: data.timestamp.toString(),
      pump_status: 'OFF', 
    }));
    res.status(200).json(formattedData);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
