
# Building a Smart Grow House Monitor using Raspberry Pi Pico W

**Name:** Efthimis, ek223yb

---

## Project Overview
This project creates a smart grow house monitor using a Raspberry Pi Pico W. It monitors temperature, humidity, light intensity, and soil moisture, automating watering and displaying data on a Next.js dashboard for real-time monitoring. Approximately 5-7 hours to complete.

## Objective

I'm building this device to merge my interests in IoT and agriculture. Forgetfulness in watering plants prompted me to seek a reliable solution. The goal is to automate plant care by monitoring and optimizing environmental conditions, aiming to improve efficiency and growth outcomes.

## Materials

**Materials Specifications and Costs:**
| Item                   | Specifications                      | Cost          | Supplier              |
|------------------------|--------------------------------------|---------------|---------------------|
| Raspberry Pi Pico W    | Microcontroller with WiFi           | 109           | Electrokit     |
| DHT11 Sensor           | Temperature & Humidity Sensor       | 49            | Electrokit     |
| CdS Photoresistor      | Light Intensity Resistor            | 8             | Electrokit     |
| Soil Moisture Sensor   | Soil Moisture Measurement           | 29            | Electrokit     |
| Relay Module           | Controls high power devices         | 42            | Electrokit     |
| RGB LED                | Multi-color LED                     | 20            | Electrokit     |
| Jumper Wires           | Various lengths                     | 29            | Electrokit     |
| Breadboard             | Prototyping board                   | 69            | Electrokit     |
| Battery Holder         | 2x AA cabel connection              | 16            | Electrokit     |
| Water Pump             | 3V Water Pump                       | 45            | Electrokit     |
|              | Total Price                       |       416      |      |


## Computer Setup
**IDE and Tools Used:**
- **Thonny IDE**: For programming the Raspberry Pi Pico W with MicroPython
- **Node.js**: Backend environment for the Next.js application
- **Visual Studio Code**: For developing the Next.js dashboard

**Setup Steps:**
1. **Install Thonny IDE**: Download and install Thonny from [thonny.org](https://thonny.org/).
2. **Install Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/).
3. **Clone the Repository**: Clone the project repository to your local machine.
4. **Install Dependencies**: Navigate to the project directory and run `npm install` to install all dependencies.
5. **Flashing the Pico W**:
   - Connect the Pico W to your computer via USB.
   - Open Thonny IDE and select the Pico W as the interpreter.
   - Upload the `Growhouse.py` script to the Pico W.
6. **SMTP2GO setup**:
   - Follow the instructions on their website.
   - Get your email and password for the .env.local file.
7. **MongoDB setup**
   - Follow the instructions on their website.
   - Get your MONGODB_URI for the .env.local file.
8. **Creating the '.env.local' File**
   - In the root directory of your project create a new file named '.env.local'.
   - Open the '.env.local' file and add the following enviroment variables to the file, replacing the placeholder values with your own.
```   
SMTP2GO_USER=your_smtp2go_username
SMTP2GO_PASS=your_smtp2go_password
SENDER_EMAIL=your_smtp2go_email
RECIPIENT_EMAIL=your_notification_email@example.com
MONGODB_URI=your_mongodb_connection_string
```
   - Example '.env.local' file:
```
SMTP2GO_USER=my_smtp2go_user
SMTP2GO_PASS=my_smtp2go_pass
SENDER_EMAIL=myemail@example.com
RECIPIENT_EMAIL=myemail@example.com
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
```
## Putting Everything Together
**Circuit Diagram:**
- Connect the DHT11 sensor to GPIO15.
- Connect the light sensor to ADC pin 27.
- Connect the soil moisture sensor to ADC pin 26.
- Connect the relay module to GPIO2.
- Connect the RGB LED to GPIO17 (red), GPIO18 (green), and GPIO19 (blue).

