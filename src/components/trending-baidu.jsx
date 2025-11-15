import React, { Component } from "react";
import API from "../helpers/API";

class trendingBaidu extends Component {
  state = {
    hotNews: [],
    hotSearches: [],
    isLoading: true,
  };
  _isMounted = false;

  constructor(props) {
    super(props);
    this.props = props;
    this.api = new API();
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      const [
        { error: hotNewsError, data: hotNews },
        { error: hotSearchError, data: hotSearches },
      ] = await Promise.all([
        this.api.getBaiduHotNews(),
        this.api.getBaiduHotSearch(),
      ]);

      if (this._isMounted) {
        this.setState({
          hotNews: hotNewsError ? [] : hotNews.slice(0, 6),
          hotSearches: hotSearchError ? [] : hotSearches.slice(0, 10),
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

  renderSearchCard(item) {
    return (
      <article className="card" key={item.url || item.title}>
        <div className="card-meta">
          <span className="badge">Hot search</span>
          {item.hotScore && <span>{item.hotScore.toLocaleString()} heat</span>}
        </div>
        <h3 className="card-title">
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.title}
          </a>
        </h3>
        {item.summary && <p className="card-body">{item.summary}</p>}
      </article>
    );
  }

  renderNewsCard(article) {
    return (
      <article className="card" key={article.link || article.title}>
        <div className="card-meta">
          <span className="badge">Hot list</span>
        </div>
        <h3 className="card-title">
          <a href={article.link} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
      </article>
    );
  }

  render() {
    const { hotNews, hotSearches, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="panel-placeholder">Scanning Baidu search surges…</div>
      );
    }

    if (!hotNews.length && !hotSearches.length) {
      return (
        <div className="panel-placeholder">No Baidu trends available.</div>
      );
    }

    return (
      <div className="dual-grid">
        <div>
          <h3 className="dual-grid-title">Realtime Searches</h3>
          <div className="card-grid">
            {hotSearches.map((item) => this.renderSearchCard(item))}
          </div>
        </div>
        <div>
          <h3 className="dual-grid-title">Top Stories</h3>
          <div className="card-grid">
            {hotNews.map((article) => this.renderNewsCard(article))}
          </div>
        </div>
      </div>
    );
  }
}

export default trendingBaidu;
