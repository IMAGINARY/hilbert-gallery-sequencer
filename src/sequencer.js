const EventEmitter = require('events');
const ViewerConn = require('./viewer-conn');

class Sequencer {
  constructor() {
    this.isPlaying = false;
    this.playlist = null;
    this.heads = [];
    this.timeout = null;
    this.lastDelay = 0;
    this.events = new EventEmitter();
  }

  status() {
    return {
      isPlaying: this.isPlaying,
    };
  }

  stop() {
    if (this.isPlaying) {
      const allStations = Object.keys(this.playlist);

      this.events.emit('stop');
      this.isPlaying = false;
      clearTimeout(this.timeout);
      this.timeout = null;
      this.playlist = null;
      this.heads = [];
      this.delays = [];
      this.lastDelay = 0;

      return Promise.all(allStations.map(stationId => ViewerConn.clear(stationId)));
    }
    return Promise.resolve();
  }

  stepWithTimer() {
    if (this.isPlaying && Object.keys(this.delays).length) {
      // Subtract the last delay
      this.delays = Object.fromEntries(
        Object.entries(this.delays).map(([stationId, delay]) => [stationId, delay - this.lastDelay])
      );
      // Show all images with no delay
      Object.entries(this.delays).forEach(([stationId, delay]) => {
        if (delay <= 0.1) {
          ViewerConn.viewerSend(stationId, this.playlist[stationId][this.heads[stationId]]);
          this.delays[stationId] = this.playlist[stationId][this.heads[stationId]]
            .args.duration * 1000;
          // Cue the next picture
          this.heads[stationId] += 1;
          if (this.heads[stationId] >= this.playlist[stationId].length) {
            this.heads[stationId] = 0;
          }
        }
      });
      // Calculate the next delay
      this.lastDelay = Math.min(...Object.values(this.delays));
      // Sleep to the next delay
      this.timeout = setTimeout(this.stepWithTimer.bind(this), this.lastDelay);
    }
  }

  play(playlist) {
    if (this.isPlaying) {
      this.stop();
    }
    this.events.emit('play');
    this.isPlaying = true;
    this.playlist = playlist;
    const allStations = Object.keys(this.playlist);
    const activeStations = allStations
      .filter(stationId => playlist[stationId].length);
    this.heads = Object.fromEntries(
      activeStations.map(stationId => [stationId, 0])
    );
    this.delays = Object.fromEntries(
      activeStations.map(stationId => [stationId, 0])
    );

    return Promise.all(allStations.map(stationId => ViewerConn.clear(stationId)))
      .then(() => Promise.all(
        activeStations.map(stationId => ViewerConn.preload(stationId, playlist[stationId]))
      ))
      .then(() => {
        this.stepWithTimer();
      });
  }

  updateDisplay(stationId, message) {
    return this.stop()
      .then(() => ViewerConn.viewerSend(stationId, message));
  }
}

module.exports = Sequencer;
