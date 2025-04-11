
# app.py
from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

task_file = 'data/tasks.json'

# Ensure data folder and file exist
os.makedirs('data', exist_ok=True)
if not os.path.exists(task_file):
    with open(task_file, 'w') as f:
        json.dump({}, f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_tasks/<date>', methods=['GET'])
def get_tasks(date):
    with open(task_file, 'r') as f:
        tasks = json.load(f)
    return jsonify(tasks.get(date, []))

@app.route('/save_tasks/<date>', methods=['POST'])
def save_tasks(date):
    data = request.json
    with open(task_file, 'r') as f:
        tasks = json.load(f)
    tasks[date] = data
    with open(task_file, 'w') as f:
        json.dump(tasks, f)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
