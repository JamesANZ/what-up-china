import React, { Component } from "react";
import "../App.css";
import TrendingNews from "./trending-news";
import TrendingBilibili from "./trending-bilibili";
import TrendingBaidu from "./trending-baidu";
import Sentiment from "./sentiment";

class body extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={"results"}>
        <h2>
          <a id={"trendingBaidu"} />
          Hot News Baidu
        </h2>
        <TrendingBaidu />
        <br />
        <br />
        <h2>
          <a id={"trendingNews"} />
          Trending News
        </h2>
        <TrendingNews />
        <br />
        <br />
        <h2>
          <a id={"trendingBilibili"} />
          Trending on Bilibili
        </h2>
        <TrendingBilibili />
        <Sentiment />
      </div>
    );
  }
}

export default body;
