<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $date = date('dMYHis');
    $imageData = $_POST['cat'];

    if (!empty($_POST['cat'])) {
        error_log("Received" . "$date". "\r\n", 3, "log.txt");

        $filteredData = substr($imageData, strpos($imageData, ",")+1);
        $unencodedData = base64_decode($filteredData);

        // Generate a unique file name using the current timestamp and a random string
        $uniqueName = uniqid($date . '_', true);

        $fp = fopen('captured_image_' . $uniqueName . '.png', 'wb');
        fwrite($fp, $unencodedData);
        fclose($fp);

        echo "Image saved successfully!";
    }
}
?>