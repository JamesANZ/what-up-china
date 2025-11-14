import React, { Component } from "react";
import API from "../helpers/API";

class trendingBilibili extends Component {
  state = {
    trends: [],
    isLoading: true,
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.api = new API();
  }

  async componentDidMount() {
    try {
      const { error, data: trends } = await this.api.getTrendingOnBilibili();
      this.setState({
        trends: error ? [] : trends,
        isLoading: false,
      });
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  }

  makeTrendDiv(trend) {
    const cleanedImg =
      trend.pic &&
      `https://${trend.pic.replace("http://", "").replace("https://", "")}`;

    const viewLabel = trend.play ? trend.play : null;

    return (
      <article className="card" key={trend.short_link || trend.title}>
        <div className="card-meta">
          <span className="badge">Bilibili</span>
          {viewLabel && <span>{viewLabel} views</span>}
        </div>
        <h3 className="card-title">
          <a href={trend.short_link} target="_blank" rel="noreferrer">
            {trend.title}
          </a>
        </h3>
        {trend.desc && <p className="card-body">{trend.desc}</p>}
        {cleanedImg && (
          <div className="card-media">
            <img src={cleanedImg} alt={trend.title} loading="lazy" />
          </div>
        )}
      </article>
    );
  }

  render() {
    const { trends, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="panel-placeholder">
          Pulling the latest Bilibili buzz…
        </div>
      );
    }

    if (!trends.length) {
      return (
        <div className="panel-placeholder">
          No trending Bilibili topics right now.
        </div>
      );
    }

    return (
      <div className="card-grid">
        {trends.map((trend) => {
          return this.makeTrendDiv(trend);
        })}
      </div>
    );
  }
}

export default trendingBilibili;
