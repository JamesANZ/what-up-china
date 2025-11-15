import React, { Component } from "react";
import API from "../helpers/API";

class TrendingDouban extends Component {
  state = {
    films: [],
    isLoading: true,
  };
  _isMounted = false;

  constructor(props) {
    super(props);
    this.api = new API();
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      const { error, data } = await this.api.getDoubanHotMovies();
      if (this._isMounted) {
        this.setState({
          films: error ? [] : data.slice(0, 12),
          isLoading: false,
        });
      }
    } catch (e) {
      console.error(e);
      if (this._isMounted) {
        this.setState({ isLoading: false });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderCard(movie) {
    return (
      <article className="card" key={movie.id || movie.title}>
        <div className="card-meta">
          <span className="badge">Douban</span>
          {movie.rating && <span>{movie.rating.toFixed(1)}/10</span>}
        </div>
        <h3 className="card-title">
          <a href={movie.url} target="_blank" rel="noreferrer">
            {movie.title}
          </a>
        </h3>
        {movie.cover && (
          <div className="card-media">
            <img
              src={movie.cover}
              alt={movie.title}
              loading="lazy"
              onError={(evt) => {
                evt.target.style.display = "none";
              }}
            />
          </div>
        )}
        {movie.isNew && (
          <span className="badge" style={{ alignSelf: "flex-start" }}>
            New
          </span>
        )}
      </article>
    );
  }

  render() {
    const { films, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="panel-placeholder">Fetching Douban box office…</div>
      );
    }

    if (!films.length) {
      return (
        <div className="panel-placeholder">
          No Douban highlights available.
        </div>
      );
    }

    return (
      <div className="card-grid">
        {films.map((movie) => this.renderCard(movie))}
      </div>
    );
  }
}

export default TrendingDouban;

