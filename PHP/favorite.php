<?php

// Database connection details
$host = "localhost";
$dbname = "login_db";
$username = "root";
$password = "";

// Create a new mysqli object for database connection
$mysqli = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($mysqli->connect_errno) {
    die("Connection error: " . $mysqli->connect_error);
}

// Assuming you have a database connection already established
// Insert the book ID into the database
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["bookId"])) {
    $bookId = $_POST["bookId"];
    
    // Insert $bookId into your database table
    $stmt = $mysqli->prepare("INSERT INTO user (favorites) VALUES (?)");
    $stmt->bind_param("s", $bookId);
    
    if ($stmt->execute()) {
        echo "Book favorited successfully";
    } else {
        echo "Error: " . $mysqli->error;
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
$mysqli->close();
?>
