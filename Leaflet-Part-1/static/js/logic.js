const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Initialize the map
var map = L.map("map").setView([20, 0], 2); // Centered on the world

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18
}).addTo(map);

// Perform a GET request to the query URL
d3.json(url).then(function (data) {
  // Loop through the earthquake data and add markers to the map
  data.features.forEach(function (earthquake) {
    var latitude = earthquake.geometry.coordinates[1];
    var longitude = earthquake.geometry.coordinates[0];
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];

    var options = getMarkerOptions(magnitude, depth);
    var marker = L.circleMarker([latitude, longitude], options)
      .addTo(map)
      .bindPopup("Magnitude: " + magnitude + "<br>Depth: " + depth + " km");
  });

  // Create a legend
  createLegend();
});

// Function to determine marker size and color based on magnitude and depth
function getMarkerOptions(magnitude, depth) {
  var size = Math.pow(2, magnitude); // Size based on magnitude
  var color = getColor(depth); // Get color based on depth

  return {
    radius: size,
    fillColor: color.fill, // Fill color
    color: color.outline, // Outline color
    weight: 2, // Outline weight
    opacity: 1,
    fillOpacity: 0.8
  };
}

// Function to get color based on depth
function getColor(depth) {
  var color;

  // Define depth ranges and corresponding colors
  if (depth <= 20) {
    color = { fill: "green", outline: "black" };
  } else if (depth <= 40) {
    color = { fill: "lightgreen", outline: "black" };
  } else if (depth <= 60) {
    color = { fill: "yellow", outline: "black" };
  } else if (depth <= 80) {
    color = { fill: "orange", outline: "black" };
  } else if (depth <= 100) {
    color = { fill: "orangered", outline: "black" };
  } else {
    color = { fill: "red", outline: "black" };
  }

  return color;
}

// Function to create a legend
function createLegend() {
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<strong>Depth Legend</strong><br>";
    div.innerHTML +=
      '<i style="background: green; width: 20px; height: 20px; display: inline-block; border: 1px solid darkgreen;"></i> 0-20 km<br>';
    div.innerHTML +=
      '<i style="background: lightgreen; width: 20px; height: 20px; display: inline-block; border: 1px solid green;"></i> 21-40 km<br>';
    div.innerHTML +=
      '<i style="background: yellow; width: 20px; height: 20px; display: inline-block; border: 1px solid gold;"></i> 41-60 km<br>';
    div.innerHTML +=
      '<i style="background: orange; width: 20px; height: 20px; display: inline-block; border: 1px solid darkorange;"></i> 61-80 km<br>';
    div.innerHTML +=
      '<i style="background: orangered; width: 20px; height: 20px; display: inline-block; border: 1px solid red;"></i> 81-100 km<br>';
    div.innerHTML +=
      '<i style="background: red; width: 20px; height: 20px; display: inline-block; border: 1px solid darkred;"></i> >100 km<br>';
    return div;
  };
  legend.addTo(map);
}
