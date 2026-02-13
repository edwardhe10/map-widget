// Modal
const modal = document.getElementById("mapModal"); // Get the modal
const openBtn = document.getElementById("openMapBtn"); // Get the button that opens the modal
const closeBtn = document.getElementById("closeMapBtn"); // Get the button that closes the modal

openBtn.onclick = () => {
    modal.style.display = "block";

    // Tell Leaflet to recalculate map layout since container size changed
    map.invalidateSize();

    // Refit to bounds on modal open
    if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
};

closeBtn.onclick = () => {
    modal.style.display = "none";
};

// Close when the user clicks anywhere outside of the modal
modal.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// Map
const map = L.map("map"); // Initialize the map

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, 
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Leaflet essentially works in layers. The markers are a layer on top of the map and the clusters are another layer on top of the markers

let selectedMarkers = new Map(); // key => value (id => { marker properties })
// Fast lookup by ID, no dupes, easy add/remove

const clusterLayer = L.markerClusterGroup({
    //spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    //zoomToBoundsOnClick: true,
    iconCreateFunction: function (cluster) {
        const markers = cluster.getAllChildMarkers();

        let running = 0;
        let down = 0;

        // Sum up number of elevators running and down for the markers in the cluster
        markers.forEach(marker => {
            if (marker.data) {
                running += marker.data.elevatorsRunning || 0;
                down += marker.data.elevatorsDown || 0;
            }
        });
        
        return L.divIcon({
            html: `
                <div class="cluster-root">
                    <div class="cluster-count">${cluster.getChildCount()}</div>
                    <div class="cluster-stats">
                        <div class="cluster-running">🟢 ${running}</div>
                        <div class="cluster-down">🔴 ${down}</div>
                    </div>
                </div>
            `,
            className: "", // to prevent default leaflet CSS

            iconSize: [70, 70],
        })
    }
});

// Fetch from database and create markers
fetch("get-markers.php")
    .then(res => res.json())
    .then(data => {
        const markers = [];

        data.forEach(row => {
            const marker = L.marker([row.latitude, row.longitude]); // Create marker with its location

            marker.data = {
                id: row.id,
                address: row.address,
                elevatorsRunning: row.elevators_running,
                elevatorsDown: row.elevators_down
            };
            
            marker.bindPopup(`<div class="popup-content">
                <h3>Address: ${marker.data.address}</h3><br>
                🟢 Running: ${marker.data.elevatorsRunning}<br>
                🔴 Down: ${marker.data.elevatorsDown}
                <label>
                    <input type="checkbox" class="marker-select" data-id="${marker.data.id}">Select
                </label>
                </div>
            `);
            // Optional to add { closeOnClick: false }
            
            // Marker onclick zooming
            // marker.on("click", function () {
            //     map.setView(marker.getLatLng(), 16);
            // });

            marker.on("popupopen", function () {
                // Find the checkbox with class marker-select and attribute data-id = marker ID
                const checkbox = document.querySelector(`.marker-select[data-id="${marker.data.id}"]`);

                // Restore checked state if already selected
                if (selectedMarkers.has(marker.data.id)) {
                    checkbox.checked = true;
                }
                else {
                    checkbox.checked = false;
                }
                
                // Handle the form changes
                checkbox.addEventListener("change", function () {
                    if (this.checked) {
                        selectedMarkers.set(marker.data.id, {
                            id: marker.data.id,
                            address: marker.data.address,
                            lat: row.latitude, // maybe not needed. maybe also add to marker.data
                            lng: row.longitude,
                            elevatorsRunning: marker.data.elevatorsRunning,
                            elevatorsDown: marker.data.elevatorsDown
                        });
                    } 
                    else {
                        selectedMarkers.delete(marker.data.id);
                    }
                    updateSelectedPanel();
                });
            });
            clusterLayer.addLayer(marker); // Add marker to the cluster layer
            markers.push(marker); // Add marker to the markers array
        });
        map.addLayer(clusterLayer); // Add the cluster layer to the map

        if (markers.length > 0) {
            // Get bounds to fit all markers on map
            bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    })
    .catch(err => {
        console.error("Failed to load markers:", err);
    });

function updateSelectedPanel() {
    const list = document.getElementById("selected-list");
    list.innerHTML = ""; // Deletes all child elements (inside <ul>)

    // Recreate <li> elements
    selectedMarkers.forEach(marker => {
        const li = document.createElement("li");
        li.textContent = marker.address;
        list.appendChild(li);
    });
}

// Handle when the Submit button for selected markers is clicked
document.getElementById("submit-selected").addEventListener("click", function () {
    if (selectedMarkers.size === 0) {
        alert("No markers selected");
        return;
    }
    // const data = Array.from(selectedMarkers.values()); // Convert only the values to an array

    // document.getElementById("markers-input").value = JSON.stringify(data); // Set the value attribute for the input (converted to JSON string)
    // document.getElementById("marker-form").submit(); // Submit the form

    fetch("submit-selected-markers.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Indicate that the body is in JSON
        body: JSON.stringify(Array.from(selectedMarkers.values()))
    })
    .then(res => res.text())
    .then(html => {
        document.getElementById("selected-results").innerHTML = html; // Inject the HTML
    });
    modal.style.display = "none"; // Close modal when submitted
});

// Add a button to refocus on all markers
const refitButton = L.control({ position: 'bottomright' });
refitButton.onAdd = function(map) {
    const div = L.DomUtil.create('button', 'refit-button'); // Create HTML <button> with class="refit-button"
    div.innerHTML = "Refit"; // Set button text
    div.onclick = () => map.fitBounds(bounds, { padding: [50, 50] }); // onclick handler
    return div;
};
refitButton.addTo(map);

// Search feature with autoloading
const provider = new GeoSearch.OpenStreetMapProvider();

const searchControl = new GeoSearch.GeoSearchControl({
    notFoundMessage: 'Sorry, address cannot be found.',
    provider: provider,
    style: 'bar'
});

map.addControl(searchControl);

fetch('ontario.geo.json')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'red'
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.tags && feature.properties.tags.name) {
            layer.bindPopup(feature.properties.tags.name);
        }
      }
    }).addTo(map);
  });
