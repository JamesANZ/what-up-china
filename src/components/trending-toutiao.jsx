import React, { Component } from "react";
import API from "../helpers/API";

class TrendingToutiao extends Component {
  state = {
    stories: [],
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
      const { error, data } = await this.api.getToutiaoHotBoard();
      if (this._isMounted) {
        this.setState({
          stories: error ? [] : data.slice(0, 12),
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

  renderCard(item) {
    return (
      <article className="card" key={item.url || item.title}>
        <div className="card-meta">
          <span className="badge">{item.label || "Toutiao"}</span>
          {item.hotValue && (
            <span>{Number(item.hotValue).toLocaleString()} heat</span>
          )}
        </div>
        <h3 className="card-title">
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.title}
          </a>
        </h3>
        {item.query && <p className="card-body">{item.query}</p>}
        {item.image && (
          <div className="card-media">
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              onError={(evt) => {
                evt.target.style.display = "none";
              }}
            />
          </div>
        )}
      </article>
    );
  }

  render() {
    const { stories, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="panel-placeholder">
          Pulling Toutiao&apos;s hot board…
        </div>
      );
    }

    if (!stories.length) {
      return (
        <div className="panel-placeholder">
          No Toutiao topics are available right now.
        </div>
      );
    }

    return (
      <div className="card-grid">
        {stories.map((item) => this.renderCard(item))}
      </div>
    );
  }
}

export default TrendingToutiao;
