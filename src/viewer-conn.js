const axios = require('axios');

const { HILBERT_GALLERY_API_KEY } = process.env;
const HILBERT_GALLERY_API_URL = process.env.HILBERT_GALLERY_API_URL || 'http://localhost';

axios.defaults.headers.common['x-api-key'] = HILBERT_GALLERY_API_KEY;

async function getStations() {
  return axios.get(`${HILBERT_GALLERY_API_URL}/api/v1/stations`);
}

async function viewerSend(stationId, message) {
  console.log('sending', message);
  return axios.patch(`${HILBERT_GALLERY_API_URL}/api/v1/display/${stationId}/update`, {
    message,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function clear(stationId) {
  console.log(`Clearing station ${stationId}`);
  return viewerSend(stationId, {
    action: 'clear',
    args: {
      transition: { type: 'fade' },
    },
  });
}

async function show(stationId, exhibit, userOptions = {}) {
  const defaultOptions = {
    fit: 'contain',
  };

  const options = Object.assign({}, defaultOptions, userOptions);

 return viewerSend(stationId, {
    action: 'show',
    args: {
      mimetype: exhibit.file_type,
      url: exhibit.file_url,
      fit: options.fit,
      color: 'black',
      transition: {
        type: 'fade',
        options: {
          duration: 1,
          color: 'black',
        },
      },
      animation: {
        type: 'none',
        options: {},
      },
    },
  });
}

async function preload(stationId, playlist) {
  console.log('Preloading', playlist);
  return viewerSend(stationId, {
    action: 'preload',
    args: playlist.map(item => ({
      mimetype: item.args.mimetype,
      url: item.args.url,
    })),
  });
}

module.exports = {
  getStations,
  viewerSend,
  clear,
  preload,
  show,
};
