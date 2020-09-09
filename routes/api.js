var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/:genre/:geohash', function(req, res, next) {

    const genre = req.params.genre;
    const geohash = req.params.geohash;

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=${genre}&geopoint=geoPoint=${geohash}&apikey=1GTbZxJ7g6XHGZIENkKhEn4nb55nPixn`

    axios.get(url)
        .then((response) => {
            const events = response.data._embedded.events;
            res.render('api', { events });
        })
        .catch((error) => {
      res.render('error', { error });
    })

});

module.exports = router;
