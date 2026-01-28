// initialize the map
// google leaflet zoom levels
//const map = L.map("map").setView([51.505, -0.09], 13); // setView(center, zoom)
const map = L.map("map");

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, 
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// custom icon
const customIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [38, 38]
})

// Leaflet essentially works in layers. The markers are a layer on top of the map and the clusters are another layer on top of the markers
//let bounds = null;
let selectedMarkers = new Map(); // key => value (id => { marker properties })

const myClusterLayer = L.markerClusterGroup({
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
            className: "",

            iconSize: [70, 70],
            iconAnchor: [35, 35],   // center it properly
        })
    }
});

// Fetch from database and create markers
fetch("get-markers.php")
    .then(res => res.json())
    .then(data => {
        const markers = [];

        data.forEach(row => {
            const marker = L.marker([row.latitude, row.longitude]);

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
            // optional to add { closeOnClick: false }

            // marker.on("click", function () {
            //     map.setView(marker.getLatLng(), 16);
            // });

            marker.on("popupopen", function () {
                const checkbox = document.querySelector(`.marker-select[data-id="${marker.data.id}"]`);

                // restore checked state if already selected
                if (selectedMarkers.has(marker.data.id)) {
                    checkbox.checked = true;
                }
                else {
                    checkbox.checked = false;
                }

                checkbox.addEventListener("change", function () {
                    if (this.checked) {
                        selectedMarkers.set(marker.data.id, {
                            id: marker.data.id,
                            address: row.address,
                            lat: row.latitude,
                            lng: row.longitude
                        });
                    } 
                    else {
                        selectedMarkers.delete(marker.data.id);
                    }
                    updateSelectedPanel();
                });
            });

            myClusterLayer.addLayer(marker);
            markers.push(marker);
        });
        map.addLayer(myClusterLayer);

        if (markers.length > 0) {
            //const bounds = myClusterLayer.getBounds();
            bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    })
    .catch(err => {
        console.error("Failed to load markers:", err);
    });

// add markers ** (not used)
function createMarker(lat, lng, data = null) {
    const marker = L.marker([lat, lng]);
    marker.data = data;
    return marker;
}

function updateSelectedPanel() {
    const list = document.getElementById("selected-list");
    list.innerHTML = "";

    selectedMarkers.forEach(marker => {
        const li = document.createElement("li");
        li.textContent = marker.address;
        list.appendChild(li);
    });
}

// Add a button to refocus on all markers
const refitButton = L.control({ position: 'topright' });
refitButton.onAdd = function(map) {
    const div = L.DomUtil.create('button', 'refit-button'); // Create HTML <button> with class="refit-button"
    div.innerHTML = "Refit"; // Set button text
    div.onclick = () => map.fitBounds(bounds, { padding: [50, 50] }); // onClick handler
    return div;
};
refitButton.addTo(map);

document.getElementById("submit-selected").addEventListener("click", function () {
    if (selectedMarkers.size === 0) {
        alert("No markers selected");
        return;
    }

    const data = Array.from(selectedMarkers.values()); // only values

    document.getElementById("markers-input").value = JSON.stringify(data); // set the value for the input

    document.getElementById("marker-form").submit(); // submit the form
});

// can add skins to your map. search leaflet skins
// leaflet-providers

// Search button with autoloading
const provider = new GeoSearch.OpenStreetMapProvider();

const searchControl = new GeoSearch.GeoSearchControl({
    notFoundMessage: 'Sorry, address cannot be found.',
    provider: provider,
    style: 'bar'
});

map.addControl(searchControl);