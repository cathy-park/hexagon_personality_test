document.addEventListener('DOMContentLoaded', function() {
    const questionsPerPage = 5;
    let currentPage = 0;
    let responses = {};
    let questions = {};

    // 질문 로드
    fetch('/get_questions')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestions();
        });

    // 질문 표시
    function displayQuestions() {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = '';

        const questionKeys = Object.keys(questions);
        const start = currentPage * questionsPerPage;
        const end = Math.min(start + questionsPerPage, questionKeys.length);

        for (let i = start; i < end; i++) {
            const category = questionKeys[i];
            const qs = questions[category];

            qs.forEach(q => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';

                const label = document.createElement('label');
                label.textContent = q.text;
                questionDiv.appendChild(label);

                q.choices.forEach((choice, idx) => {
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = q.id;
                    input.value = idx + 1;
                    input.addEventListener('change', checkAllAnswered);
                    questionDiv.appendChild(input);

                    const choiceLabel = document.createElement('span');
                    choiceLabel.textContent = choice;
                    questionDiv.appendChild(choiceLabel);

                    questionDiv.appendChild(document.createElement('br'));
                });

                questionContainer.appendChild(questionDiv);
            });
        }
    }

    // 모든 질문이 응답되었는지 확인
    function checkAllAnswered() {
        const allQuestions = document.querySelectorAll('.question');
        const allAnswered = Array.from(allQuestions).every(q => {
            const inputs = q.querySelectorAll('input[type="radio"]');
            return Array.from(inputs).some(input => input.checked);
        });

        document.getElementById('next-button').disabled = !allAnswered;
    }

    // 다음 페이지로 이동
    document.getElementById('next-button').addEventListener('click', () => {
        const questionKeys = Object.keys(questions);
        const start = currentPage * questionsPerPage;
        const end = Math.min(start + questionsPerPage, questionKeys.length);

        for (let i = start; i < end; i++) {
            const category = questionKeys[i];
            const qs = questions[category];

            qs.forEach(q => {
                const selected = document.querySelector(`input[name="${q.id}"]:checked`);
                if (selected) {
                    responses[q.id] = selected.value;
                }
            });
        }

        currentPage++;
        if (currentPage * questionsPerPage >= questionKeys.length) {
            submitResponses();
        } else {
            displayQuestions();
        }
    });

    // 응답 제출
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
            alert(`당신의 유형은: ${data.type}\n${data.message}`);
        });
    }
});
