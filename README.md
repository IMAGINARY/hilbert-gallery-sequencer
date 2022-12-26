# hilbert-gallery-sequencer

Sequencing server for hilbert-gallery.

## Description

This is a server process that executes a Hilbert Gallery timeline controlling the global timing. 
It is designed to be used with the [hilbert-gallery](https://github.com/IMAGINARY/hilbert-gallery) 
app.

### Lively Exhibition

The Lively Exhibition system allows fast and dynamic curation of exhibitions from videos and photos donated to a museum
by their community. Museum staff can easily assemble an exhibition by selecting images from the system’s collection and
placing them on different screens in the space.

The system empowers the museum community to participate in the creation of exhibitions. They can donate images easily
through a website, even from their phones during a visit.

The project was developed for an installation at the [Fasnachtsmuseum Schloss Langenstein](https://www.fasnachtsmuseum.de/).

## Funding

This package is part of the project museum4punkt0 - Digital Strategies for the
Museum of the Future, sub-project Kulturgut Fastnacht digital (Lively
Exhibition). The project museum4punkt0 is funded by the Federal Government
Commissioner for Culture and the Media in accordance with a resolution issued by
the German Bundestag (Parliament of the Federal Republic of Germany). Further
information: www.museum4punkt0.de

![Logo of the Federal Government Commissioner for Culture and the Media][logo-bmk]
![Logo of NeustartKultur][logo-neustartkultur]

## Installation

See the full installation instructions within `hilbert-gallery` system in the 
[hilbert-gallery](https://github.com/IMAGINARY/hilbert-gallery) repository.

Run

```
npm install
```

from the root directory of the project.

## Usage

Run

```
npm start
```

from the root directory of the project.

## Dependencies

Requires node.js and npm (version 12 or higher).

## Configuration

The server accepts settings through the following environment variables:

- `PORT` (default: `4123`): The port to listen on.
- `API_KEYS` (required): A list of API keys that this server will accept to authenticate requests.
- `HILBERT_GALLERY_API_URL` (default: `http://localhost`): The URL of the `hilbert-gallery` server.
- `HILBERT_GALLERY_API_KEY` (required): The key to authenticate with the `hilbert-gallery` API.

It's possible to create `.env` file in the root directory of the project and set the variables there.

### API Keys

The server accepts requests only from clients that provide a valid API key. 
The API keys are configured through the API_KEYS environment variable.

To generate random API keys, you can use the following command:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Credits

Developed by Eric Londaits <eric.londaits@imaginary.org> for IMAGINARY gGmbH.

## License

Copyright © 2022 IMAGINARY gGmbH

Licensed under the MIT license (see the [`LICENSE`](LICENSE) file).

[logo-bmk]:
https://github.com/museum4punkt0/Object-by-Object/blob/77bba25aa5a7f9948d4fd6f0b59f5bfb56ae89e2/04%20Logos/BKM_Fz_2017_Web_de.gif
[logo-neustartkultur]:
https://github.com/museum4punkt0/Object-by-Object/blob/22f4e86d4d213c87afdba45454bf62f4253cada1/04%20Logos/BKM_Neustart_Kultur_Wortmarke_pos_RGB_RZ_web.jpg
