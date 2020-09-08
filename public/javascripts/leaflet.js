var mymap = L.map('mapid').setView([51.505, -0.09], 13);

const accessToken = '5zcQsTkqVyvPVcBaiCQThZ88UuyxMzmrsWwt2wNCkGjB5U8Bb3D1ofLIXaT33wGp';

L.tileLayer(
    `https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=${accessToken}`, {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
      maxZoom: 22
    }
  ).addTo(mymap);