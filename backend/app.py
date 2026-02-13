# ===============================
# 1️⃣ IMPORTS
# ===============================
import requests
import numpy as np
import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from flask import Flask, request, jsonify
import os

OMDB_API_KEY = os.environ.get("OMDB_API_KEY")

nltk_data_path = os.path.join(os.getcwd(), "nltk_data")
os.makedirs(nltk_data_path, exist_ok=True)

nltk.data.path.append(nltk_data_path)

try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords", download_dir=nltk_data_path)

try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt", download_dir=nltk_data_path)

# ===============================
# 2️⃣ LOAD DATA + BUILD MODEL
# ===============================

df = pd.read_csv("movies.csv")

required_columns = ["genres", "keywords", "overview", "title", "cast", "director"]
df = df[required_columns]
df = df.dropna().reset_index(drop=True)

df["combined"] = df['genres'] + ' ' + df['keywords'] + ' ' + df['overview'] + ' ' + df['cast'] + ' ' + df['director']

data = df[["title", "combined"]].copy()

stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

data['cleaned_text'] = data['combined'].apply(preprocess_text)

tfidf_vectorizer = TfidfVectorizer(max_features=5000)
tfidf_matrix = tfidf_vectorizer.fit_transform(data['cleaned_text'])

cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)


# ===============================
# 3️⃣ RECOMMEND FUNCTION
# ===============================

def recommend_movies(movie_name, top_n=5):
    idx = data[data['title'].str.lower() == movie_name.lower()].index
    if len(idx) == 0:
        return None
    idx = idx[0]

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:top_n+1]

    movie_indices = [i[0] for i in sim_scores]
    return data[['title']].iloc[movie_indices]


# ===============================
# 4️⃣ FLASK BACKEND
# ===============================

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Movie Recommender Backend Is Running"

@app.route("/recommend", methods=["GET"])
def recommend():
    movie = request.args.get("movie")
    results = recommend_movies(movie)

    if results is None:
        return jsonify({"error": "Movie not found"})

    recommendations = []

    for title in results["title"].tolist():
        omdb_url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&t={title}"
        response = requests.get(omdb_url)
        movie_data = response.json()

        recommendations.append({
            "title": movie_data.get("Title"),
            "poster": movie_data.get("Poster"),
            "plot": movie_data.get("Plot")
        })

    return jsonify({"recommendations": recommendations})


if __name__ == "__main__":
    app.run(debug=True)
