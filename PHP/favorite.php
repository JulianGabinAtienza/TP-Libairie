<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$requestBody = file_get_contents('php://input'); // recup l'objet recu en post avec fetch
$data = json_decode($requestBody, true); // decode depuis json
// $parsed = parse_str($requestBody, $data);

echo json_encode($data);

// Recup les infos du user depuis la session (créee après que le user soit logged in)

// Ajouter le favori dans la base de données

// dans une table favoris par exemple avec les colonnes id, user_id, title, content
// on pourrait dans content avoir un objet des favoris en json

?>