// Creating map object
// var myMap = L.map("map", {
//   center: [
//     37.09, -95.71
//   ],
//   zoom: 4,
// });

tail.select(".select",{
  multiselect:false,
  width:"85%"
});

tail.select(".select-search", {
  search: true,
  width:"90%"
});

var cityInitList = tail.select("#selDatasetCITY");

cityInitList.options.add({
  "State Wide":{
    key: "State Wide",
    value:"State Wide"
  }
});




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

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [1,2,3,4];
    var colors = ['rgb(54,164,213)', 'rgb(109,168,36)','rgb(237,146,46)','rgb(211,61,42)'];
    var labels = [];

    // Add min & max
    var legendInfo = "<h2>Severity</h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
  
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);

}

function createMarker(marker, data){
  var blueMarker = L.AwesomeMarkers.icon({
    icon: 'road',
    markerColor: 'blue'
  });
  var greenMarker = L.AwesomeMarkers.icon({
    icon: 'road',
    markerColor: 'green'
  });
  var orangeMarker = L.AwesomeMarkers.icon({
    icon: 'road',
    markerColor: 'orange'
  });
  var redMarker = L.AwesomeMarkers.icon({
    icon: 'road',
    markerColor: 'red'
  });

  if (data.Severity == 1) {
    marker.addLayer(L.marker([data.Lat, data.Lng], {
      icon: blueMarker
    }).bindPopup(`<p>${data.Description}<br />Severity: 1</p>`));
  }
  else if (data.Severity == 2) {
    marker.addLayer(L.marker([data.Lat, data.Lng], {
      icon: greenMarker
    }).bindPopup(`<p>${data.Description}<br />Severity: 2</p>`));
  }
  else if (data.Severity == 3) {
    marker.addLayer(L.marker([data.Lat, data.Lng], {
      icon: orangeMarker
    }).bindPopup(`<p>${data.Description}<br />Severity: 3</p>`));
  }
  else if (data.Severity == 4) {
    marker.addLayer(L.marker([data.Lat, data.Lng], {
      icon: redMarker
    }).bindPopup(`<p>${data.Description}<br />Severity: 4</p>`));
  }
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
            createMarker(markers1, data[i]);
            // markers1.addLayer(L.marker([lat, lng])
            //   .bindPopup(data[i].Description));
            heat1.push([lat, lng]);
          }
          else if (data[i].Year == 2017) {
            // Add a new marker to the cluster group and bind a pop-up
            createMarker(markers2, data[i]);
            // markers2.addLayer(L.marker([lat, lng])
            //   .bindPopup(data[i].Description));
            heat2.push([lat, lng]);
          }
          else if (data[i].Year == 2018) {
            // Add a new marker to the cluster group and bind a pop-up
            createMarker(markers3, data[i]);
            // markers3.addLayer(L.marker([lat, lng])
            //   .bindPopup(data[i].Description));
            heat3.push([lat, lng]);
          }
          else if (data[i].Year == 2019) {
            // Add a new marker to the cluster group and bind a pop-up
            createMarker(markers4, data[i]);
            // markers4.addLayer(L.marker([lat, lng])
            //   .bindPopup(data[i].Description));
            heat4.push([lat, lng]);
          }
        }
    
      }
    
      // Add our marker cluster layer to the map
      // myMap.addLayer(markers);
      var heat2016 = L.heatLayer(heat1, {
        radius: 30,
        blur: 35
      });
      var heat2017 = L.heatLayer(heat2, {
        radius: 30,
        blur: 35
      });
      var heat2018 = L.heatLayer(heat3, {
        radius: 30,
        blur: 35
      });
      var heat2019 = L.heatLayer(heat4, {
        radius: 30,
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

        
        var selectCity_list = tail.select("#selDatasetCITY");
        selectCity_list.reload();
        
        

        selectCity_list.options.add({
          "State Wide":{
            key: "State Wide",
            value:"State Wide"
          }
        });
        

        cityList.forEach(Object=>{
          selectCity_list.options.add({
            Object:{
              key: Object,
              value:Object
            }
          }); 
        });
        //selectCity_list.reload();
      };


      d3.selectAll("#selDatasetCITY").on('change', optionChangedCITY);

      function optionChangedCITY() {

        var yearDrop = d3.select("#selDatasetYEARLEFT").node().value;
        var stateDrop = d3.select("#selDatasetSTATE").node().value;
        var cityDrop = d3.select("#selDatasetCITY").node().value;
        console.log(cityDrop);

        var dataByYear = data.filter(accidentObj => accidentObj.Year === yearDrop);

        // filter data for state
        var stateData = dataByYear.filter(accidentObj => accidentObj.State === stateDrop);

        if(cityDrop == "State Wide"){
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

        var update={
          'y':yValues
        }
        Plotly.restyle("chartRight", update, [0,1,2,3]);

        
      };


      function init(){
        //initialize cities
        var cityList = selectorInfo.find(stateObj => stateObj.stateName == 'AL').cityName.sort();

        var selectCity_list = tail.select("#selDatasetCITY");

        cityList.forEach(Object=>{
          selectCity_list.options.add({
            Object:{
              key: Object,
              value:Object
            }
          }); 

        });  

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

        console.log(dataArray2);

        var traceSev1 = {
            type: "bar",
            x: listStates,
            y: dataArray2[0],
            name: 'Severity 1',
            marker:{
              color: 'rgb(54,164,213)'
            }
        };

        var traceSev2 = {
          type: "bar",
          x: listStates,
          y: dataArray2[1],
          name: 'Severity 2',
          marker:{
            color:'rgb(109,168,36)'
          }
        };    

        var traceSev3 = {
          type: "bar",
          x: listStates,
          y: dataArray2[2],
          name: 'Severity 3',
          marker:{
            color:'rgb(237,146,46)'
          }
        };
        
        var traceSev4 = {
          type: "bar",
          x: listStates,
          y: dataArray2[3],
          name: 'Severity 4',
          marker:{
            color:'rgb(211,61,42)'
          }
        };


        var layout2 = {
            barmode : 'stack',
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

        severityData = [traceSev1,traceSev2,traceSev3,traceSev4];
        Plotly.newPlot("chartRight", severityData, layout2);     

      };

      // create function to return cleaned data on left selectors choice
      function formatDataState(){

        var yearDrop = d3.select("#selDatasetYEARLEFT").node().value;

        var stateDrop = d3.select("#selDatasetSTATE").node().value;

        var dataByYear = data.filter(accidentObj => accidentObj.Year === yearDrop);

        // filter data for state
        var stateData = dataByYear.filter(accidentObj => accidentObj.State === stateDrop);


        var cityDrop = d3.select("#selDatasetCITY").node().value;

        if(cityDrop == "State Wide"){
          var cityData = stateData;
        }
        else{
          //filter data for city
          var cityData = stateData.filter(accidentObj => accidentObj.City === cityDrop);
        }

        // initialize data to zeros
        var xValues = ["12a","1a", "2a", "3a","4a","5a", "6a", "7a","8a","9a", "10a", "11a","12p","1p", "2p", "3p","4p","5p", "6p", "7p","8p","9p", "10p", "11p"]
        var yValues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        // parse data to get hour of each accident and increase count of y value
        cityData.forEach(Obj=>{

            yValues[Obj.Hour] += 1;
        });

        return [xValues,yValues];

      };


      //created function to return cleaned data on year choice
      function formatDataYear(){

        var yearDrop = d3.select("#selDatasetYEAR").node().value;

        var dataByYear = data.filter(accidentObj => accidentObj.Year === yearDrop);

        var yValuesSev1 = [];
        var yValuesSev2 = [];
        var yValuesSev3 = [];
        var yValuesSev4 = [];


        listStates.forEach(element=>{
            
            var numAccidents = dataByYear.filter(accidentObj => accidentObj.State === element);

            yValuesSev1.push(numAccidents.filter(accidentObj => accidentObj.Severity == 1).length);
            yValuesSev2.push(numAccidents.filter(accidentObj => accidentObj.Severity == 2).length);
            yValuesSev3.push(numAccidents.filter(accidentObj => accidentObj.Severity == 3).length);
            yValuesSev4.push(numAccidents.filter(accidentObj => accidentObj.Severity == 4).length);

        });

        return [yValuesSev1,yValuesSev2,yValuesSev3,yValuesSev4];

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