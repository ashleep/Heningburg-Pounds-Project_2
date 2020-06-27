// Creating map object
// var myMap = L.map("map", {
//   center: [
//     37.09, -95.71
//   ],
//   zoom: 4,
// });

function createMap(marker2016, marker2017, marker2018) {

  // Create the tile layer that will be the background of our map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "2016": marker2016,
    "2017": marker2017,
    "2018": marker2018
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, marker2016]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(map);
}


// Assemble API query URL
var file1 = "static/data/short2016.csv";
var file2 = "static/data/short2017.csv";
var file3 = "static/data/short2018.csv";
// var file4 = "data/main2019.csv";

d3.queue()
  .defer(d3.csv, file1)
  .defer(d3.csv, file2)
  .defer(d3.csv, file3)
  .await(function(error, data1, data2, data3) {
    if (error) {
        console.error('Oh dear, something went wrong: ' + error);
    }
    else {
      console.log(data3[0]);
      // Create a new marker cluster group
      var markers1 = L.markerClusterGroup();
      var markers2 = L.markerClusterGroup();
      var markers3 = L.markerClusterGroup();
      // var markers4 = L.markerClusterGroup();
      console.log(data3.length);
    
      // Loop through data
      for (var i = 0; i < data1.length; i++) {
    
        // Set the data location property to a variable
        var lat = data1[i].Lat;
        var lng = data1[i].Lng;
    
        // Check for location property
        if (lat && lng) {
    
          // Add a new marker to the cluster group and bind a pop-up
          markers1.addLayer(L.marker([lat, lng])
            .bindPopup(data1[i].Description));
        }
    
      }
      for (var i = 0; i < data2.length; i++) {
    
        // Set the data location property to a variable
        var lat = data2[i].Lat;
        var lng = data2[i].Lng;
    
        // Check for location property
        if (lat && lng) {
    
          // Add a new marker to the cluster group and bind a pop-up
          markers2.addLayer(L.marker([lat, lng])
            .bindPopup(data2[i].Description));
        }
    
      }
      for (var i = 0; i < data3.length; i++) {
    
        // Set the data location property to a variable
        var lat = data3[i].Lat;
        var lng = data3[i].Lng;
    
        // Check for location property
        if (lat && lng) {
    
          // Add a new marker to the cluster group and bind a pop-up
          markers3.addLayer(L.marker([lat, lng])
            .bindPopup(data3[i].Description));
        }
    
      }
      // for (var i = 0; i < data4.length; i++) {
    
      //   // Set the data location property to a variable
      //   var lat = data4[i].Lat;
      //   var lng = data4[i].Lng;
    
      //   // Check for location property
      //   if (lat && lng) {
    
      //     // Add a new marker to the cluster group and bind a pop-up
      //     markers4.addLayer(L.marker([lat, lng])
      //       .bindPopup(data4[i].Description));
      //   }
    
      // }
    
      // Add our marker cluster layer to the map
      // myMap.addLayer(markers);
      console.log(data3[0]);
      createMap(markers1,markers2,markers3);
    }
  });

// d3.queue()
//   .defer(d3.csv, file1)
//   .defer(d3.csv, file2)
//   .defer(d3.csv, file3)
//   .await(function(error, data1, data2, data3) {
//     if (error) {
//         console.error('Oh dear, something went wrong: ' + error);
//     }
//     else {
//       // DO STUFF
//     }
//   });