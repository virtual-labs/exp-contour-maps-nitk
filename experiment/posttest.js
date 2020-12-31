
// Don't touch the below code

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");


// Don't touch the above code




// Write your MCQs here --- Start --- --------------------

  const myQuestions = [
    {
      question: "What is the elevation of point B?<br><img src=\"./images/eq16.png\"\/>",
      answers: {
      a: "800 ft",
      b: "1000 ft",
      c: "850 ft",
      d: "900 ft"
      },
      correctAnswer: "d"
    },
    {
        question: "What could be the lowest elevation in the depression?<br><img src=\"./images/eq17.png\"\/>",
        answers: {
        a: "800 ft",
        b: "1000 ft",
        c: "850 ft",
        d: "900 ft"
        },
        correctAnswer: "c"
    },
    {
      question: "What type of rock is present on the pointed region of the map shown below?<br><img src=\"./images/eq18.png\"\/>",
      answers: {
        a: "Banded Shale",
        b: "Shale",
        c: "Limestone",
        d: "Conglomerate"
      },
      correctAnswer: "a"
    },
    {
      question: "What is the contour interval of the map shown below?<br><img src=\"./images/eq19.png\"\/>",
      answers: {
        a: "500",
        b: "300",
        c: "100",
        d: "50"
      },
      correctAnswer: "c"
    },
    {
      question: "What is the elevation of the contour line pointed by the red arrow?<br><img src=\"./images/eq110.png\"\/>",
      answers: {
        a: "300",
        b: "400",
        c: "150",
        d: "550"
      },
      correctAnswer: "b"
    }
  ];




// ---------------------------- End -------------------------------








  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();
