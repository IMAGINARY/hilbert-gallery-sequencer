# Architecture
General description of the system, based on [this idea](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)

## Overview
This is a node.js app that runs as a service and provides an HTTP API.

The app can execute hilbert-gallery timelines, sending updates to the display stations according 
to the timing specified in the timeline.

It's accessed exclusively by the `hilbert-gallery` app, which acts as a front-end. The front-end 
can stop and start the sequencing server, and send it new timelines to execute.

The sequencer updates the display stations by sending HTTP requests to the `hilbert-gallery` app, 
which forwards them using ActionCable (websockets) to the display stations.

## Components

The main entry point is index.js, which starts the server and sets up the HTTP API.

The src directory contains the business logic, implementing the sequencer and the connector to the
display stations.
