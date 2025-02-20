import React, { Component } from "react";
import API from "../helpers/API";

class trendingBilibili extends Component {
  state = {
    trends: [],
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.api = new API();
  }

  makeTrendDiv(trend) {
    return (
      <div>
        <h2>
          <a href={trend.short_link}>{trend.title}</a>
        </h2>
        {/*<img src={`https://${trend.pic.replace("http://", "").replace("https://", "")}`}/>*/}
        {/*<p>{new Date(trend.pubdate).toDateString()}</p>*/}
      </div>
    );
  }

  async componentDidMount() {
    try {
      const { error, data: trends } = await this.api.getTrendingOnBilibili();
      if (!error) {
        this.setState({ trends: trends });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        {this.state.trends.map((trend) => {
          return this.makeTrendDiv(trend);
        })}
      </div>
    );
  }
}

export default trendingBilibili;
