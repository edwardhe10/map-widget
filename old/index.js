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

// add markers
//var marker = L.marker([51.5, -0.08], { icon: customIcon }).addTo(map);
// var marker = L.marker([51.5, -0.08]).addTo(map);
// var marker = L.marker([51.51, -0.09]).addTo(map);
// var marker = L.marker([51.5, -0.1]).addTo(map);

//console.log(window === L);
// Cluster layer
// const myClusterLayer = L.markerClusterGroup({
//     iconCreateFunction: function (cluster) {
//         const markers = cluster.getAllChildMarkers();

//         let up = 0;
//         let down = 0;

//         markers.forEach(marker => {
//             if (marker.data) {
//                 up += marker.data.elevatorsUp || 0;
//                 down += marker.data.elevatorsDown || 0;
//             }
//         });
        
//         return L.divIcon({
//             html: `<div class="cluster-div">` + cluster.getChildCount() + `</div>
//                 <div class="cluster-up">🟢 ${up}</div>
//                 <div class="cluster-down">🔴 ${down}</div>`
//         })
//     }
// });

const myClusterLayer = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        const markers = cluster.getAllChildMarkers();

        let up = 0;
        let down = 0;

        markers.forEach(marker => {
            if (marker.data) {
                up += marker.data.elevatorsUp || 0;
                down += marker.data.elevatorsDown || 0;
            }
        });
        
        return L.divIcon({
            html: `
                <div class="cluster-root">
                    <div class="cluster-count">${cluster.getChildCount()}</div>
                    <div class="cluster-stats">
                        <div class="cluster-up">🟢 ${up}</div>
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

// add markers
function createMarker(lat, lng, data = null) {
    const marker = L.marker([lat, lng]);
    marker.data = data;
    return marker;
}

const marker1 = createMarker(51.5, -0.08, {
    address: "123 address street",
    elevatorsUp: 4,
    elevatorsDown: 2
});

const marker2 = createMarker(51.51, -0.09, {
    address: "Marker 2",
    elevatorsUp: 3,
    elevatorsDown: 1
});

const marker3 = createMarker(51.5, -0.1, {
    address: "Marker 3",
    elevatorsUp: 5,
    elevatorsDown: 0
});

const marker4 = createMarker(51.53, -0.1, {
    address: "Marker 4",
    elevatorsUp: 2,
    elevatorsDown: 2
});

const marker5 = createMarker(43.47, -80.54, {
    address: "Marker 5",
    elevatorsUp: 6,
    elevatorsDown: 1
});

const marker6 = createMarker(43.46, -80.54, {
    address: "Marker 6",
    elevatorsUp: 4,
    elevatorsDown: 0
});
const marker7 = createMarker(64.13, -21.80, {
    address: "Marker 7",
    elevatorsUp: 4,
    elevatorsDown: 1
});
// To do: change to array
// const marker1 = L.marker([51.5, -0.08]);
// marker1.data = {
//     address: "123 address street",
//     elevatorsUp: 4,
//     elevatorsDown: 2
// };
// //console.log("Marker data: ", marker1.data);
// const marker2 = L.marker([51.51, -0.09]);
// const marker3 = L.marker([51.5, -0.1]);
// const marker4 = L.marker([51.53, -0.1]);
// const marker5 = L.marker([43.47, -80.54]);
// const marker6 = L.marker([43.46, -80.54]);

myClusterLayer.addLayer(marker1);
myClusterLayer.addLayer(marker2);
myClusterLayer.addLayer(marker3);
myClusterLayer.addLayer(marker4);
myClusterLayer.addLayer(marker5);
myClusterLayer.addLayer(marker6);
myClusterLayer.addLayer(marker7);
map.addLayer(myClusterLayer);

// Add click event to zoom to marker
// To do: change to array
[marker1, marker2, marker3, marker4, marker5].forEach(marker => {
    marker.on('click', function() {
        map.setView(marker.getLatLng(), 16);
    });
});

// Fit map to show all markers
const bounds = myClusterLayer.getBounds();
map.fitBounds(bounds, { padding: [50, 50] });

// Add a button to refocus on all markers
const refitButton = L.control({ position: 'topright' });
refitButton.onAdd = function(map) {
    const div = L.DomUtil.create('button', 'refit-button'); // Create HTML <button> with class="refit-button"
    div.innerHTML = "Refit"; // Set button text
    div.onclick = () => map.fitBounds(bounds, { padding: [50, 50] }); // onClick handler
    return div;
};
refitButton.addTo(map);

// Add popups
marker1.bindPopup(`<h3>Address: ${marker1.data.address}</h3><br>
    🟢 Running: ${marker1.data.elevatorsUp}<br>
    🔴 Down: ${marker1.data.elevatorsDown}`);
marker2.bindPopup("<h3>Address for marker 2</h3>");

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