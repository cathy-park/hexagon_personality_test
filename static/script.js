const questions = [
    // 질문 리스트
];

let currentPage = 0;
const questionsPerPage = 5;
const totalPages = Math.ceil(questions.length / questionsPerPage);

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();

    document.getElementById('next-button').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            loadQuestions();
        } else {
            // 결과 제출
            submitAnswers();
        }
    });
});

function loadQuestions() {
    const container = document.getElementById('question-container');
    container.innerHTML = '';

    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    const pageQuestions = questions.slice(start, end);

    pageQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const label = document.createElement('label');
        label.innerText = question.question;
        questionDiv.appendChild(label);

        question.choices.forEach(choice => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${start + index + 1}`;
            radio.value = choice;
            radio.addEventListener('change', checkAnswers);
            questionDiv.appendChild(radio);
            questionDiv.appendChild(document.createTextNode(choice));
        });

        container.appendChild(questionDiv);
    });

    checkAnswers();
}

function checkAnswers() {
    const answered = document.querySelectorAll('input[type="radio"]:checked').length;
    document.getElementById('next-button').disabled = answered < questionsPerPage;
}

function submitAnswers() {
    const form = document.getElementById('questionnaire-form');
    const formData = new FormData(form);

    const answers = {};
    formData.forEach((value, key) => {
        answers[key] = value;
    });

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    })
    .then(response => response.json())
    .then(result => {
        alert(`당신의 유형은: ${result.type}\n메시지: ${result.message}`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
