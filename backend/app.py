import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#获取 OpenAI API Key
#Obtain the OpenAI API Key;
OPENAI_API_KEY = "sss"

# OPENAI_API_KEY = os.getenv(KEY)
if not OPENAI_API_KEY:
    raise ValueError("请设置环境变量 Set environment variables : OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    
    # 定义请求头和数据负载
    # Define request headers and payload
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ]
    }
    
    try:
        # 直接调用 OpenAI Chat Completions API
        # Invoke OpenAI Chat Completions API
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        if response.status_code != 200:
            return jsonify({"error": response.text}), response.status_code
        
        result = response.json()
        assistant_message = result["choices"][0]["message"]["content"]
        return jsonify({"reply": assistant_message})
    except Exception as e:
        print("Error details:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)