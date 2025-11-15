import React, { Component } from "react";
import API from "../helpers/API";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

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

  sanitizeUrl(url) {
    if (!url) {
      return null;
    }
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    return `https://${url.replace(/^\/+/, "")}`;
  }

  getRatingValue(movie) {
    if (typeof movie.rating === "number") {
      return movie.rating;
    }
    if (movie.rating && typeof movie.rating === "object") {
      if (typeof movie.rating.value === "number") {
        return movie.rating.value;
      }
      if (typeof movie.rating.average === "number") {
        return movie.rating.average;
      }
    }
    return null;
  }

  formatNumber(value) {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number") {
      return value > 0 ? compactNumber.format(value) : null;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      let multiplier = 1;
      if (trimmed.includes("亿")) {
        multiplier = 100000000;
      } else if (trimmed.includes("万")) {
        multiplier = 10000;
      }
      const numeric = parseFloat(trimmed.replace(/[^\d.]/g, ""));
      if (Number.isNaN(numeric)) {
        return trimmed;
      }
      return compactNumber.format(numeric * multiplier);
    }

    return null;
  }

  asList(value) {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "string") {
      return value
        .split(/[,，、]|\s{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  }

  formatPeople(value, limit = 3) {
    const list = this.asList(value).slice(0, limit);
    return list.length ? list.join(", ") : null;
  }

  formatGenres(value, limit = 3) {
    const list = this.asList(value).slice(0, limit);
    return list.length ? list.join(" · ") : null;
  }

  extractYear(movie) {
    if (movie.year) {
      return movie.year;
    }
    const dateString =
      movie.release_date ||
      movie.release ||
      movie.pubdate ||
      movie.pub_date ||
      movie.publish_date;
    if (!dateString) {
      return null;
    }
    const match = `${dateString}`.match(/\d{4}/);
    return match ? match[0] : null;
  }

  getSynopsis(movie) {
    return (
      movie.quote ||
      movie.summary ||
      movie.description ||
      movie.intro ||
      movie.desc
    );
  }

  getDuration(movie) {
    const duration = movie.duration || movie.runtime || movie.len;
    if (!duration) {
      return null;
    }
    if (typeof duration === "number") {
      return `${duration} min`;
    }
    if (typeof duration === "string") {
      const trimmed = duration.trim();
      const match = trimmed.match(/\d+/);
      if (match) {
        return `${match[0]} min`;
      }
      return trimmed;
    }
    return null;
  }

  renderDetail(label, value) {
    if (!value) {
      return null;
    }
    return (
      <div className="detail-item" key={label}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    );
  }

  renderCard(movie) {
    const ratingValue = this.getRatingValue(movie);
    const ratingLabel =
      typeof ratingValue === "number" ? `${ratingValue.toFixed(1)}/10` : null;
    const votes =
      this.formatNumber(
        movie.votes ??
          movie.rating_count ??
          movie.collect_count ??
          movie.comments ??
          movie.reviews_count,
      ) || null;
    const wishCount = this.formatNumber(
      movie.wish_count ?? movie.wishers ?? movie.want_watch_count,
    );
    const releasePieces = [
      this.extractYear(movie),
      movie.region || movie.country,
    ].filter(Boolean);
    const releaseLine = releasePieces.join(" • ");
    const durationLabel = this.getDuration(movie);
    const genres = this.formatGenres(movie.genres || movie.tags);
    const directors = this.formatPeople(movie.directors || movie.director);
    const actors = this.formatPeople(
      movie.actors || movie.casts || movie.cast || movie.stars,
    );
    const synopsis = this.getSynopsis(movie);
    const poster =
      this.sanitizeUrl(movie.cover || movie.poster || movie.pic) || null;

    return (
      <article className="card" key={movie.id || movie.title}>
        <div className="card-meta">
          <span className="badge">Douban</span>
          {ratingLabel && <span>{ratingLabel}</span>}
        </div>
        <h3 className="card-title">
          <a href={movie.url} target="_blank" rel="noreferrer">
            {movie.title}
          </a>
        </h3>
        {(releaseLine || durationLabel) && (
          <p className="card-subtitle">
            {releaseLine && <span>{releaseLine}</span>}
            {durationLabel && (
              <span className="chip chip--outline">{durationLabel}</span>
            )}
          </p>
        )}
        {synopsis && <p className="card-body">{synopsis}</p>}
        {poster && (
          <div className="card-media">
            <img
              src={poster}
              alt={movie.title}
              loading="lazy"
              onError={(evt) => {
                evt.target.style.display = "none";
              }}
            />
          </div>
        )}
        {(genres || directors || actors || votes || wishCount) && (
          <dl className="detail-list">
            {this.renderDetail("Genres", genres)}
            {this.renderDetail("Director", directors)}
            {this.renderDetail("Cast", actors)}
            {this.renderDetail("Ratings", votes && `${votes} ratings`)}
            {this.renderDetail(
              "Wishlist",
              wishCount && `${wishCount} wish to watch`,
            )}
          </dl>
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
        <div className="panel-placeholder">No Douban highlights available.</div>
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
