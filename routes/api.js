var express = require('express');
const axios = require('axios');
const Geohash = require('ngeohash');
const date = require('date-and-time');
var router = express.Router();



/* GET home page. */
router.get('/:category/:when/:lat/:lng/:radius', function(req, res, next) {

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?&size=40&sort=relevance,desc`;

    const category = req.params.category;
    if (category !== "All"){
        url += `&classificationName=${category}`;
    }

    const now = new Date();
    const when = req.params.when;
    switch(when) {
        case 'Today':
            const today = date.format(now, 'YYYY-MM-DDTHH:mm:ss') + 'Z';
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


    const radius = Math.round(parseFloat(req.params.radius)/1000); // km
    url += `&radius=${radius}&unit=km`;

    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const geohash = Geohash.encode(lat, lng);

    url += `&geoPoint=${geohash}`;

    
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
            console.log(url);
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
            const img = event.images[0].url;
            const date = event.dates.start.localDate;


            const lat = event._embedded.venues[0].location.latitude;
            const lng = event._embedded.venues[0].location.longitude;

            filtered.push({
                name: name,
                url: url,
                img: img,
                date: date,
                lat: lat,
                lng: lng
            });
        }
        catch (e) { errorCount++; }
    });

    
    return filtered;
}

module.exports = router;
