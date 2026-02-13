<?php

try {
    $pdo = new PDO('mysql:host=localhost;port=3308;dbname=elevators;charset=utf8mb4', 'elevators', 'NNcnaVcvOm@xBet!', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
}
catch (PDOException $e) {
    echo 'A problem occured with the database connection...';
    die();
}

return $pdo;