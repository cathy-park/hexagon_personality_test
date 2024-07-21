from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# JSON 파일 경로 설정
json_file_path = os.path.join(os.getcwd(), 'data', 'questions.json')

# JSON 파일 로드
with open(json_file_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

personality_types = {
    "디지털 선구자 (Digital Pioneer)": "기술의 최전선에서 혁신을 이끄는 당신, 균형 잡힌 성장으로 더 큰 영향력을 만들어보세요.",
    "웰니스 고수 (Wellness Guru)": "건강한 몸과 마음으로 삶을 즐기는 당신, 디지털 능력 향상으로 더 넓은 세상과 소통해보세요.",
    "감성 리더 (Empathy Leader)": "뛰어난 대인관계 능력의 소유자, 기술적 지식을 보완하여 더 큰 변화를 만들어보세요.",
    "네트워크 허브 (Network Hub)": "폭넓은 인맥의 중심에 선 당신, 개인의 웰빙에도 관심을 가져 더 지속 가능한 관계를 만들어보세요.",
    "창의적 혁신가 (Creative Innovator)": "독창적인 아이디어의 원천인 당신, 체계적인 실행력을 키워 꿈을 현실로 만들어보세요.",
    "실용적 문제해결사 (Practical Problem Solver)": "현실적 해결책의 달인, 창의적 사고를 통해 더 혁신적인 솔루션을 만들어보세요.",
    "균형잡힌 전문가 (Balanced Expert)": "모든 영역에서 안정적인 능력을 보이는 당신, 각 영역을 더욱 발전시켜 탁월함을 추구해보세요.",
    "디지털 웰니스 코치 (Digital Wellness Coach)": "기술과 건강의 조화를 아는 당신, 인간관계 스킬을 향상시켜 더 많은 이들에게 영향을 주세요.",
    "감성적 창작자 (Emotional Creator)": "감성과 창의성의 결합, 실용적 기술을 보완하여 작품에 생명력을 불어넣어보세요.",
    "소셜 이노베이터 (Social Innovator)": "사회적 가치와 혁신을 추구하는 당신, 개인의 건강관리로 지속 가능한 변화를 만들어가세요.",
    "적응형 리더 (Adaptive Leader)": "변화하는 환경에 빠르게 적응하는 당신, 감성 지능을 키워 더 효과적인 리더십을 발휘해보세요.",
    "디지털 장인 (Digital Artisan)": "기술과 창의성의 절묘한 조화, 체력 관리로 더 오랫동안 열정을 유지해보세요.",
    "웰빙 커뮤니케이터 (Wellbeing Communicator)": "건강한 삶의 메시지를 전하는 당신, 디지털 도구 활용으로 더 넓은 대중과 소통해보세요.",
    "분석적 공감자 (Analytical Empath)": "데이터와 감성의 균형을 아는 당신, 네트워킹 능력을 키워 더 큰 시너지를 만들어보세요.",
    "실용적 비전제시자 (Practical Visionary)": "현실적 대안과 미래 비전을 제시하는 당신, 디지털 리터러시를 높여 더 혁신적인 미래를 그려보세요.",
    "통합적 학습자 (Holistic Learner)": "다양한 분야의 지식을 흡수하는 당신, 실생활 적용 능력을 키워 지식의 가치를 높여보세요.",
    "디지털 휴머니스트 (Digital Humanist)": "기술과 인간성의 조화를 추구하는 당신, 신체적 건강에도 관심을 가져 삶의 질을 높여보세요.",
    "창의적 전략가 (Creative Strategist)": "혁신적 전략의 수립자인 당신, 실행력 강화로 아이디어를 현실화해보세요.",
    "회복력 있는 혁신가 (Resilient Innovator)": "역경을 기회로 만드는 당신, 디지털 능력 향상으로 더 큰 도약을 준비해보세요.",
    "균형잡힌 미래학자 (Balanced Futurist)": "미래를 예측하고 준비하는 당신, 현재의 웰빙에도 투자하여 지속 가능한 성장을 이뤄보세요."
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_questions')
def get_questions():
    return jsonify(questions)

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