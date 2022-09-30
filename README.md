# eventsmap
Interactive world map for viewing events for concerts, shows, theatre, rallies, and more!

#### Background

University project to demonstrate a server-side API mashup. Combines services Leaflet tiles API for mapping and Ticketmaster API for events searching.

#### Limitations

Due to network limitations and bugs with the Tickmaster API, a maximum of 40 events are searched for, and may result in zero or duplicate events if searching over a large area (eg. continents).

## Run

Either run using NodeJS or Docker.

Listens on port 3000.

#### Nodejs

```
npm install
npm start
```

#### Docker

```
docker build -t eventsmap:latest .
docker run -p 3000:3000 eventsmap:latest
```

