<?php

session_start();

if (isset($_SESSION["user_id"])) {
    
    $mysqli = require __DIR__ . "/database.php";
    
    $sql = "SELECT * FROM user
            WHERE id = {$_SESSION["user_id"]}";
            
    $result = $mysqli->query($sql);
    
    $user = $result->fetch_assoc();
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    <link rel="stylesheet" href="../CSS/style.css">
    <script src="../JS/indexDisplayFav.js" defer></script>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li>TP Librairie</li>
                <li><a href="#">Home</a></li>
                <!-- <li><a href="">About</a></li> -->

                <?php if (isset($user)): ?>

                    <li><a href="search.php">Search</a></li>
                    <li><a href="profile.php">Profile</a></li>
                    <li><a href="logout.php">Log Out</a></li>
                    
                <?php else: ?>
                    
                    <li><a href="login.php">Login</a></li>
                    <li><a href="signup.html">Sign Up</a></li>
                    
                <?php endif; ?>
            </ul>
        </nav>
    </header>
    <div class="above-main">
        <h1 style="text-align: center;">Bienvenue !</h1>
    </div>
    <main>

    </main>
</body>
</html>