document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is running!");

    const questionsPerPage = 5;
    let currentPage = 0;
    let responses = {};

    // 질문을 로드하는 함수
    function loadQuestions() {
        fetch('/static/questions.json')
            .then(response => response.json())
            .then(data => {
                window.questions = data;
                displayQuestions();
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    // 현재 페이지에 질문을 표시하는 함수
    function displayQuestions() {
        const questionContainer = document.getElementById("question-container");
        questionContainer.innerHTML = "";

        const start = currentPage * questionsPerPage;
        const end = start + questionsPerPage;
        const currentQuestions = questions.slice(start, end);

        currentQuestions.forEach((question, index) => {
            const questionElement = document.createElement("div");
            questionElement.classList.add("question");

            const questionLabel = document.createElement("label");
            questionLabel.textContent = question.question;
            questionElement.appendChild(questionLabel);

            question.choices.forEach(choice => {
                const choiceContainer = document.createElement("div");

                const choiceInput = document.createElement("input");
                choiceInput.type = "radio";
                choiceInput.name = `q${start + index}`;
                choiceInput.value = choice;
                choiceInput.addEventListener('change', () => handleChoiceChange(start + index, choice));

                const choiceLabel = document.createElement("label");
                choiceLabel.textContent = choice;

                choiceContainer.appendChild(choiceInput);
                choiceContainer.appendChild(choiceLabel);

                questionElement.appendChild(choiceContainer);
            });

            questionContainer.appendChild(questionElement);
        });

        updateNextButtonState();
    }

    // 사용자가 답변을 선택할 때 호출되는 함수
    function handleChoiceChange(questionIndex, choice) {
        responses[questionIndex] = choice;
        updateNextButtonState();
    }

    // "다음" 버튼의 상태를 업데이트하는 함수
    function updateNextButtonState() {
        const nextButton = document.getElementById("next-button");
        const start = currentPage * questionsPerPage;
        const end = start + questionsPerPage;

        const allAnswered = Array.from({ length: questionsPerPage }).every((_, i) => responses[start + i] !== undefined);

        nextButton.disabled = !allAnswered;
    }

    // "다음" 버튼 클릭 시 호출되는 함수
    function handleNextButtonClick() {
        const start = currentPage * questionsPerPage;
        const end = start + questionsPerPage;

        if (end >= questions.length) {
            submitResponses();
        } else {
            currentPage++;
            displayQuestions();
        }
    }

    // 사용자의 응답을 서버에 제출하는 함수
    function submitResponses() {
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responses)
        })
        .then(response => response.json())
        .then(data => {
            alert(`결과: ${data.type}\n메시지: ${data.message}`);
        })
        .catch(error => console.error('Error submitting responses:', error));
    }

    // 이벤트 리스너 등록
    document.getElementById("next-button").addEventListener('click', handleNextButtonClick);

    // 초기 질문 로드
    loadQuestions();
});
