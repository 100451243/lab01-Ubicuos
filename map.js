// This is the file contating the logic of the interactive map
//
// Creating an instance of the leaflet map, focused on the user position

// Executes when the user can be located
function init_map(){
    // Adding a layer to the map
    let madrid_center = [40.416775, -3.703790]
    var map = L.map('map').setView(madrid_center, 10);
    var map_style  = 'matrix'
    L.tileLayer('https://{s}.tile.jawg.io/jawg-'+ map_style +'/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
            attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 0,
            maxZoom: 15,
            accessToken: 'wfk7g8IlqLBdkEnSXG3QpAs1l18bRPOZvbiEGNMS8TiHVlQQ6IQphoj43aL49vm8'
    }).addTo(map);
    // Circular area for the train stations
    var geojsonMarkerOptions = {
        radius: 18,
        fillColor: "#179e6a",
        color: "#000",
        weigh: 1,
        opacity: 1,
        fillOpacity: 0.7
    }
    // Loading spanish train stations (We could load all european train stations)
    fetch('train_stations_spain.geojson')
    .then(function (response){
        return response.json();
    })
    .then(function (train_stations){
        L.geoJSON(train_stations,{
            onEachFeature: on_each_train_station,
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    })
}

function on_each_train_station(station, layer){
    // Creates de popup div
    var popup = document.createElement("div");
    popup.classList.add("station_popup");

    // Creates and appends the name of the train station
    var station_name = document.createElement("h1");
    station_name.appendChild(document.createTextNode(station.properties.name));
    popup.appendChild(station_name);

    // Creates and appends the button to add the station
    var button = document.createElement("button");
    button.classList.add("station_select");
    button.appendChild(document.createTextNode("Add to watch list"));
    // The function is implemented in the interactions.js
    button.addEventListener("touchend", add_point_to_watch, false)
    button.station = station;
    button.layer = layer;
    popup.appendChild(button);

    layer.bindPopup(popup);
}

init_map();
