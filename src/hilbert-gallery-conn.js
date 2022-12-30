const axios = require('axios');

const { HILBERT_GALLERY_API_KEY } = process.env;
const HILBERT_GALLERY_API_URL = process.env.HILBERT_GALLERY_API_URL || 'http://localhost';

axios.defaults.headers.common['x-api-key'] = HILBERT_GALLERY_API_KEY;

async function getStations() {
  return axios.get(`${HILBERT_GALLERY_API_URL}/api/v1/stations`);
}

async function getPlaylist(id) {
  const response = await axios.get(`${HILBERT_GALLERY_API_URL}/api/v1/timelines/${id}/playlist`);
  return response.data;
}

async function viewerSend(stationId, message) {
  return axios.patch(`${HILBERT_GALLERY_API_URL}/api/v1/display/${stationId}/update`, {
    message,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function clear(stationId) {
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
  getPlaylist,
  viewerSend,
  clear,
  preload,
  show,
};
