const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("connect", () => {
  console.log("MQTT connected");
  let drones;
  drones = populateDrones(10);
  drones.forEach(async function (drone, index) {
    do {
      if (index == 0) {
        publishAlertfulDrone();
      }
      changeValues(drone);
      publishDrone(drone);
      await sleep(1000);
    } while (true);
  });
});

function publishAlertfulDrone() {
  // THIS PUBLISHES A STATIC DATA DRONE TO TRIGGER SECOND CEP SCENARIO
  let topic = "/drones/short/11/latlong";
  let message = "2,3";
  client.publish(topic, message);
  topic = "/drones/short/11/altitude";
  message = "120";
  client.publish(topic, message);
}

function populateDrones(n, drones) {
  drones = [];
  for (let i = 0; i < n; i++) {
    drones[i] = {
      type: i % 2 == 0 ? "short" : "long",
      id: i,
      battery: 50 + Math.floor(Math.random() * 50),
      latlong: {
        lat: Math.floor(Math.random() * 3),
        long: Math.floor(Math.random() * 3),
      },
      altitude: Math.floor(Math.random() * 150 + 30),
      speed: Math.floor(Math.random() * 1000),
    };
  }
  return drones;
}

function changeValues(drone) {
  drone.battery -= drone.battery > 1 ? 2 : 0; // Reduce battery by 2 every cycle until it hits 0 or 1.
  drone.latlong.lat += Math.floor(Math.random() * 10) - 5; // Change coordinates by + or - 5.
  drone.latlong.long += Math.floor(Math.random() * 10) - 5;
  drone.altitude +=
    drone.altitude < 30 ? 40 : Math.floor(Math.random() * 20) - 10; // Change altitude by + or - 10 if it is >= than 30, or raise by 40 if below 30 (too low).
  drone.speed += drone.speed < 200 ? 0 : Math.floor(Math.random() * 200) - 100; // Change drone speed by + or - 100.
}

function publishDrone(drone) {
  // Publish battery health.
  let topic = "/drones/" + drone.type + "/" + drone.id + "/battery";
  let data = drone.battery.toString();
  client.publish(topic, data);

  // Publish coordinates
  topic = "/drones/" + drone.type + "/" + drone.id + "/latlong";
  data = drone.latlong.lat + "," + drone.latlong.long;
  client.publish(topic, data);

  // Publish Altitude
  topic = "/drones/" + drone.type + "/" + drone.id + "/altitude";
  data = drone.altitude.toString();
  client.publish(topic, data);

  // Publish Speed
  topic = "/drones/" + drone.type + "/" + drone.id + "/speed";
  data = drone.speed.toString();
  client.publish(topic, data);

  console.log("Successfully published data from drone ID " + drone.id);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
