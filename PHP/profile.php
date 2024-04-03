<?php
// Start session
session_start();

// Check if user is logged in, redirect to login page if not
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Include database connection
include_once 'database.php';

// Fetch user details from database
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM user WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = $_POST['name'];
    $email = $_POST['email'];

    // Check if a file is uploaded
    if ($_FILES['profile_picture']['error'] == UPLOAD_ERR_OK) {
        // Process the uploaded file
        $tmp_name = $_FILES['profile_picture']['tmp_name'];
        $target_path = 'uploads/' . basename($_FILES['profile_picture']['name']);
        if (move_uploaded_file($tmp_name, $target_path)) {
            // File uploaded successfully, update profile picture path in database
            $sql = "UPDATE user SET name = ?, email = ?, profile_picture = ? WHERE id = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("sssi", $name, $email, $target_path, $user_id);
            if ($stmt->execute()) {
                // Update session data
                $_SESSION['name'] = $name;
                $_SESSION['email'] = $email;
                // Redirect to profile page
                header("Location: profile.php");
                exit();
            } else {
                $error_message = "Error updating user info.";
            }
        } else {
            $error_message = "Failed to upload profile picture.";
        }
    } else {
        // No file uploaded, update only name and email
        $sql = "UPDATE user SET name = ?, email = ? WHERE id = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("ssi", $name, $email, $user_id);
        if ($stmt->execute()) {
            // Update session data
            $_SESSION['name'] = $name;
            $_SESSION['email'] = $email;
            // Redirect to profile page
            header("Location: profile.php");
            exit();
        } else {
            $error_message = "Error updating user info.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Page</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        form {
            max-width: 400px;
            margin: 0 auto;
        }
        input[type="text"], input[type="email"], input[type="password"], input[type="file"] {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        input[type="submit"] {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            margin: 5px 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #45a049;
        }
        .error {
            color: red;
        }

        .profile-picture {
            width: 150px; /* Set width as desired */
            height: 150px; /* Set height as desired */
            border-radius: 50%; /* Make the image round */
            object-fit: cover; /* Ensure the image covers the entire space */
            border: 2px solid #ffffff; /* Add a white border */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li>TP Librairie</li>
                <li><a href="index.php">Home</a></li>
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
    <h2>Profile Page</h2>
    <?php if (isset($error_message)) { ?>
        <p class="error"><?php echo $error_message; ?></p>
    <?php } ?>
    <?php
        // Assuming $user['profile_picture'] contains the image filename or file path
        $imagePath = $user['profile_picture'];
    ?>
    <?php if (!empty($imagePath)) { ?>
        <img src="<?php echo $imagePath; ?>" alt="Profile Picture" class="profile-picture">
    <?php } ?>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" enctype="multipart/form-data">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" value="<?php echo $user['name']; ?>">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" value="<?php echo $user['email']; ?>">
        <label for="profile_picture">Profile Picture</label>
        <input type="file" id="profile_picture" name="profile_picture">
        <input type="submit" value="Save Changes">
    </form>
</body>
</html>