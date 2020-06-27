
var datalocation = "static/data/main.csv";


d3.csv(datalocation,function (data){

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
        //select dropdown
        // var yearDrop = d3.select("#selDatasetYEARLEFT").node().value;
        
        // console.log(yearDrop);

        var changedStateData = formatDataState();
        console.log(changedStateData);

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

        //filter data for city
        var cityData = stateData.filter(accidentObj => accidentObj.City === cityDrop);

        // initialize data to zeros
        //var xValues = ["12a","1a", "2a", "3a","4a","5a", "6a", "7a","8a","9a", "10a", "11a","12p","1p", "2p", "3p","4p","5p", "6p", "7p","8p","9p", "10p", "11p"]
        var yValues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        // parse data to get hour of each accident and increase count of y value
        cityData.forEach(Obj=>{
            var datetimestring = Obj.Start_Time.split(" ");
            datetimestring = datetimestring[1].split(":");
            var time = parseInt(datetimestring[0]);

            yValues[time] += 1;
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
        console.log(yearDrop);
        console.log(stateDrop);

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



});