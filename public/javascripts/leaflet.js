var mymap = L.map('mapid', {
  center: [-27.470125, 153.021072],
  zoom: 13,
  worldCopyJump: true
});

L.control.scale().addTo(mymap);

const accessToken = '5zcQsTkqVyvPVcBaiCQThZ88UuyxMzmrsWwt2wNCkGjB5U8Bb3D1ofLIXaT33wGp';
L.tileLayer(
    `https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=${accessToken}`, {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
      maxZoom: 16,
      minZoom: 2
    }
  ).addTo(mymap);

let markersLayer = L.markerClusterGroup().addTo(mymap);



function addMarkers(events) {

  markersLayer.clearLayers();

  console.log(events);

  events.forEach((event) => {
    const name = event.name;
    const url = event.url;
    const lat = parseFloat(event.lat);
    const lng = parseFloat(event.lng);

    console.log(name);
    console.log(url);
    console.log([lat, lng]);

    let marker = L.marker([lat, lng]).addTo(markersLayer);
    marker.bindPopup(`<b>${name}</b><br><a href="${url}">More information</a>`);
  });

}

function searchEvents() {

  const latlng = mymap.getCenter();
  const lat = latlng.lat;
  const lng = latlng.lng;

  const bounds = mymap.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();
  const viewRadius = northWest.distanceTo(southEast);

  const genre = document.getElementById('genre').value;
  const keywords = document.getElementById('keywords').value;

  console.log('Lat: ' + lat + ' Lng: ' + lng + ' Radius (corner to corner): ' + viewRadius);
  console.log(genre + " " + keywords);

  fetch(`/api/${genre}/${lat}/${lng}/${viewRadius}?&keywords=${keywords}`)
    .then((res) => res.json())
    .then((events) => {
      console.log(events);
      addMarkers(events);
    })
    .catch((error) => {
      console.log("Error fetching server-side mashup");
    })
}