<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-geosearch@4.2.2/dist/geosearch.css"/>
    <link rel="stylesheet" href="src/styles.css">
</head>
<body>
    <?php require __DIR__ . '/inc/functions.inc.php'; ?>
    <?php require __DIR__ . '/db/db-connect.php'; ?>
    <div id="map">
        <div id="selection-panel">
            <h3>Selected Addresses</h3>
            <ul id="selected-list"></ul>
            <form id="marker-form" method="post" action="submit-selected-markers.php">
                <input type="hidden" name="markers" id="markers-input">
            </form>
            <button id="submit-selected">Submit</button>
        </div>
    </div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossorigin=""></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
    <script src="https://unpkg.com/leaflet-geosearch@latest/dist/bundle.min.js"></script>
    <script src="src/index.js"></script>
</body>
</html>