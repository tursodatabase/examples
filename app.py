import os
import datetime
import uuid
from flask import Flask, render_template, redirect, url_for, request
from dotenv import load_dotenv
from flask_assets import Bundle, Environment
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Base, Link, User

load_dotenv()

app = Flask(__name__)

# Bundle CSS & JS assets & register
assets = Environment(app);
css = Bundle("src/main.css", output="dist/main.css")
js = Bundle("src/*.js", output="dist/main.js")
logo = Bundle("img/logo.svg")

assets.register("css", css)
assets.register("js", js)
css.build()
js.build()

# Get environment variables
TURSO_DB_URL = os.environ.get("TURSO_DB_URL")
TURSO_DB_AUTH_TOKEN = os.environ.get("TURSO_DB_AUTH_TOKEN")
dbUrl = f"sqlite+{TURSO_DB_URL}/?authToken={TURSO_DB_AUTH_TOKEN}&secure=true"

current_time = datetime.datetime.now();
current_time_in_seconds = int(float((current_time-datetime.datetime(1970,1,1)).total_seconds()))

engine = create_engine(dbUrl, connect_args={'check_same_thread': False}, echo=True)

@app.route("/", methods=(['POST','GET']))
def home():
    if request.method == 'POST':
      user_name = request.form['user_name']
      email = request.form['email']
      full_name = request.form['full_name']
      github = request.form['github']
      twitter = request.form['twitter']
      youtube = request.form['youtube']
      linkedin = request.form['linkedin']
      facebook = request.form['facebook']
      
      if not user_name:
        return f'<div class="error">Username is required</div>'
      elif not email:
        return f'<div class="error">Email is required</div>'
      elif not full_name:
        return f'<div class="error">Your full name is required</div>'
      elif not github and not twitter and not youtube and not linkedin and not facebook and not youtube:
        return f'<div class="error">At least one social link is required</div>'
      else:
        with Session(engine) as session:
          user_id = str(uuid.uuid4())
          delete_id = str(uuid.uuid4())
          links = []
          if github:
            links.append(Link(
              id=str(uuid.uuid4()),
              user_id=user_id,
              website="github",
              link=github,
              created_at=current_time_in_seconds,
          ))
          if twitter:
            links.append(Link(
              id=str(uuid.uuid4()),
              user_id=user_id,
              website="twitter",
              link=twitter,
              created_at=current_time_in_seconds,
          ))
          if youtube:
            links.append(Link(
              id=str(uuid.uuid4()),
              user_id=user_id,
              website="youtube",
              link=youtube,
              created_at=current_time_in_seconds,
          ))
          if linkedin:
            links.append(Link(
              id=str(uuid.uuid4()),
              user_id=user_id,
              website="linkedin",
              link=linkedin,
              created_at=current_time_in_seconds,
          ))
          if facebook :
            links.append(Link(
              id=str(uuid.uuid4()),
              user_id=user_id,
              website="facebook",
              link=facebook,
              created_at=current_time_in_seconds,
          ))
          user = User(
              id=user_id,
              delete_id=delete_id,
              email=email,
              full_name=full_name,
              user_name=user_name,
              created_at=current_time_in_seconds,
              links=links,
          )
          session.add_all([user])
          session.commit()
          return f'<div class="success">Account added. Delete ID: ({delete_id}) </div><p class="p-2 text-center"> You social links are now available at <a href={request.base_url}u/{user.user_name} target="_blank">{request.base_url}u/{user.user_name}</a> </p>'
        
    return render_template("index.html", page_url=url_for('home'))

@app.route("/u/<username>", methods=(["GET", "POST"]))
def get_username(username):
    user_name = str(username)
    session = Session(engine)
    
    if request.method == 'POST':
      # delete user
      delete_id = str(request.headers['HX-Prompt'])
      print(delete_id)
      user_to_delete = session.scalars(select(User).where(User.delete_id.in_([delete_id]))).first()
      session.delete(user_to_delete)
      session.commit()
      return f'<div class="error">User <strong>{user_name}</strong> info deleted! <p><a href="{url_for("home")}">Go back home</a></p></div>'

    user = session.scalars(select(User).where(User.user_name.in_([user_name]))).first()
    if user is not None:
      links = session.scalars(select(Link).where(Link.user_id.in_([user.id]))).all()
      return render_template("username.html", user=user, links=links, page_url=url_for('get_username', username=username))
    else:
      return render_template("404.html", message="User not found")

@app.route("/seed")
def seed():
    # Create all tables in metadata
    Base.metadata.create_all(engine)

    # Seed an account
    user_id=str(uuid.uuid4());
    delete_id=str(uuid.uuid4());

    with Session(engine) as session:
        links=[Link(
            id=str(uuid.uuid4()),
            user_id=user_id,
            website="github",
            link="https://github.com/tursodatabase",
            created_at=current_time_in_seconds,
        ),Link(
            id=str(uuid.uuid4()),
            user_id=user_id,
            website="linkedin",
            link="https://linkedin.com/in/tursodatabase",
            created_at=current_time_in_seconds,
        ),Link(
            id=str(uuid.uuid4()),
            user_id=user_id,
            website="twitter",
            link="https://twitter.com/tursodatabase",
            created_at=current_time_in_seconds,
        )]
        user = User(
            id=user_id,
            email="tips@turso.tech",
            full_name="Iku Turso",
            user_name="turso",
            delete_id=delete_id,
            created_at=current_time_in_seconds,
            links=links,
        )
        session.add_all([user])
        session.commit()
    
    session = Session(engine)

    # get & print seeded user
    stmt = select(User).where(User.id.in_([user_id]))

    for user in session.scalars(stmt):
        print(user)
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(debug=True)  