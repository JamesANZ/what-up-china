import React, { Component } from "react";
import API from "../helpers/API";

class trendingNews extends Component {
  state = {
    articles: [],
    isLoading: true,
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.api = new API();
  }

  async componentDidMount() {
    try {
      const { error, data: articles } = await this.api.getTopNews();
      console.error(error);
      this.setState({
        articles: error ? [] : articles,
        isLoading: false,
      });
    } catch (e) {
      this.setState({ isLoading: false });
      console.error(e);
    }
  }

  makeArticleDiv(article) {
    const cleanedImg =
      article.urlToImage &&
      `https://${article.urlToImage.replace("http://", "").replace("https://", "")}`;
    const publishedDate = article.publishedAt
      ? new Date(article.publishedAt).toDateString()
      : "";

    return (
      <article className="card" key={article.url || article.title}>
        <div className="card-meta">
          <span className="badge">{article.source?.name ?? "News"}</span>
          {publishedDate && <span>{publishedDate}</span>}
        </div>
        <h3 className="card-title">
          <a href={article.url} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
        {article.description && (
          <p className="card-body">{article.description}</p>
        )}
        {cleanedImg && (
          <div className="card-media">
            <img src={cleanedImg} alt={article.title} loading="lazy" />
          </div>
        )}
      </article>
    );
  }

  render() {
    const { articles, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="panel-placeholder">Loading the latest headlines…</div>
      );
    }

    if (!articles.length) {
      return (
        <div className="panel-placeholder">
          No trending headlines right now.
        </div>
      );
    }

    return (
      <div className="card-grid">
        {articles.map((article) => {
          return this.makeArticleDiv(article);
        })}
      </div>
    );
  }
}

export default trendingNews;
