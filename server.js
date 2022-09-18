const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
let filters = [
  "/drones/#",
  "/drones/short/+/speed",
  "/drones/alerts",
  "/drones/+/+/latlong",
];
client.on("connect", () => {
  console.log("mqtt connected");
  let filterID = 2;
  client.subscribe(filters[filterID]);
  console.log("Filter using parameters: " + filters[filterID]);
});

client.on("message", (topic, message) => {
  console.log(topic + " = " + message);
});
