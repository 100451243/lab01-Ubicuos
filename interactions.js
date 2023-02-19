// This is the file containing the logic of the user interaction (Input and Output)
var savedPoints = []

// Adds a point in the map to the watch list
function add_point_to_watch(event){
    event.currentTarget.removeEventListener("touchend", add_point_to_watch)
    event.currentTarget.innerHTML = "Remove destination";
    event.currentTarget.style.background = "#dd2121";
    event.currentTarget.addEventListener("touchend", remove_point_to_watch);
    var station = event.currentTarget.station.properties
    savedPoints.push({
        name: station.name,
        latitude: station.latitude, 
        longitude: station.longitude}
    );
    // Markers will turn orange once they are added
    event.currentTarget.layer._path.setAttribute("fill", "#ff9000");

}
// Removes a point in the map from the watch list
function remove_point_to_watch(event){
    event.currentTarget.removeEventListener("touchend", remove_point_to_watch);
    event.currentTarget.innerHTML = "Add to watch list";
    event.currentTarget.style.background = "#179e6a";
    event.currentTarget.addEventListener("touchend", add_point_to_watch);
    // Get the index of the element
    for (i in savedPoints){
        if (savedPoints[i].name === event.currentTarget.station.properties.name){
            break;
        }
    }
    savedPoints.splice(i, 1);
    // Markers return to their original color
    event.currentTarget.layer._path.setAttribute("fill", "#179e6a");
}

// Warns the user if there is an error
function watch_location_error(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Calculates the distances between the selected points
function watch_location_success(pos){
    const coords = pos.coords;
    // Calculates de distance between latitudes and longitudes
    var distance = (x1, x2, y1, y2)=> {
        var R = 3958.8; // Radius of the Earth in miles
        var rlat1 = x1 * (Math.PI/180); // Convert degrees to radians
        var rlat2 = y1 * (Math.PI/180); // Convert degrees2 to radians
        var difflat = rlat2-rlat1; // Radian difference (latitudes)
        var difflon = (y2 - x2) * (Math.PI/180); // Radian difference (longitudes)
      
        var d = 1.6 * 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
        return d; // returns de distance in kilometers
    };
    // Prints the distance to the destinations
    for (i in savedPoints){
        distance_from_origin = distance(
            coords.latitude, coords.longitude, 
            savedPoints[i].latitude, savedPoints[i].longitude
            );
        console.log("Distance to " + savedPoints[i].name + ": " + distance_from_origin);
        // If the distance of any point is less
        if (distance_from_origin < 1){
            // Vibrates faster the closer it gets to the nearest destination point
            navigator.vibrate(Array.from(Array(Math.floor(distance_from_origin*10))),
            (_, index) => Math.sqrt(10000*distance_from_origin));
            return;
        }
        // In case no point in close enough 
        navigator.vibrate(0);
    }
}

let options = {
    enableHighAccuracy: false,
    timeout:5000,
    maximunAge:0
};

if ('geolocation' in navigator){
    const navGeoId = navigator.geolocation.watchPosition(watch_location_success, watch_location_error);
}

