from flask import Flask, render_template,request,jsonify,redirect,url_for,session
import os
import requests
from flask_sqlalchemy import SQLAlchemy
from flask import session
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///signup.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
DB = 'signup.db'
db = SQLAlchemy(app)
GEMINI_KEY = os.environ.get("GEMINI_API")
app.secret_key = "MY_KEY"

class Signup(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True,nullable=False)
    password = db.Column(db.String(110),  nullable=False)

    def _repr_(self) -> str:
        return f'<User {self.email}>'
    
class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    game_name = db.Column(db.String(50), nullable=False)
    last_score = db.Column(db.Integer, nullable=False)
    high_score = db.Column(db.Integer, nullable=False)
    last_played = db.Column(db.DateTime, default=datetime.now)

class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False)
    note_content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

@app.route('/')
def login():
    return render_template("index.html")

@app.route('/register', methods=['GET','POST']) 
def register():
    if(request.method == 'POST'):
        email = request.form.get('email')
        username = request.form.get('username')
        if not username:
            return render_template('signup.html', message="Username is required.")
        password = request.form.get('password')
        existing_user = Signup.query.filter_by(email=email).first()
        if existing_user:
            return render_template('signup.html', message="Email already registered. Please log in.")
        existing_name = Signup.query.filter_by(username=username).first()
        if existing_name:
            return render_template('signup.html', message="Create any other name.... already occupied")
        new_user = Signup(email=email,username=username ,password=password)
        entry = Signup(email=email,username=username ,password=password)
        db.session.add(new_user)
        db.session.commit()
        return render_template('login.html', message="Registration successful! Please log in.")
    else:
        return render_template('signup.html')
    
@app.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        user = Signup.query.filter_by(email=email,username=username).first()
        if user and user.password == password:
            session['username'] = username
            session['email'] = email
            return redirect(url_for('emotion'))
        else:
            return render_template("login.html",message='Invalid credentials. Please try again.')
    return render_template('index.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/emotion') 
def emotion():
    return render_template('emotion.html',username=session.get('username'))

@app.route('/sad')
def sad():
    return render_template('sad.html')

@app.route('/sketch')
def sketch():
    return render_template('sketchYourHeart.html',username=session.get('username'))

@app.route('/angry')
def angry():
    return render_template('anger.html')

@app.route('/romantic')
def romantic():
    return render_template('romantic.html')

@app.route('/lost')
def lost():
    return render_template('lost.html')

@app.route('/happy')
def happy():
    return render_template('happy.html')

@app.route('/emojitap')
def emojitap():
    return render_template('emojitap.html',username=session['username'])

@app.route('/heartcatch')
def heartcatch():
    return render_template('heart-catcher.html',username=session["username"])

@app.route('/touch')
def touch():
    return render_template('touch-heal.html',username=session['username'])

@app.route('/hitbox')
def hitbox():
    return render_template('hitbox.html',username=session['username'])

@app.route('/chat')
def chat(): 
    return render_template('chat.html',username=session['username'])
@app.route("/gemini", methods=["POST"])
def gemini():
    user_prompt = request.json.get("prompt")

    print("USER PROMPT:", user_prompt)
    print("USING GEMINI KEY:", GEMINI_KEY)

    if not GEMINI_KEY:
        return jsonify({"error": "Gemini API key is missing"}), 500

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}",
        headers={"Content-Type": "application/json"},
        json={
            "contents": [
                {
                    "parts": [{"text": user_prompt}]
                }
            ]
        }
    )

    print("RAW GEMINI RESPONSE:", response.text)  # <-- full response

    data = response.json()
    return jsonify(data)

@app.route('/flying-chicks')
def flying_chicks():
    return render_template('flying-chicks.html',username=session['username'])

@app.route('/smashcolors')
def smashfruits():
    return render_template('smashcolors.html',username=session['username'])

@app.route('/teddy')
def teddy():
    return render_template('teddy.html',username=session['username'])

@app.route('/flappybird')
def flappybird():
    return render_template('flappybirdclone.html',username=session['username'])

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.json
    username = data['username']
    game_name = data['game_name']
    score = data['score']
    record = Score.query.filter_by(username=username, game_name=game_name).first()
    if record:
        record.last_score = score
        record.last_played = datetime.now()
        if score > record.high_score:
            record.high_score = score
    else:
        record = Score(
            username=username,
            game_name=game_name,
            last_score=score,
            high_score=score,
            last_played=datetime.now()
        )
        db.session.add(record)
    db.session.commit()
    return jsonify({"message": "Score updated successfully"})

@app.route('/get_scores', methods=['GET'])
def get_scores():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    username = session['username']

    try:
        records = Score.query.filter_by(username=username).all()

        games_data = []
        for r in records:
            games_data.append({
                "game_name": r.game_name,
                "last_score": r.last_score,
                "high_score": r.high_score,
                "last_played": r.last_played.strftime("%Y-%m-%d %H:%M"),
            })

        return jsonify(games_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)