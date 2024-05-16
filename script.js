class Question {
    constructor(question, answer0, answer1, answer2, answer3, which) {
        this.question = question;
        this.answers = [];
        this.answers[0] = new Answer(answer0, false)
        this.answers[1] = new Answer(answer1, false)
        this.answers[2] = new Answer(answer2, false)
        this.answers[3] = new Answer(answer3, false)
        this.answers[which].correct = true
    }
}
class Answer {
    constructor(answer, correct){
        this.answer = answer;
        this.correct = correct;
    }
}
var questions = []

const questionElement = document.getElementById("question");
const answerButtons = document.getElementsByClassName("btn");
const nextbutton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
function getTestname() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status === 200) {
            console.log("Test names received:", xhr.responseText);
            let data = JSON.parse(xhr.responseText);
            fillTestname(data);
        } else {
            console.error("Failed to fetch test names.");
        }
    }
    xhr.open("GET", "getTestname.php");
    xhr.send();
}

function fillTestname(data){
    let selectElement = document.getElementById("testnames");
    selectElement.innerHTML = ""; //Clear previous options
    
    //add an empty option as the first child
    let emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.text = "-- Select Test --";
    selectElement.appendChild(emptyOption);
    
    //add test names as options
    data.forEach(test => {
        let option = document.createElement("option");
        option.value = test.testname;
        option.text = test.testname;
        selectElement.appendChild(option);
    });
}

function getQuiz(testname) {
    console.log("getQuiz function called");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        console.log("getting data", this.responseText);
        parseQuestions(this.responseText);
    }
    //include the selected test name in the request URL
    xhr.open("GET", "getTest.php?testname=" + testname);
    xhr.send();
}

function parseQuestions(text) {
    questions = JSON.parse(text);
    startQuiz();
    showQuestion(); // Move the call to showQuestion here
}

function startQuiz() {
    console.log("startQuiz function called");
    currentQuestionIndex = 0;
    score = 0;
    nextbutton.innerHTML = "Next";
    nextbutton.disabled = true; // Disable the "Next" button initially
    Array.from(answerButtons).forEach(button => {
        button.classList.remove("hidden");
    });
    nextbutton.style.display = "none";
}

function showQuestion() {
    console.log("showQuestion function called");
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    console.log(questions);
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    for(let i = 0; i < currentQuestion.answers.length; i++) {
        answerButtons[i].innerHTML = currentQuestion.answers[i].answer;

        if (i == currentQuestion.correct) {
            answerButtons[i].dataset.correct = true;
        } else {
            answerButtons[i].dataset.correct = false;
        }
        
        answerButtons[i].addEventListener("click", selectAnswer);
    }
}

function resetState() {
    console.log("resetState function called");
    nextbutton.style.display = "none";
    nextbutton.disabled = true; // Ensure "Next" button is disabled
    Array.from(answerButtons).forEach(button => {
        button.classList.add("hidden");
    });
}

function selectAnswer(e) {
    console.log("selectAnswer function called");
    const selectedBtn = e.target;
    const iscorrect = selectedBtn.dataset.correct === "true";
    if (iscorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect")
    }
    Array.from(selectedBtn.parentElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextbutton.disabled = false; // Enable the "Next" button after an answer is selected
    nextbutton.style.display = "block"; // Show the "Next" button after an answer is selected
}


function showScore() {
    console.log("showScore function called");
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextbutton.innerHTML = "Play again";
    nextbutton.disabled = false;
    nextbutton.style.display = "block";
    Array.from(answerButtons).forEach(button => {
        button.classList.add("hidden");
    });

    nextbutton.addEventListener("click", () => {
        console.log("nextbutton event listener called from showScore");
        resetState(); // Reset the state
        startQuiz(); // Reset quiz
        showQuestion(); // Show the first question again
    }, { once: true }); // Add event listener to "Play again" button once

    nextbutton.removeEventListener("click", handleNextButton);
    nextbutton.addEventListener("click", nextQuestion);
}
function nextQuestion() {
    console.log("nextbutton event listener called");
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    } else {
        startQuiz();
    }
}
function handleNextButton() {
    console.log("handleNextButton function called");
    Array.from(answerButtons).forEach(button => {
        button.classList.remove("correct", "incorrect");
        button.removeAttribute("data-correct");
        button.disabled = false;
    });

    nextbutton.disabled = true; // Re-disable the "Next" button after clicking "Next"
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextbutton.addEventListener("click", nextQuestion);
