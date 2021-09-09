var express = require('express');
const axios = require('axios');
const Geohash = require('ngeohash');
const date = require('date-and-time');
var router = express.Router();
require('dotenv').config();

/* API endpoint for requesting events */
router.get('/:category/:when/:lat/:lng/:radius', function(req, res, next) {

    // Ticketmaster API url base
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?&size=40&sort=relevance,desc`;

    // add classification query to url if 'category' parameter specified
    const category = req.params.category;
    if (category !== "All"){
        url += `&classificationName=${category}`;
    }

    // add start date query to url
    const now = new Date();
    const today = date.format(now, 'YYYY-MM-DDTHH:mm:ss') + 'Z';
    url += `&startDateTime=${today}`;

    // add end date query to url if 'when' parameter specified
    const when = req.params.when;
    switch(when) {
        case 'Today':
            url += `&endDateTime=${today}`;
            break;
        case 'This week':
            const thisWeek = date.format(date.addDays(now, 7), 'YYYY-MM-DDTHH:mm:ss') + 'Z';
            url += `&endDateTime=${thisWeek}`;
            break;
        case 'This month':
            const thisMonth = date.format(date.addMonths(now, 1), 'YYYY-MM-DDTHH:mm:ss') + 'Z';
            url += `&endDateTime=${thisMonth}`;
            break;
        case 'This year':
            const thisYear = date.format(date.addYears(now, 1), 'YYYY-MM-DDTHH:mm:ss') + 'Z';
            url += `&endDateTime=${thisYear}`;
            break;
        default:
            break;
    }

    // add geopoint query to url from latitude 'lat' and longitude 'lng' provided
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const geohash = Geohash.encode(lat, lng);
    url += `&geoPoint=${geohash}`;

    // add radius query in km to url from 'radius' (searches events within radius from lat lng)
    const radius = Math.round(parseFloat(req.params.radius)/1000); // km
    url += `&radius=${radius}&unit=km`;

    // add keywords query to url
    const keywords = req.query.keywords;
    if (keywords !== ""){
        url += `&keyword=${keywords}`;
    }

    // add API key to url
    url += "&apikey=" + process.env.TM_KEY;

    // do API request
    axios.get(url)
        .then((response) => {
            // throws error if events not in response
            try{
                // filter JSON then return response
                const events = response.data._embedded.events;
                const eventsFiltered = filterEvents(events);
                if (eventsFiltered.length > 0){
                    res.json(eventsFiltered);
                } else {
                    res.json({error: 'No events found.'});
                }
                
            }
            catch (error) { // no events; return error
                console.log(error);
                console.log('No events found.');
                console.log(url);
                res.json({error: 'No events found.'});
            }
        })
        .catch((error) => { // failed to fetch Ticketmaster API
            
            console.log('Error requesting Tickmaster API');
            console.log(url);
            res.json({ error: 'Error requesting Tickmaster API'});
        })

});

// filter events JSON for only information needed
function filterEvents(events){

    let filtered = [];

    let errorCount = 0;

    // save name, url, img, date, latitude, longitude for each event
    events.forEach((event) => {
        try {
            const name = event.name;
            const url = event.url;
            const img = event.images[0].url;
            const venue = event._embedded.venues[0].name;
            const city = event._embedded.venues[0].city.name;
            const state = event._embedded.venues[0].state.name;
            const date = event.dates.start.localDate;
            const lat = event._embedded.venues[0].location.latitude;
            const lng = event._embedded.venues[0].location.longitude;
    
            filtered.push({
                name: name,
                url: url,
                img: img,
                venue: venue,
                city: city,
                state: state,
                date: date,
                lat: lat,
                lng: lng
            });
        } catch (e) { errorCount++; }
        
    });
    
    console.log("No. of events that failed to be filtered: " + errorCount);

    return filtered;
}

module.exports = router;
