const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
let drones = [];
let lowBatteryDrones = [];

client.on("connect", () => {
  console.log("mqtt connected");
  client.subscribe("/drones/#");
});

client.on("message", (topic, message) => {
  if (topic != "/drones/alerts") {
    let levels = topic.substring(8).split("/");
    let id = parseInt(levels[1]);
    if (drones[id] === undefined) initializeDrone(id, levels[0]);

    handleStationary(levels[2], drones[id], message);
    handleLowBattery(levels[2], message, id);

    assign(drones[id], levels[2].toString(), message.toString());

    handleAltitude(levels[2], drones[id]);

    checkForSecondAlert(drones[id], id);
  }
});

function initializeDrone(id, type) {
  drones[id] = {
    type: undefined,
    battery: undefined,
    altitude: undefined,
    speed: undefined,
    latlong: undefined,
    stationary: {
      value: false,
      time: 0,
    },
    highAltitude: {
      value: false,
      time: 0,
    },
    alerted: false,
  };
  drones[id].type = type;
}

function checkForSecondAlert(drone, id) {
  if (
    !drone.alerted &&
    drone.highAltitude.time >= 10 &&
    drone.stationary.time >= 10
  ) {
    drone.alerted = true;
    let topic = "/drones/alerts";
    let message = "Drone " + id + " is stationary and above 100 altitude.";
    client.publish(topic, message);
  }
}

function handleAltitude(type, drone) {
  if (type == "altitude") {
    if (drone.altitude > 100) {
      if (drone.highAltitude.value == false) {
        drone.highAltitude.value = true;
        drone.highAltitude.time++;
      } else {
        drone.highAltitude.time++;
      }
    }
  }
}

function handleStationary(type, drone, newlatlong) {
  if (type == "latlong") {
    if (drone.latlong == newlatlong) {
      if (drone.stationary.value == false) {
        drone.stationary.time++;
        drone.stationary.value = true;
      } else {
        drone.stationary.time++;
      }
    }
  }
}

function handleLowBattery(type, message, id) {
  if (
    type == "battery" &&
    parseInt(message) < 10 &&
    !lowBatteryDrones.includes(id)
  ) {
    lowBatteryDrones[lowBatteryDrones.length] = id;
    if (lowBatteryDrones.length >= 2) {
      lowBatteryDrones[lowBatteryDrones.length] = id;
      if (lowBatteryDrones.length >= 2) {
        let topic = "/drones/alerts";
        let message =
          "ALERT: " +
          lowBatteryDrones.length +
          " drones are low on battery (<10)!";
        client.publish(topic, message);
      }
    }
  }
}

function assign(obj, prop, value) {
  if (typeof prop === "string") prop = prop.split(".");

  if (prop.length > 1) {
    var e = prop.shift();
    assign(
      (obj[e] =
        Object.prototype.toString.call(obj[e]) === "[object Object]"
          ? obj[e]
          : {}),
      prop,
      value
    );
  } else obj[prop[0]] = value;
}
