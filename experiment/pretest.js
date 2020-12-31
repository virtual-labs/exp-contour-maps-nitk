
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
		question: " Contour lines on a topographic map that are far apart indicate that",
		answers: {
		a: "The elevation is very low",
		b: "The land is very steep",
		c: "The land has a gentle slope",
		d: "All of the above"
      },
      correctAnswer: "c"
    },
    {
		question: "What is the difference in elevation between Point X and Point Y<br><img src=\"./images/eq15.png\"\/>",
        answers: {
        a: "120m",
        b: "340m",
        c: "360m",
        d: "240m"
        },
        correctAnswer: "c"
    },
    {
      question: "Determine the contour interval <br><img src=\"./images/eq11.png\"\/>",
      answers: {
        a: "10",
        b: "20",
        c: "50",
        d: "100"
      },
      correctAnswer: "b"
    },
    {
      question: "What is elevation at B?<br><img src=\"./images/eq12.png\"\/>",
      answers: {
        a: "5,080 ft",
        b: "5,040 ft",
        c: "4,920 ft",
        d: "4,840ft"
      },
      correctAnswer: "c"
    },
    {
      question: "What do close contour lines represent on a map?<br><img src=\"./images/eq13.png\"\/>",
      answers: {
        a: "Water fall",
        b: "Steep area",
        c: "Gradual area",
        d: "River"
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
