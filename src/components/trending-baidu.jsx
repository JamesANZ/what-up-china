import React, { Component } from "react";
import API from "../helpers/API";

class trendingBaidu extends Component {
  state = {
    hotNews: [],
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.api = new API();
  }

  makeNewsDiv(article) {
    return (
      <div>
        <h2>
          <a href={article.link}>{article.title}</a>
        </h2>
      </div>
    );
  }

  async componentDidMount() {
    try {
      const { error, data: hotNews } = await this.api.getBaiduHotNews();
      if (!error) {
        this.setState({ hotNews });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        <h3>{this.state.sentiment}</h3>
        {this.state.hotNews.map((article) => {
          return this.makeNewsDiv(article);
        })}
      </div>
    );
  }
}

export default trendingBaidu;
