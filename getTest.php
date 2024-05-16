<?php
    $host = "localhost";
    $user = "root"; //"bxxaapmy_app"
    $password = ""; //"CTE@stedy01"
    $db = "h2a"; //"bxxaapmy_h2a"   
    $conn = new mysqli($host, $user, $password, $db);
    if ($conn->connect_error) {
        die("Comunicaton failed: " . $conn->connect_error);
    }

    $query = "SELECT questions.*, answers.answer, answers.correct  FROM quizapp.questions
    inner join quizapp.answers on questions.id = answers.questionsid WHERE questions.testname = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $_GET["testname"]);
    $stmt->execute();
    $results = $stmt->get_result();
    //$row = $results->fetch_assoc();
    $json = '[';
    while ($row = $results->fetch_assoc()) {
        $ques = $row["question"];
        $json .= '{ "question": "' . $row["question"] . '", "answers": [ { "answer": "' . $row["answer"] . '"}';
        if ($row["correct"] == 1) {
            $correct = 0;
        }
        for($i = 0; $i < 3; $i++ ) {
            $row = $results->fetch_assoc();
            $json .= ',{ "answer": "' . $row["answer"] . '"}';
            if ($row["correct"] == 1) {
                $correct = $i + 1;
            }
        }
        $json .= '], "correct": "' . $correct . '"},';
    }
    echo substr($json, 0, -1) . "]";
?>