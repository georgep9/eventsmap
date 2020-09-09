var mymap = L.map('mapid').setView([-27.470125, 153.021072], 13);

const accessToken = '5zcQsTkqVyvPVcBaiCQThZ88UuyxMzmrsWwt2wNCkGjB5U8Bb3D1ofLIXaT33wGp';

L.tileLayer(
    `https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=${accessToken}`, {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
      maxZoom: 16
    }
  ).addTo(mymap);

function searchEvents() {
  const latlng = mymap.getCenter();
  const lat = latlng.lat;
  const lng = latlng.lng;
  const zoom = mymap.getZoom();

  const genre = document.getElementById('genre').value;
  const keywords = document.getElementById('keywords').value;

  console.log('Lat: ' + lat + ' Lng: ' + lng + ' Zoom: ' + zoom);
  console.log(genre + " " + keywords);

  fetch(`/api/${genre}/${lat}/${lng}/${zoom}?&keywords=${keywords}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log("Error fetching server-side mashup");
    })
}