const LifxClient = require("node-lifx").Client;

const DEFAULT_BRIGHTNESS = 50;
const SATURATION = 100;
const DURATION = 600;
const COLORS = [0, 30, 60, 120, 180, 210, 240, 300];

module.exports = (function () {

  function PartyTime(lightIp, brightness) {
    this.client = new LifxClient();
    this.client.init();
    this.client.on("light-new", (light) => {
      if (light.address === lightIp) {
        this.light = light;
      }
    });

    this.brightness = brightness || DEFAULT_BRIGHTNESS;
  }

  PartyTime.prototype.start = function () {
    let prev = -1;
    this.light.on();
    setInterval(() => {
      let selection = Math.floor(Math.random() * COLORS.length);
      while (selection === prev) selection = Math.floor(Math.random() * COLORS.length);
      prev = selection;
      this.light.color(COLORS[selection], SATURATION, this.brightness);
    }, DURATION);
  }

  PartyTime.prototype.stop = function () {
    this.light.off();
  }

  return PartyTime;

})();
