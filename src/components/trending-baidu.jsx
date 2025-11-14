import React, { Component } from "react";
import API from "../helpers/API";

class trendingBaidu extends Component {
  state = {
    hotNews: [],
    isLoading: true,
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.api = new API();
  }

  makeNewsDiv(article) {
    return (
      <article className="card" key={article.link || article.title}>
        <div className="card-meta">
          <span className="badge">Baidu</span>
          {article.hotScore && <span>{article.hotScore} heat</span>}
        </div>
        <h3 className="card-title">
          <a href={article.link} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
        {article.summary && <p className="card-body">{article.summary}</p>}
      </article>
    );
  }

  async componentDidMount() {
    try {
      const { error, data: hotNews } = await this.api.getBaiduHotNews();
      this.setState({
        hotNews: error ? [] : hotNews,
        isLoading: false,
      });
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { hotNews, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="panel-placeholder">Scanning Baidu search surges…</div>
      );
    }

    if (!hotNews.length) {
      return (
        <div className="panel-placeholder">No Baidu trends available.</div>
      );
    }

    return (
      <div className="card-grid">
        {hotNews.map((article) => {
          return this.makeNewsDiv(article);
        })}
      </div>
    );
  }
}

export default trendingBaidu;
