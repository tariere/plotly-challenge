//Read in the json and make sure that it is accessible. I'm doing this to just make sure that I can see the data. 
const url = "data/samples.json";

var samples = d3.json(url);
console.log(samples)

samples.then(function(data) {
    console.log(data);
  });

// fill the dropdown menue with a list of the names/ids. I found help from https://stackoverflow.com/questions/17647065/create-drop-down-list-from-json
samples.then((data) => {

    var select = document.getElementById("selDataset");
    var choices = data.names;

    for (var i=0; i<choices.length; i++){
        var name = choices[i];
        var item = document.createElement("option");
        item.value = name;
        item.textContent = name;
        select.appendChild(item);

        // are these values coming out?
        // console.log(item.value)
        // console.log(item.textContent)
    }

});

//Use the IDs to select the dataset to use. 
d3.selectAll("#selDataset").on("change", idSelect);

function idSelect () {
    var inputElement  = d3.select("#selDataset");
    var inputValue = inputElement.property("value");
    // is my value coming out?
    console.log(inputValue);

makeMetadata(inputValue);
makeBar(inputValue);
makeBubbles(inputValue);
// makeGauge(inputValue);
}   


//use the selected ID to present the demographic information
function makeMetadata(inputValue) {
    samples.then((patValue)=> {
        
        // Get all metadata info
        let metadata = patValue.metadata;
        console.log("All Metadata:", metadata);

        // Filter metadata info by id
        let patMetadata = metadata.filter((meta) => +meta.id === +inputValue);
        console.log("Patient Metadata:", patMetadata);

        // Select demographic info panel
        let demographicInfo = d3.select("#sample-metadata");
        
        // Empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // Grab the metadata for specified patient and append the info to the panel
        Object.entries(patMetadata[0]).forEach((key) => {   
                demographicInfo.append("h5").text(key[0] + ": " + key[1]);    
        });
    });



}

//use the selected ID to show the bar graph
function makeBar(inputValue) {
    samples.then((patValue)=> {
        
        // Get all samples data info
        let patSamples = patValue.samples;
        console.log("Patient Samples:", patSamples);

        // Filter samples info by id
        let pSamp = patSamples.filter(samp => +samp.id === +inputValue);
        console.log("Patient Sample Info:", pSamp);

        let otu_ids = pSamp.map(set => set.otu_ids);
        otu_ids = otu_ids[0].slice(0,10).reverse()
        console.log(otu_ids)

        let otu_id_labels = otu_ids.map(label=> "OTU" + label);
        console.log(otu_id_labels)

        let otu_labels = pSamp.map(set => set.otu_labels);
        otu_labels = otu_labels[0].slice(0,10).reverse();
        console.log(otu_labels)

        let sample_values = pSamp.map(set => set.sample_values);
        sample_values = sample_values[0].slice(0,10).reverse();
        console.log(sample_values)

        // Create the horizontal bar plot
        let top10 = {
            x: sample_values,
            y: otu_id_labels,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };

        var data = [top10];

        let layout1 = {
            title: "Top 10 OTU Samples",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bar", data, layout1);
    });
}

//use the selected ID to show the bar graph
function makeBubbles(inputValue){
    samples.then((patValue)=> {

        // Get all samples data info
        let patSamples = patValue.samples;
        console.log("Patient Samples:", patSamples);
        
        // Filter samples info by id
        let pSamp = patSamples.filter(samp => +samp.id === +inputValue);
        console.log("Patient Sample Info:", pSamp)

        let otu_ids = pSamp.map(set => set.otu_ids);
        otu_ids = otu_ids[0];
        console.log(otu_ids)

        let otu_labels = pSamp.map(set => set.otu_labels);
        otu_labels = otu_labels[0];
        console.log(otu_labels)

        let sample_values = pSamp.map(set => set.sample_values);
        sample_values = sample_values[0];
        console.log(sample_values)

        // Create the bubble plot
        let bubbles = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        }

        var data = [bubbles];

        let layout2 = {
            xaxis:{title: "OTU ID"}
            // height: 600,
            // width: 1000
        };
        
        Plotly.newPlot("bubble", data, layout2);
    });
}

function init(){
    makeMetadata("940");
    makeBar("940");
    makeBubbles("940");
    };

init();