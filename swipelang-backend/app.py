from flask import Flask, jsonify, request, send_file
from utils.data_manager import load_slang_data, load_user_history, save_user_history, get_today_key
from utils.quiz_generator import generate_quiz
from utils.tts import speak
import random
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://www.swipelang.com"}}, supports_credentials=True)

# 데이터 불러오기
slangs = load_slang_data()
history = load_user_history()
today = get_today_key()

# 오늘 히스토리 초기화
if today not in history:
    history[today] = {"known": [], "review": [], "viewed": []}
    save_user_history(history)

@app.route("/")
def index():
    return jsonify({"message": "SwipeLang Flask API is running!"})

@app.route("/slang/today")
def get_today_slang():
    global history, today

    if today not in history:
        history[today] = {"known": [], "review": [], "viewed": []}

    viewed = history[today].get("viewed", [])

    print("🧪 전체 슬랭 개수:", len(slangs))
    print("🧪 viewed 개수:", len(viewed))
    print("🧪 available 개수:", len([s for s in slangs if s.get("phrase") not in viewed]))

    available = [s for s in slangs if s.get("phrase") not in viewed]

    if not available:
        return jsonify({"message": "오늘 학습 가능한 슬랭이 없습니다."}), 404

    current = random.choice(available)
    history[today]["viewed"].append(current["phrase"])
    save_user_history(history)
    return jsonify(current)

@app.route("/slang/known")
def get_known():
    return jsonify(history[today]["known"])

@app.route("/slang/review")
def get_review():
    return jsonify(history[today]["review"])

@app.route("/slang/remember", methods=["POST"])
def remember():
    phrase = request.json.get("phrase")
    matched = next((s for s in slangs if s["phrase"] == phrase), None)
    if not matched:
        return jsonify({"error": "슬랭을 찾을 수 없습니다."}), 404
    history[today]["known"].append(matched)
    save_user_history(history)
    return jsonify({"status": "기억 완료"})

@app.route("/slang/repeat", methods=["POST"])
def repeat():
    phrase = request.json.get("phrase")
    matched = next((s for s in slangs if s["phrase"] == phrase), None)
    if not matched:
        return jsonify({"error": "슬랭을 찾을 수 없습니다."}), 404
    history[today]["review"].append(matched)
    save_user_history(history)
    return jsonify({"status": "복습 등록 완료"})

@app.route("/quiz")
def quiz():
    if len(history[today]["known"]) < 3:
        return jsonify({"error": "퀴즈 시작에 필요한 최소 슬랭이 부족합니다."}), 400
    q = generate_quiz(history[today]["known"])
    return jsonify(q)

@app.route("/stats")
def stats():
    nickname = request.args.get("nickname")
    return jsonify({
        "known": history[today]["known"],
        "review": history[today]["review"]
    })


@app.route("/tts")
def tts():
    phrase = request.args.get("phrase")
    if not phrase:
        return jsonify({"error": "문장을 입력해주세요."}), 400
    mp3_data = speak(phrase)
    return send_file(io.BytesIO(mp3_data), mimetype="audio/mpeg")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

@app.route("/debug")
def debug():
    return jsonify({
        "총 슬랭 수": len(slangs),
        "예시": slangs[:3],
        "오늘 viewed 수": len(history.get(today, {}).get("viewed", []))
    })