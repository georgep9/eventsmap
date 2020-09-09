var express = require('express');
const axios = require('axios');
const Geohash = require('ngeohash');
var router = express.Router();

/* GET home page. */
router.get('/:genre/:lat/:lng/:zoom', function(req, res, next) {

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?`;

    const lat = parseInt(req.params.lat);
    const lng = parseInt(req.params.lng);
    let zoom = parseInt(req.params.zoom);
    if (zoom > 9){ zoom = 9; }
    const geohash = Geohash.encode(lat, lng, zoom);

    url += `&geoPoint=${geohash}`;

    const genre = req.params.genre;
    if (genre !== "All"){
        url += `&classificationName=${genre}`;
    }

    const keywords = req.query.keywords;
    if (keywords !== ""){
        url += `&keyword=${keywords}`;
    }

    url += `&apikey=1GTbZxJ7g6XHGZIENkKhEn4nb55nPixn`;

    console.log(url);

    axios.get(url)
        .then((response) => {
            try{
                const events = response.data._embedded.events;
                const eventsFiltered = filterEvents(events);
                res.json(eventsFiltered);
            }
            catch (error) {
                res.json({error: 'No events found.'});
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({ error: 'Error requesting Tickmaster API'});
            
        })

});

function filterEvents(events){

    let filtered = {};

    events.forEach((event) => {
        const name = event.name;
        const url = event.url;
        const lat = event._embedded.venues[0].location.latitude;
        const lng = event._embedded.venues[0].location.longitude;

        filtered[name] = {
            name: name,
            url: url,
            lat: lat,
            lng: lng
        }
    })

    
    return filtered;
}

module.exports = router;
