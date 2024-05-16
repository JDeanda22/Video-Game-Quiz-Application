<?php
    $host = "localhost";
    $user = "root"; //"bxxaapmy_app"
    $password = ""; //"CTE@stedy01"
    $db = "h2a"; //"bxxaapmy_h2a"   
    $conn = new mysqli($host, $user, $password, $db);
    if ($conn->connect_error) {
        die("Comunicaton failed: " . $conn->connect_error);
    }

    $query = "SELECT distinct testname FROM quizapp.questions;";
    $results = $conn->query($query);
    $comma = "";

    $json = '[';
    while ($row = $results->fetch_assoc()) {
        $json .= $comma. '{ "testname": "' . $row["testname"] . '"}';
        $comma = ",";
    }
    $json .= ']';

    echo $json;
?>