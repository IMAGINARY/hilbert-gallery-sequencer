require('dotenv').config();
const express = require('express');
const Sequencer = require('./src/sequencer');

const app = express();
const port = process.env.PORT || 4123;
const validAPIKeys = (process.env.API_KEYS && process.env.API_KEYS.split(',')) || [];

if (validAPIKeys.length === 0) {
  console.error('No API keys found. Please set the API_KEYS environment variable.');
  process.exit(1);
}

const sequencer = new Sequencer();

app.use(express.json());
// Authenticate requests by checking the request header for a valid API key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && validAPIKeys.includes(apiKey)) {
    next(); // API key is valid, continue
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/status', async (req, res) => {
  console.log('Received status request');
  res.status(200).send(sequencer.status());
});

app.post('/stop', async (req, res) => {
  console.log('Received stop request');

  await sequencer.stop();
  res.status(200).send(sequencer.status());
});

app.post('/start', async (req, res) => {
  console.log('Received start request');

  sequencer.play(req.body);
  res.status(200).send(sequencer.status());
});

app.post('/display/:stationId/update', async (req, res) => {
  console.log('Received update request for station', req.params.stationId);

  sequencer.updateDisplay(req.params.stationId, req.body);
  res.status(200).send(sequencer.status());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
