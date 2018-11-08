const LifxClient = require("node-lifx").Client;

const LIGHT_IP = "192.168.128.103";
const BRIGHTNESS = parseInt(process.argv[2]) || 50;
const SATURATION = 100;
const DURATION = 600;
const COLORS = [0, 30, 60, 120, 180, 210, 240, 300];

const client = new LifxClient();

client.init();

console.log("Starting...");
client.on("light-new", (light) => {
  if (light.address === LIGHT_IP) {
    console.log("Found light");

    let prev = -1;
    light.on();
    setInterval(() => {
      let selection = Math.floor(Math.random() * COLORS.length);
      while (selection === prev) selection = Math.floor(Math.random() * COLORS.length);
      prev = selection;
      light.color(COLORS[selection], SATURATION, BRIGHTNESS);
    }, DURATION);
  }
});

process.on("exit", () => light.off());
