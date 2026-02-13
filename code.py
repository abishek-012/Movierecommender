import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from wordcloud import WordCloud
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


df = pd.read_csv("movies.csv")
required_columns = ["genres", "keywords", "overview", "title", "cast", "director"]
df = df[required_columns]

df = df.dropna().reset_index(drop=True)

df["combined"] = df['genres'] + ' ' + df['keywords'] + ' ' + df['overview'] + ' ' +  df['cast'] + ' ' + df['director']

data = df[["title", "combined"]]


'''

# WordCloud for movie content
combined_text = " ".join(df['combined'])
wordcloud = WordCloud (width=800, height=400, background_color="white").generate (combined_text)

# WordCloud to visualize the most common words in the movie content
plt.figure(figsize=(10, 5))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.title("Most Common Words in Movie content")
plt.show()

'''

# download nltk data
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')


stop_words = set(stopwords.words('english'))

def preprocess_text(text):
  # Remove special characters and numbers
  text = re.sub(r"[^a-zA-Z\s]", "", text)
  # Convert to lowercase
  text = text.lower()
  # Tokenize and remove stopwords
  tokens = word_tokenize (text)
  tokens = [word for word in tokens if word not in stop_words]
  return " ".join(tokens)


# Apply preprocessing to the movie content
data['cleaned_text'] = df['combined'].apply(preprocess_text)


# Vectorization with TF-IDF
tfidf_vectorizer = TfidfVectorizer(max_features=5000)
tfidf_matrix = tfidf_vectorizer.fit_transform(data['cleaned_text'])

# Compute Cosine Similarity
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)


# Recommendation Function
def recommend_movies (movie_name, cosine_sim=cosine_sim, df=data, top_n=5):
  # Find the index of the movie
  idx = df[df['title'].str.lower() == movie_name.lower()].index
  if len(idx) == 0:
    return "Movie not found in the dataset!"
  idx = idx[0]

  # Get similarity scores
  sim_scores = list (enumerate (cosine_sim[idx]))
  sim_scores = sorted (sim_scores, key=lambda x: x[1], reverse=True)
  sim_scores = sim_scores [1:top_n+1]
  
  # Get movie indices
  movie_indices = [i[0] for i in sim_scores]
  
  # Return top n similar movies
  return df[['title']].iloc[movie_indices]


recommend_movies("Avengers: Age of Ultron")