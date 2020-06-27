# import necessary libraries
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
# import scrape_mars

# create instance of Flask app
app = Flask(__name__)

# create route that renders index.html template
@app.route("/")
def index():
    # listings = mongo.db.mars.find_one()
    listings = "Test"
    return render_template("index.html", listings = listings)

if __name__ == "__main__":
    app.run(debug=True)
