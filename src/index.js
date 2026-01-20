// initialize the map
// google leaflet zoom levels
const map = L.map("map").setView([51.505, -0.09], 13);

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
// cluster layer
const myClusterLayer = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        return L.divIcon({
            html: '<div class="cluster-div">' + cluster.getChildCount() + '</div>',
        })
    }
});

// add markers
const marker1 = L.marker([51.5, -0.08]);
const marker2 = L.marker([51.51, -0.09]);
const marker3 = L.marker([51.5, -0.1]);
const marker4 = L.marker([51.53, -0.1]);

myClusterLayer.addLayer(marker1);
myClusterLayer.addLayer(marker2);
myClusterLayer.addLayer(marker3);
myClusterLayer.addLayer(marker4);
map.addLayer(myClusterLayer);

// add popups
marker1.bindPopup("<h3>Address vireo interfaces</h3>");
marker2.bindPopup("<h3>Address for marker 2</h3>");

// can add skins to your map. search leaflet skins
// leaflet-providers
