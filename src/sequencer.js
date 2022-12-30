const EventEmitter = require('events');
const HilbertGallery = require('./hilbert-gallery-conn');

class Sequencer {
  constructor() {
    this.isPlaying = false;
    this.timelineId = null;
    this.playlist = null;
    this.heads = [];
    this.timeout = null;
    this.lastDelay = 0;
    this.events = new EventEmitter();
  }

  status() {
    return {
      isPlaying: this.isPlaying,
      timelineId: this.timelineId,
    };
  }

  stop() {
    if (this.isPlaying) {
      const allStations = Object.keys(this.playlist);

      this.events.emit('stop', this.timelineId);
      this.isPlaying = false;
      this.timelineId = null;
      clearTimeout(this.timeout);
      this.timeout = null;
      this.playlist = null;
      this.heads = [];
      this.delays = [];
      this.lastDelay = 0;

      return Promise.all(allStations.map(stationId => HilbertGallery.clear(stationId)));
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
          HilbertGallery.viewerSend(stationId, this.playlist[stationId][this.heads[stationId]]);
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

  async start(timelineId) {
    const playlist = await HilbertGallery.getPlaylist(timelineId);

    if (this.isPlaying) {
      this.stop();
    }
    this.events.emit('play', timelineId);
    this.isPlaying = true;
    this.timelineId = timelineId;
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

    return Promise.all(allStations.map(stationId => HilbertGallery.clear(stationId)))
      .then(() => Promise.all(
        activeStations.map(stationId => HilbertGallery.preload(stationId, playlist[stationId]))
      ))
      .then(() => {
        this.stepWithTimer();
      });
  }

  updateDisplay(stationId, message) {
    return this.stop()
      .then(() => HilbertGallery.viewerSend(stationId, message));
  }
}

module.exports = Sequencer;
