<?php

require_once __DIR__ . '/db/db-connect.php';

$stmt = $pdo->prepare('SELECT `id`, `address`, `latitude`, `longitude`, `elevators_running`, `elevators_down` FROM `locations`');
$stmt->execute();
$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($entries);
