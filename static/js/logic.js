// Creating map object
// var myMap = L.map("map", {
//   center: [
//     37.09, -95.71
//   ],
//   zoom: 4,
// });

function createMap(markers, heat) {

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
    "2016": markers[0],
    "2017": markers[1],
    "2018": markers[2],
    "2019": markers[3],
    "Heat 2016": heat[0],
    "Heat 2017": heat[1],
    "Heat 2018": heat[2],
    "Heat 2019": heat[3]
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, markers[0]]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(map);
}


// Assemble API query URL
var file = "static/data/main.csv";
// var file1 = "static/data/short2016.csv";
// var file2 = "static/data/short2017.csv";
// var file3 = "static/data/short2018.csv";
// var file4 = "data/main2019.csv";

  d3.csv(file, function(error, data) {
    if (error) {
        console.error('Oh dear, something went wrong: ' + error);
    }
    else {
      console.log(data[0]);
      // Create a new marker cluster group
      var markers1 = L.markerClusterGroup();
      var markers2 = L.markerClusterGroup();
      var markers3 = L.markerClusterGroup();
      var markers4 = L.markerClusterGroup();
      var heat1 = [];
      var heat2 = [];
      var heat3 = [];
      var heat4 = [];
      // var markers4 = L.markerClusterGroup();
      console.log(data.length);
    
      // Loop through data
      for (var i = 0; i < data.length; i++) {
    
        // Set the data location property to a variable
        var lat = data[i].Lat;
        var lng = data[i].Lng;
    
        // Check for location property
        if (lat && lng) {
          if (data[i].Year == 2016) {
            // Add a new marker to the cluster group and bind a pop-up
            markers1.addLayer(L.marker([lat, lng])
              .bindPopup(data[i].Description));
            heat1.push([lat, lng]);
          }
          else if (data[i].Year == 2017) {
            // Add a new marker to the cluster group and bind a pop-up
            markers2.addLayer(L.marker([lat, lng])
              .bindPopup(data[i].Description));
            heat2.push([lat, lng]);
          }
          else if (data[i].Year == 2018) {
            // Add a new marker to the cluster group and bind a pop-up
            markers3.addLayer(L.marker([lat, lng])
              .bindPopup(data[i].Description));
            heat3.push([lat, lng]);
          }
          else if (data[i].Year == 2019) {
            // Add a new marker to the cluster group and bind a pop-up
            markers4.addLayer(L.marker([lat, lng])
              .bindPopup(data[i].Description));
            heat4.push([lat, lng]);
          }
        }
    
      }
    
      // Add our marker cluster layer to the map
      // myMap.addLayer(markers);
      var heat2016 = L.heatLayer(heat1, {
        radius: 50,
        blur: 35
      });
      var heat2017 = L.heatLayer(heat2, {
        radius: 50,
        blur: 35
      });
      var heat2018 = L.heatLayer(heat3, {
        radius: 50,
        blur: 35
      });
      var heat2019 = L.heatLayer(heat4, {
        radius: 50,
        blur: 35
      });
      console.log(data[0]);
      var markers = [markers1,markers2,markers3,markers4];
      var heat = [heat2016, heat2017, heat2018, heat2019];
      createMap(markers, heat);


      // Ashlee Code
      var listStates = ["AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
      var selectorInfo = [];


      // create state and city list from all data
      data.forEach(element => {

        // test to see if element is already an object in the array
        // if found, append City to cityName
        if(selectorInfo.some(stateObj => stateObj.stateName == element.State)){
                
            var cityList = selectorInfo.find(stateObj => stateObj.stateName == element.State).cityName

            // add City to cityName object array if not already there
            if(!(cityList.some(cityElm => cityElm == element.City))){

                selectorInfo.find(stateObj => stateObj.stateName == element.State).cityName.push(element.City);
                
            }
        }

        // if NOT found, create new object with stateName and cityName array, push to list of states
        else{
            selectorInfo.push({
                "stateName": element.State,
                "cityName": [element.City]
                }
            );

        };

      });
    

      init();

      //define change to Year
      d3.selectAll("#selDatasetYEARLEFT").on('change', optionChangedYEARLEFT);

      function optionChangedYEARLEFT() {
 
        var changedStateData = formatDataState();

        Plotly.restyle("chartLeft", "x", [changedStateData[0]]);
        Plotly.restyle("chartLeft", "y", [changedStateData[1]]);


      };



      //define change to State
      d3.selectAll("#selDatasetSTATE").on('change', optionChangedSTATE);


      function optionChangedSTATE() {

        //select dropdown
        var yearDrop = d3.select("#selDatasetYEARLEFT").node().value;

        var stateDrop = d3.select("#selDatasetSTATE").node().value;

        // change graph to state data selected
        var changedStateData = formatDataState();
        console.log(changedStateData);
        Plotly.restyle("chartLeft", "x", [changedStateData[0]]);
        Plotly.restyle("chartLeft", "y", [changedStateData[1]]);

        var cityList = selectorInfo.find(stateObj => stateObj.stateName == stateDrop).cityName.sort();

        var selectCity_list = d3.select("#selDatasetCITY");
        selectCity_list.html("<option></option>");

        cityList.forEach(Object=>{
            var option = selectCity_list.append("option");
            option.text(Object);

        });   
      };

      d3.selectAll("#selDatasetCITY").on('change', optionChangedCITY);

      function optionChangedCITY() {

        var yearDrop = d3.select("#selDatasetYEARLEFT").node().value;
        var stateDrop = d3.select("#selDatasetSTATE").node().value;
        var cityDrop = d3.select("#selDatasetCITY").node().value;

        var dataByYear = data.filter(accidentObj => accidentObj.Year === yearDrop);

        // filter data for state
        var stateData = dataByYear.filter(accidentObj => accidentObj.State === stateDrop);

        if(cityDrop === ""){
            var cityData = stateData;
        }
        else{
            //filter data for city
            var cityData = stateData.filter(accidentObj => accidentObj.City === cityDrop);
        }

        // initialize data to zeros
        var yValues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        // parse data to get hour of each accident and increase count of y value
        cityData.forEach(Obj=>{
 
            yValues[Obj.Hour] += 1;
        });

        Plotly.restyle("chartLeft", "y", [yValues]);

      };

      //define change to Right Year dropdown
      d3.selectAll("#selDatasetYEAR").on('change', optionChangedYEAR);

      function optionChangedYEAR() {

        var yValues = formatDataYear();

        Plotly.restyle("chartRight", "y", [yValues]);
      };


      function init(){


        // initialize to AL since it is first in the alphabet
        var dataArray = formatDataState();

        var trace = {
            type: "scatter",
            mode: "lines",
            x: dataArray[0],
            y: dataArray[1],
            line: {
              color: "#17BECF"
            }
        };

        var layout = {
            xaxis: {
              title: {
                text: 'Hour of the Day'
              },
            },
            yaxis: {
              title: {
                text: 'Count of Accidents'
              }
            }
          };

        Plotly.newPlot("chartLeft", [trace], layout);



        var dataArray2 = formatDataYear();

        var trace2 = {
            type: "bar",
            x: listStates,
            y: dataArray2,
        };

        var layout2 = {
            xaxis: {
              title: {
                text: 'State'
              },
            },
            yaxis: {
              title: {
                text: 'Count of Accidents'
              }
            }
          };

        Plotly.newPlot("chartRight", [trace2], layout2);     

      };

      // create function to return cleaned data on state choice
      function formatDataState(){

        var yearDrop = d3.select("#selDatasetYEARLEFT").node().value;

        var stateDrop = d3.select("#selDatasetSTATE").node().value;

        var dataByYear = data.filter(accidentObj => accidentObj.Year === yearDrop);
    
        
        // filter data for state
        var stateData = dataByYear.filter(accidentObj => accidentObj.State === stateDrop);

        // initialize data to zeros
        var xValues = ["12a","1a", "2a", "3a","4a","5a", "6a", "7a","8a","9a", "10a", "11a","12p","1p", "2p", "3p","4p","5p", "6p", "7p","8p","9p", "10p", "11p"]
        var yValues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        // parse data to get hour of each accident and increase count of y value
        stateData.forEach(Obj=>{

            yValues[Obj.Hour] += 1;
        });

        return [xValues,yValues];

      };

      function formatDataYear(){

        var yearDrop = d3.select("#selDatasetYEAR").node().value;

        var dataByYear = data.filter(accidentObj => accidentObj.Year === yearDrop);

        var yValues = [];


        listStates.forEach(element=>{
            
            var numAccidents = dataByYear.filter(accidentObj => accidentObj.State === element).length;

            yValues.push(numAccidents);

        });

        return yValues;

      };
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