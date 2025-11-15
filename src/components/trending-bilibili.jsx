import React, { Component } from "react";
import API from "../helpers/API";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

class trendingBilibili extends Component {
  state = {
    trends: [],
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
      const { error, data: trends } = await this.api.getTrendingOnBilibili();
      if (this._isMounted) {
        this.setState({
          trends: error ? [] : trends,
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

  normalizeLink(link) {
    if (!link || typeof link !== "string") {
      return null;
    }
    const trimmed = link.trim();
    if (!trimmed) {
      return null;
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    if (trimmed.startsWith("//")) {
      return `https:${trimmed}`;
    }
    if (trimmed.startsWith("/")) {
      return `https://www.bilibili.com${trimmed}`;
    }
    if (trimmed.startsWith("www.")) {
      return `https://${trimmed}`;
    }
    if (/^(b23\.|bili)/i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return `https://${trimmed}`;
  }

  getTrendLink(trend) {
    const candidates = [
      trend.short_link_v2,
      trend.short_link,
      trend.link,
      trend.url,
      trend.uri,
    ];

    for (const candidate of candidates) {
      const normalized = this.normalizeLink(candidate);
      if (normalized) {
        return normalized;
      }
    }

    if (trend.bvid) {
      return `https://www.bilibili.com/video/${trend.bvid}`;
    }

    if (trend.aid) {
      return `https://www.bilibili.com/video/av${trend.aid}`;
    }

    return null;
  }

  formatCount(value) {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number") {
      return value > 0 ? compactNumber.format(value) : null;
    }

    if (typeof value === "string") {
      const raw = value.trim();
      if (!raw) {
        return null;
      }
      let multiplier = 1;
      if (raw.includes("亿")) {
        multiplier = 100000000;
      } else if (raw.includes("万")) {
        multiplier = 10000;
      }
      const numericPortion = parseFloat(raw.replace(/[^\d.]/g, ""));
      if (Number.isNaN(numericPortion)) {
        return raw;
      }
      return compactNumber.format(numericPortion * multiplier);
    }

    return null;
  }

  renderStats(stats) {
    const mappedStats = stats
      .filter((item) => item.value)
      .map((item) => ({ ...item, key: item.label }));

    if (!mappedStats.length) {
      return null;
    }

    return (
      <div className="card-stats">
        {mappedStats.map((stat) => (
          <div className="card-stat" key={stat.key}>
            <span className="card-stat-label">{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    );
  }

  makeTrendDiv(trend) {
    const cleanedImg =
      trend.pic &&
      `https://${trend.pic.replace("http://", "").replace("https://", "")}`;

    const trendLink = this.getTrendLink(trend);
    const creator = trend.owner?.name || trend.author || trend.author_name;
    const descriptor =
      trend.desc || trend.rcmd_reason || trend.owner?.title || trend.tname;

    const viewLabel = this.formatCount(trend.stat?.view ?? trend.play);
    const likeLabel = this.formatCount(trend.stat?.like ?? trend.like);
    const danmakuLabel = this.formatCount(trend.stat?.danmaku ?? trend.danmaku);

    const statsConfig = [
      { label: "Plays", value: viewLabel },
      { label: "Likes", value: likeLabel },
      { label: "Danmaku", value: danmakuLabel },
    ];

    return (
      <article className="card" key={trendLink || trend.title}>
        <div className="card-meta">
          <span className="badge">Bilibili</span>
          {viewLabel && <span>{viewLabel} plays</span>}
        </div>
        <h3 className="card-title">
          {trendLink ? (
            <a href={trendLink} target="_blank" rel="noreferrer">
              {trend.title}
            </a>
          ) : (
            trend.title
          )}
        </h3>
        {creator && (
          <p className="card-subtitle">
            <span className="chip chip--outline">{creator}</span>
            {trend.area && <span className="chip">{trend.area}</span>}
          </p>
        )}
        {descriptor && <p className="card-body">{descriptor}</p>}
        {cleanedImg && (
          <div className="card-media">
            <img
              src={cleanedImg}
              alt={trend.title}
              loading="lazy"
              onError={(evt) => {
                evt.target.style.display = "none";
              }}
            />
          </div>
        )}
        {this.renderStats(statsConfig)}
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