## Electrical Calculations
### Disclaimer
# This is an approximation. Do not rely solely on these calculations if you want to do this project. Please verify and control everything yourself to ensure safety and proper functioning of your project.

| **Component**         | **Operating Voltage** | **Operating Current (mA)** | **Resistor Needed (Ohms)** | **Remarks**                          |
|-----------------------|-----------------------|----------------------------|----------------------------|--------------------------------------|
| Raspberry Pi Pico W   | 3.3V                  | -                          | -                          | Power supply for all components      |
| DHT11 Sensor          | 3.3V-5V               | 2.5                        | -                          | Connect to GPIO pin                  |
| CdS Photoresistor     | 3.3V                  | <1                         | -                          | Connect in series with a resistor    |
| Soil Moisture Sensor  | 3.3V                  | 20                         | -                          | Connect to ADC pin                   |
| Relay Module          | 3.3V-5V               | 70                         | -                          | Connect to GPIO pin with transistor  |
| RGB LED (each color)  | 3.3V                  | 20 (each)                  | 100 (for each color)       | Use separate resistors for R, G, B   |
| Water Pump            | 3V                    | 150                        | -                          | Connect via relay module             |

### Total Current Calculation

- **DHT11 Sensor**: 2.5mA
- **CdS Photoresistor**: ~1mA
- **Soil Moisture Sensor**: 20mA
- **Relay Module**: 70mA
- **RGB LED (all colors on)**: 60mA (20mA per color)
- **Water Pump**: 150mA

**Total Current = 2.5mA + 1mA + 20mA + 70mA + 60mA + 150mA = 303.5mA**

## Platform
**Platform Choice:**
- **Next.js**: Chosen for its ease of use in building responsive web applications and its excellent support for TypeScript and React.
- **Local Hosting**: The dashboard is hosted locally for this project, but it can be scaled to a cloud-based solution in the future.
- **Database**: Data is stored in a MongoDB instance, which allows for efficient querying and storage of time-series data.

### Transmitting the Data / Connectivity

**How is the data transmitted to the internet or local server?**

Data is transmitted from the Raspberry Pi Pico W to a local server using WiFi and HTTP POST requests. The process involves the following steps:

1. **Data Collection**: The Raspberry Pi Pico W gathers sensor readings (temperature, humidity, light intensity, and soil moisture).
2. **WiFi Connection**: The device connects to the local WiFi network.
3. **HTTP POST Request**: Sensor data is formatted into a JSON object and sent to the Next.js server using an HTTP POST request.
4. **Server Processing**: The Next.js server receives the data, processes it, and stores it in a MongoDB database.

**How often is the data sent?**

Data is sent every 60 seconds to balance the need for real-time monitoring with power consumption.

**Protocols Used:**

- **WiFi**: For connecting the Raspberry Pi Pico W to the local network.
  - **Advantages**: Reliable and widely available.
  - **Considerations**: Power consumption is higher, but manageable with a stable power source.
- **HTTP**: For transmitting sensor data to the Next.js server.
  - **Advantages**: Simple to implement and integrates well with web applications.
  - **Considerations**: Slightly less efficient than other protocols like MQTT, but suitable for the project's data transmission frequency.


## Presenting the Data
The dashboard is built using React and displays real-time data from the sensors. Data is preserved in a MongoDB database and fetched every 2 seconds for the dashboard.

![Dashboard](/public/dashboard.png)

**Database Choice:**
- **MongoDB**: Chosen for its scalability and efficiency in handling large volumes of time-series data.

## Finalizing the Design
The final project successfully monitors and controls the grow house environment, providing valuable data and automation. Future improvements could include calculating and implementing a cloud-based dashboard for remote monitoring. Additionally, enhancements could be made in calculating the power requirements to ensure the system operates independently without being connected to a computer. It would also be beneficial to configure how frequently the system reads data, saves data to the database, and other related parameters to optimize performance and resource utilization.

![Prototype](/public/pic.png)

---
