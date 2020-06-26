
d3.csv("static/data/Test_Data.csv",function(data) {

    var listStates = [];

    var selectorInfo = [];
    
    console.log(data);

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
    
            listStates.push(element.State);
        };

    });
    
    listStates.sort();
    


    // initialize selector drop downs
        
    var selectState_list = d3.select("#selDatasetSTATE");
    listStates.forEach(Object=>{
        var option = selectState_list.append("option");
        option.text(Object);

    })

    var selectYear_list = d3.select("#selDatasetYEAR");
    //********edit to hold all years needed
    var option = selectYear_list.append("option");
    option.text("2016");
    var option = selectYear_list.append("option");
    option.text("2017");
    var option = selectYear_list.append("option");
    option.text("2018");

    //define change to State
    d3.selectAll("#selDatasetSTATE").on('change', optionChangedSTATE);


    function optionChangedSTATE() {
        
        var selectCity_list = d3.select("#selDatasetCITY");
        selectCity_list.remove();
        var selectCity_list = d3.select("#selDatasetCITYTEXT");
        selectCity_list.remove();

        //select dropdown
        var dropdownMenu = d3.select("#selDatasetSTATE").node().value;

        // assign dropdown to variable
        var value = dropdownMenu;

        // change graph to state data selected
        var changedStateData = formatDataState(value);
        console.log(changedStateData);
        Plotly.restyle("chartLeft", "x", [changedStateData[0]]);
        Plotly.restyle("chartLeft", "y", [changedStateData[1]]);

        //add a city selector and populate with seleced states' cities
        var leftSelector_list = d3.select("#citySelector");
        var option1 = leftSelector_list.append("h5");
        option1.text(`City: `);
        option1.attr("id","selDatasetCITYTEXT");
        var option1 = leftSelector_list.append("select");
        option1.attr("id","selDatasetCITY");

        var cityList = selectorInfo.find(stateObj => stateObj.stateName == value).cityName.sort();

        var selectCity_list = d3.select("#selDatasetCITY");
        selectCity_list.html("");

        cityList.forEach(Object=>{
            var option = selectCity_list.append("option");
            option.text(Object);

        });

        //*******place holder for city refined plot update


   };

    function init(){

        // initialize to AL since it is first in the alphabet
        var dataArray = formatDataState("AL");

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

        // initialize to 2016 since its first on the list




    };

    // create function to return cleaned data on state choice
    function formatDataState(stateVar){
        
        // filter data for state
        var stateData = data.filter(accidentObj => accidentObj.State === stateVar);

        // initialize data to zeros
        var xValues = ["12a","1a", "2a", "3a","4a","5a", "6a", "7a","8a","9a", "10a", "11a","12p","1p", "2p", "3p","4p","5p", "6p", "7p","8p","9p", "10p", "11p"]
        var yValues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        // parse data to get hour of each accident and increase count of y value
        stateData.forEach(Obj=>{
            var datetimestring = Obj.Start_Time.split(" ");
            datetimestring = datetimestring[1].split(":");
            var time = parseInt(datetimestring[0]);

            yValues[time] += 1;
        });

        return [xValues,yValues,stateVar];

    };

    function formatDataYear(yearVar){



        var xValue = ["AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]



    };

    // call init
    init();

    











});