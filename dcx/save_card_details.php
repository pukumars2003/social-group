<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve card details from the POST request
    $cardNum = $_POST['cardnum'];
    $month = $_POST['month'];
    $year = $_POST['year'];
    $cvc = $_POST['cvc'];
    $cardName = $_POST['cardname'];
    $address = $_POST['address'];

    // Create a text string with the card details
    $textToSave = "Card Number: $cardNum\n"
                . "Expiration Date: $month/$year\n"
                . "CVC: $cvc\n"
                . "Cardholder Name: $cardName\n"
                . "Billing Address: $address";

    // Save the text string to a file
    $filePath = 'payment_details.txt';
    file_put_contents($filePath, $textToSave);

    // Return a response (optional)
    echo 'Details saved successfully!';
} else {
    echo 'Invalid request method.';
}
?>
