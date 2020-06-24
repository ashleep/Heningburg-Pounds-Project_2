
d3.csv("static/data/Test_Data.csv",function(data) {

    var listStates = [];

    var selectorInfo = [];
    
    console.log(data);

    data.forEach(element => {

        // test to see if element is already an object in the array
        // if found, append City to cityName
        if(selectorInfo.some(stateObj => stateObj.stateName == element.State)){
            

            var cityList = selectorInfo.find(stateObj => stateObj.stateName == element.State).cityName
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
    
    console.log(listStates);


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
        console.log("change");

        var selectCity_list = d3.select("#selDatasetCITY");
        selectCity_list.remove();
        var selectCity_list = d3.select("#selDatasetCITYTEXT");
        selectCity_list.remove();

        //select dropdown
        var dropdownMenu = d3.select("#selDatasetSTATE").node().value;

        // assign dropdown to variable
        var value = dropdownMenu;

        //***** change graph to state data blah blah blah





        var leftSelector_list = d3.select("#leftSelector");
        //leftSelector_list.html("");
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

        //***** change graph blah blah blah

















    };












});