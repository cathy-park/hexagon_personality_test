from flask import Flask, render_template, request, redirect, url_for, jsonify
import json

app = Flask(__name__)

with open('data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

personality_types = {
    "디지털 선구자 (Digital Pioneer)": "기술의 최전선에서 혁신을 이끄는 당신, 균형 잡힌 성장으로 더 큰 영향력을 만들어보세요.",
    "웰니스 고수 (Wellness Guru)": "건강한 몸과 마음으로 삶을 즐기는 당신, 디지털 능력 향상으로 더 넓은 세상과 소통해보세요.",
    # ... 나머지 유형들 추가
}

@app.route('/')
def index():
    return render_template('index.html', questions=questions)

@app.route('/submit', methods=['POST'])
def submit():
    responses = request.json
    scores = {category: 0 for category in questions.keys()}

    for category, qs in questions.items():
        for i, question in enumerate(qs):
            scores[category] += int(responses[question['id']])
    
    closest_category = max(scores, key=scores.get)
    result_message = personality_types[closest_category]
    
    return jsonify({'type': closest_category, 'message': result_message})

if __name__ == '__main__':
    app.run(debug=True)
