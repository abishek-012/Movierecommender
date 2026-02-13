import { useState } from "react";
import "./App.css";
import TargetCursor from "./TargetCursor";

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    if (!movie.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/recommend?movie=${encodeURIComponent(movie)}`
      );
      const data = await response.json();
      
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        alert(data.error || "Failed to fetch recommendations");
      }
    } catch (error) {
      alert("Failed to connect to the server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />
      
      <div className="content-wrapper">
        <header className="header-section">
          <h1 className="cursor-target title">
            <span className="title-gradient">Movie Recommender</span>
          </h1>
          <p className="subtitle">Discover your next favorite film</p>
        </header>

        <div className="search-container">
          <div className="input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Enter a movie you love..."
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchRecommendations()}
              aria-label="Movie search input"
            />
            <button 
              className="cursor-target search-button" 
              onClick={fetchRecommendations}
              disabled={loading || !movie.trim()}
              aria-label={loading ? "Loading recommendations" : "Get recommendations"}
            >
              {loading ? (
                <span className="loading-spinner" aria-hidden="true"></span>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </div>

        {recommendations.length > 0 && (
          <section className="recommendations-section" aria-label="Movie recommendations">
            <h2 className="recommendations-title">Recommended for You</h2>
            <div className="recommendations-grid">
              {recommendations.map((movieItem, index) => (
                <article 
                  key={`${movieItem.title}-${index}`} 
                  className="recommendation-card cursor-target"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-poster-wrapper">
                    <img 
                      src={movieItem.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                      alt={`${movieItem.title} poster`}
                      className="card-poster"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                      }}
                    />
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{movieItem.title}</h3>
                    
                    
                    {movieItem.plot && (
                      <p className="card-plot">{movieItem.plot}</p>
                    )}
                    
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;