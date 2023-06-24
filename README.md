# MQTT Complex Event Processing

"MQTT Complex Event Processing" is a repository showcasing an advanced design pattern involving MQTT, simulated drones, and complex event processing. The system creates simulated drones that emit data, processes the data to detect specific events, and issues alerts when these events occur.

Key Components:
1. **Drone Emulator (client.js)**: A Node.js script that simulates 11 drones, each emitting their own data every second. Ten drones generate randomized values, while the 11th drone is programmed to continuously emit data that triggers a specific event (being stationary for more than 10 minutes at an altitude of above 100).
2. **Complex Event Processor (cep.js)**: This script subscribes to the data broadcasted by the drones. It maintains an array of JSON objects representing each drone and their data. Additionally, it holds internal arrays and JSON properties to track and recognize specific events.
3. **Alert System (server.js)**: A separate Node.js instance that subscribes only to alerts issued by the complex event processor. It logs these alerts for user visibility.

When an event (such as a drone remaining stationary for more than 10 minutes at an altitude of above 100) is detected, an alert is published to the "/drones/alerts" MQTT topic. This system showcases the use of MQTT for real-time data transfer and complex event processing in a distributed system.

