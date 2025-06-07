 const questionElm = document.getElementById('question');
    const optionsElms = [
      document.querySelector('.option_1'),
        document.querySelector('.option_2'),    
        document.querySelector('.option_3'),
        document.querySelector('.option_4')
                    
     ];
    const answerInputs = document.querySelectorAll('.answer');
    const submitBtn = document.getElementById('submit');
    const timerElm = document.getElementById('timer');

    let quizData = [];
    let currentQuiz = 0;
    let score = 0;
    let timeLeft = 10;
    let timerInterval;
    let correctAnswerIndex = null;

    async function fetchQuizData() {
      try {
        const res = await fetch('https://opentdb.com/api.php?amount=5&category=23&difficulty=easy&type=multiple');
        const data = await res.json();
        quizData = data.results.map(q => {
          const answers = [...q.incorrect_answers];
          const correctIndex = Math.floor(Math.random() * (answers.length + 1));
          answers.splice(correctIndex, 0, q.correct_answer);
          return {
            question: q.question,
            options: answers,
            answer: correctIndex
          };
        });
        loadQuiz();
      } catch (err) {
        questionElm.innerHTML = 'Failed to load questions. Try again later.';
        console.error(err);
      }
    }

    function loadQuiz() {
      clearInterval(timerInterval);
      timeLeft = 10;
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);

      deselectAnswers();

      const current = quizData[currentQuiz];
      questionElm.innerHTML = current.question;
      correctAnswerIndex = current.answer;

      current.options.forEach((opt, index) => {
        optionsElms[index].innerHTML = opt;
      });
    }

    function updateTimer() {
      timerElm.innerText = `Time Left: ${timeLeft}s`;
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timerInterval);
        handleNext(); // auto move to next if time runs out
      }
    }

    function getSelectedOption() {
      return Array.from(answerInputs).findIndex(el => el.checked);
    }

    function deselectAnswers() {
      answerInputs.forEach(el => el.checked = false);
    }

    function handleNext() {
      const selected = getSelectedOption();
      if (selected === correctAnswerIndex) score++;
      currentQuiz++;
      if (currentQuiz < quizData.length) {
        loadQuiz();
      } else {
        showResult();
      }
    }

    function showResult() {
      clearInterval(timerInterval);
      document.querySelector('.quiz').innerHTML = `
        <h2>Your Score: ${score} / ${quizData.length}</h2>
        <button onclick="location.reload()" class="btn">Play Again</button>
      `;
    }

    submitBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      handleNext();
    });

    fetchQuizData();