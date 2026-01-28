<?php
require_once __DIR__ . '/inc/functions.inc.php';

$data = json_decode($_POST['markers'] ?? '', true); // convert to assoc array
?>
<!DOCTYPE html>
<html>
<head>
    <title>Selected Markers</title>
    <link rel="stylesheet" href="src/styles.css">
</head>
<body>

<h1>Selected Markers</h1>

<?php if (!$data): ?>
    <p>No markers selected.</p>
<?php else: ?>
    <?php foreach ($data as $marker): ?>
        <div class="marker">
            <strong>ID:</strong> <?php echo e($marker['id']) ?><br>
            <strong>Address:</strong> <?php echo e($marker['address']) ?><br>
            <strong>Latitude:</strong> <?php echo e($marker['lat']) ?><br>
            <strong>Longitude:</strong> <?php echo e($marker['lng']) ?>
        </div>
    <?php endforeach; ?>
<?php endif; ?>

</body>
</html>
