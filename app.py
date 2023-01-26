from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')
    
@app.route('/Games')
def Games():
    return render_template('Games.html')
    
@app.route('/login')
def login():
    return render_template('login.html')
