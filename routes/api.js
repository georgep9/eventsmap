var express = require('express');
const axios = require('axios');
const Geohash = require('ngeohash');
var router = express.Router();



/* GET home page. */
router.get('/:genre/:lat/:lng/:zoom', function(req, res, next) {

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?&size=60&sort=distance,asc`;

    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
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
    console.log(lat + " " + lng);

    axios.get(url)
        .then((response) => {
            try{
                const events = response.data._embedded.events;
                const eventsFiltered = filterEvents(events);
                res.json(eventsFiltered);
            }
            catch (error) {
                console.log(error);
                res.json({error: 'No events found.'});
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({ error: 'Error requesting Tickmaster API'});
            
        })

});

// filter events JSON format for client
function filterEvents(events){

    let filtered = [];

    let errorCount = 0;

    events.forEach((event) => {
        try {
            const name = event.name;
            const url = event.url;



            const lat = event._embedded.venues[0].location.latitude;
            const lng = event._embedded.venues[0].location.longitude;

            filtered.push({
                name: name,
                url: url,
                lat: lat,
                lng: lng
            });
        }
        catch (e) { errorCount++; }
    });

    
    return filtered;
}

module.exports = router;
