
# Smart Grow House Monitor

## Name and Credentials
Ek223yb

## Project Overview
The Smart Grow House Monitor is an IoT project designed to monitor and control the environment of a grow house. It utilizes various sensors to measure temperature, humidity, light, and soil moisture, and provides real-time data and control capabilities through a web interface. This project can be completed in approximately 10 hours, depending on familiarity with the technologies used.

## Objective
The primary objective of this project is to create a smart monitoring system for a grow house, enabling optimal growth conditions for plants. By gathering data on environmental factors and controlling grow lights and a water pump, the system aims to enhance plant growth efficiency and provide valuable insights into the growing process.

### Why This Project?
The choice to build this specific device stems from the need to automate and optimize plant care, reducing manual labor and increasing precision in maintaining ideal growing conditions.

### Purpose
The Smart Grow House Monitor serves to automate plant care by continuously monitoring environmental conditions and providing data-driven insights for better decision-making. This can lead to improved plant health and yield.

### Insights
By analyzing data trends, users can adjust environmental factors to suit different plant species' needs, anticipate problems, and make informed decisions about watering and lighting schedules.

## Material
### List of Materials
- **Sensors**:
  - Temperature and Humidity Sensor (DHT22)
  - Light Sensor (TSL2561)
  - Soil Moisture Sensor (Capacitive)
- **Microcontroller**:
  - ESP32 (for Wi-Fi connectivity)
- **Additional Components**:
  - LED Grow Lights
  - Water Pump
  - Breadboard and Jumper Wires
  - Resistors (various)
- **Software**:
  - Node.js
  - Next.js
  - TailwindCSS
  - DaisyUI

### Sensor Specifications
- **DHT22**: Measures temperature (-40 to 80°C) and humidity (0-100% RH) with high accuracy.
- **TSL2561**: Digital light sensor providing a precise measurement of light intensity.
- **Capacitive Soil Moisture Sensor**: Measures soil moisture level.

### Purchase Information
- **DHT22**: $10 from Amazon
- **TSL2561**: $8 from Adafruit
- **Soil Moisture Sensor**: $5 from eBay
- **ESP32**: $12 from SparkFun

## Computer Setup
### IDE and Tools
- **IDE**: VSCode
- **Programming Language**: Python for sensor integration and JavaScript/TypeScript for web development
- **Frameworks and Libraries**: Next.js for the frontend, Express.js for backend API

### Setup Steps
1. **Install Node.js**: Follow the [Node.js installation guide](https://nodejs.org/en/download/).
2. **Clone the Repository**: `git clone https://github.com/your-repo/grow-house-monitor.git`
3. **Install Dependencies**: 
   ```bash
   cd grow-house-monitor
   npm install
   ```
4. **Setup ESP32**:
   - Flash the firmware using the ESP32 tool
   - Install necessary drivers and connect to the computer

## Putting Everything Together
### Circuit Diagram
- Draw and include a circuit diagram showing the connections between the ESP32, sensors, grow lights, and the water pump.

### Electrical Calculations
- Ensure that the power supply can handle the total current draw from all connected components.
- Use appropriate resistors to limit current to the LEDs.

## Platform
### Choice of Platform
The system is built on a local server using Next.js, which provides real-time data updates and control capabilities. This choice allows for a scalable solution that can later be deployed to a cloud service for remote access.

## The Code
### Core Functionalities
#### Sensor Data Handling (Growhouse.py)
```python
import time
import machine
import dht
import tsl2561
import soil_moisture

# Initialize sensors
dht_sensor = dht.DHT22(machine.Pin(4))
light_sensor = tsl2561.TSL2561()
soil_sensor = soil_moisture.SoilMoisture(0)

while True:
    dht_sensor.measure()
    temp = dht_sensor.temperature()
    humidity = dht_sensor.humidity()
    light = light_sensor.read()
    soil_moisture = soil_sensor.read()
    
    # Send data to the server
    send_data(temp, humidity, light, soil_moisture)
    
    time.sleep(2)
```
- This script collects data from the sensors and sends it to the server every 2 seconds.

#### API Endpoints
**pages/api/sensor-data.ts**
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

interface SensorData {
  temp: number[];
  humidity: number[];
  light: number[];
  soil_moisture: number[];
  timestamps: number[];
}

let sensorData: SensorData = {
  temp: [],
  humidity: [],
  light: [],
  soil_moisture: [],
  timestamps: [],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { temp, humidity, light, soil_moisture } = req.body;
    const timestamp = Date.now();

    sensorData.temp.push(temp);
    sensorData.humidity.push(humidity);
    sensorData.light.push(light);
    sensorData.soil_moisture.push(soil_moisture);
    sensorData.timestamps.push(timestamp);

    // Keep only the latest 30 minutes of data
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const cutoffTime = Date.now() - THIRTY_MINUTES;
    while (sensorData.timestamps[0] < cutoffTime) {
      sensorData.temp.shift();
      sensorData.humidity.shift();
      sensorData.light.shift();
      sensorData.soil_moisture.shift();
      sensorData.timestamps.shift();
    }

    return res.status(200).json({ message: 'Data received' });
  } else if (req.method === 'GET') {
    return res.status(200).json(sensorData);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Transmitting the Data
### Wireless and Transport Protocols
- **WiFi**: The ESP32 connects to a local WiFi network to transmit data.
- **HTTP**: Data is sent to the server using HTTP POST requests.
- **Data Frequency**: Data is sent every 2 seconds to ensure real-time monitoring.

## Presenting the Data
### Dashboard
The dashboard is built using Next.js and displays real-time sensor data using Chart.js for visual representation. Data is updated every 2 seconds.

**Home Page (app/page.tsx)**
```typescript
'use client';

import { useState, useEffect } from 'react';
import PlantGrid from './components/PlantGrid';
import PlantDetails from './components/PlantDetails';

interface SensorData {
  temp: number;
  humidity: number;
  light: number;
  soil_moisture: number;
}

export default function Home() {
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/sensor-data');
      const result: SensorData = await response.json();
      setData(result);
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
```

### Data Storage
- **Database**: Data is temporarily stored in-memory on the server and could be extended to use a database like MongoDB for persistent storage.

## Finalizing the Design
### Results
The Smart Grow House Monitor successfully provides real-time monitoring and control of the grow house environment. It allows users to adjust lighting and watering schedules based on the data collected.

### Pictures
Include pictures of the setup and screenshots of the web interface.

### Final Thoughts
The project went well, with real-time data monitoring and control functioning as expected. Future improvements could include integrating additional sensors, enhancing the web interface, and deploying the system to a cloud platform for remote access.

### Video Presentation
(Optional) Include a video demonstrating the project setup and functionality.
