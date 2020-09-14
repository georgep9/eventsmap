
// initialize leaflet map
var mymap = L.map('mapid', {
  center: [-27.470125, 153.021072],
  zoom: 13,
  worldCopyJump: true
});

// create map using tiles using Jawgs.io API
const accessToken = '5zcQsTkqVyvPVcBaiCQThZ88UuyxMzmrsWwt2wNCkGjB5U8Bb3D1ofLIXaT33wGp';
L.tileLayer(
    `https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=${accessToken}`, {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
      maxZoom: 17,
      minZoom: 2
    }
  ).addTo(mymap);

let markersLayer = L.markerClusterGroup().addTo(mymap); // marker cluster interaction

// replace default marker icon with custom made
var myIcon = L.icon({
  iconUrl: '../images/icon.png',
  iconSize: [40, 40],
});

// re center map view on clicked marker
function centerOnMarker(e) { mymap.setView(e.target.getLatLng(),mymap.getZoom()); }

/* add markers onto map */
function updateMap(events) {

  markersLayer.clearLayers(); // clear current markers

  // write status message above map
  const messageDiv = document.getElementById('message');
  if (events.error) { // error messages
    messageDiv.innerHTML = `<p style="color:red">${events.error}</p>`;
    return;
  } else {
    messageDiv.innerHTML = `<p style="color:green">${events.length} events found!</p>`;    
  }

  // create marker for each event from events
  events.forEach((event) => {

    // event information
    const name = event.name;
    const url = event.url;
    const img = event.img;
    const date = event.date;
    const lat = parseFloat(event.lat);
    const lng = parseFloat(event.lng);

    // add marker to map
    let marker = L.marker([lat, lng], {icon: myIcon}).addTo(markersLayer);
    marker.bindPopup(`<b>${name}</b><br>\
      <img src="${img}" alt="${name}" width="200"><br> \ 
      <b>Date: </b>${date}<br> \
      <a href="${url}">More information</a>`).on('click', centerOnMarker);

  });

  window.scrollTo(0,document.body.scrollHeight); // scroll to map div (bottom of page)

}

/* request events from the API endpoint */
function fetchEvents() {

  // latitude and longitude of map center
  const latlng = mymap.getCenter();
  const lat = latlng.lat;
  const lng = latlng.lng;

  // radius of current view (top to bottom)
  const bounds = mymap.getBounds();
  const north = L.latLng(bounds.getNorth(), lng);
  const south = L.latLng(bounds.getSouth(), lng);
  const viewRadius = north.distanceTo(south);

  // user form inputs
  const category = document.getElementById('category').value;
  const when = document.getElementById('when').value;
  const keywords = document.getElementById('keywords').value;

  // API request string
  const api = `/api/${category}/${when}/${lat}/${lng}/${viewRadius}?&keywords=${keywords}`;
  console.log(api);

  // fetch events from API endpoint
  fetch(api)
    .then((res) => res.json())
    .then((events) => {
      console.log(events);
      updateMap(events); // update map with events
    })
    .catch((error) => { // server error
      console.log("Error fetching server-side mashup");
      const messageDiv = document.getElementById('message');
      messageDiv.innerHTML = '<p style="color:red">Internal Server Error</p>';
    })
}