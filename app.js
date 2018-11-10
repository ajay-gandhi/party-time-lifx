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

    this.going = false;
    this.prevColor = -1;
    this.brightness = brightness || DEFAULT_BRIGHTNESS;
  }

  PartyTime.prototype.start = function () {
    this.going = true;
    this.light.on();
    this.interval = setInterval(this.nextColor.bind(this), DURATION);
  }

  PartyTime.prototype.stop = function () {
    this.going = false;
  }

  PartyTime.prototype.nextColor = function () {
    if (this.going) {
      // Check if should stop
      this.light.getPower((err, power) => {
        if (power !== 1) this.going = false;
      });

      let selection = Math.floor(Math.random() * COLORS.length);
      while (selection === this.prevColor) selection = Math.floor(Math.random() * COLORS.length);
      this.prevColor = selection;
      this.light.color(COLORS[selection], SATURATION, this.brightness);
    } else {
      clearInterval(this.interval);
      this.light.off();
    }
  }

  return PartyTime;

})();
