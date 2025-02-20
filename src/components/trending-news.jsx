import React, { Component } from "react";
import API from "../helpers/API";

class trendingNews extends Component {
  state = {
    articles: [],
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
      if (!error) {
        this.setState({ articles: articles });
      }
    } catch (e) {
      alert(e);
    }
  }

  makeArticleDiv(article) {
    let img = "";
    if (article.urlToImage != null) {
      img = (
        <img
          src={`https://${article.urlToImage.replace("http://", "").replace("https://", "")}`}
        />
      );
    }
    return (
      <div>
        <h2>
          <a href={article.url}>{article.title}</a>
        </h2>
        <p>{article.description}</p>
        {img}
        <p>{new Date(article.publishedAt).toDateString()}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.articles.map((article) => {
          return this.makeArticleDiv(article);
        })}
      </div>
    );
  }
}

export default trendingNews;
