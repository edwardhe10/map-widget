<?php
require_once __DIR__ . '/inc/functions.inc.php';

// Get raw POST body
$rawData = file_get_contents('php://input'); // Get raw data from HTTP request body
$data = json_decode($rawData, true); // Decode and convert to assoc array
?>

<h1>Selected Markers</h1>

<?php if (!$data): ?>
    <p>No markers selected.</p>
<?php else: ?>
    <?php foreach ($data AS $marker): ?>
        <div class="marker">
            <strong>ID:</strong> <?php echo e($marker['id']) ?><br>
            <strong>Address:</strong> <?php echo e($marker['address']) ?><br>
            <strong>Latitude:</strong> <?php echo e($marker['lat']) ?><br>
            <strong>Longitude:</strong> <?php echo e($marker['lng']) ?><br>
            <strong>Elevators Running:</strong> <?php echo e($marker['elevatorsRunning']) ?><br>
            <strong>Elevators Down:</strong> <?php echo e($marker['elevatorsDown']) ?><br>
            <strong>Elevator 1</strong><br>
            <strong>Elevator 2...</strong>
        </div>
    <?php endforeach; ?>
<?php endif; ?>
