import React from "react";
import "../App.css";
import TrendingNews from "./trending-news";
import TrendingBilibili from "./trending-bilibili";
import TrendingBaidu from "./trending-baidu";
import Sentiment from "./sentiment";

const quickLinks = [
  { href: "#trendingBaidu", label: "Baidu Pulse", id: "baiduNewsButton" },
  {
    href: "#trendingNews",
    label: "Global Headlines",
    id: "trendingNewsButton",
  },
  {
    href: "#trendingBilibili",
    label: "Bilibili Buzz",
    id: "trendingBilibiliButton",
  },
  { href: "#sentiment", label: "Mood Monitor" },
];

const Body = () => {
  return (
    <div className="page">
      <header className="hero">
        <span className="hero-watermark" aria-hidden="true">
          华夏热度
        </span>
        <div className="hero-ornaments" aria-hidden="true">
          <span className="lantern lantern--left">
            <span className="lantern-core" />
            <span className="lantern-tail" />
          </span>
          <span className="lantern lantern--right">
            <span className="lantern-core" />
            <span className="lantern-tail" />
          </span>
        </div>

        <div className="hero-top">
          <div>
            <p className="wordmark">What Up China</p>
            <p className="hero-tagline">Live cultural data board</p>
          </div>
          <a
            href="https://github.com/James-Sangalli/what-up-china"
            target="_blank"
            rel="noreferrer"
            className="github-link"
          >
            GitHub ↗
          </a>
        </div>

        <div className="hero-copy">
          <div className="hero-marquee">Live signal room</div>
          <p className="hero-characters">热点脉搏 · 实时追踪</p>
          <div className="hero-title-row">
            <h1>What&apos;s Trending Across China</h1>
            <div className="hero-stamp">
              <span>CHN</span>
              <small>实时</small>
            </div>
          </div>
          <p className="hero-summary">
            Search spikes, breaking headlines, video chatter, and sentiment
            shifts—captured in one responsive dashboard so you can stay ahead of
            the conversation.
          </p>
          <div className="hero-actions">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="ghost-button"
                id={link.id}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="sections-grid">
        <section id="trendingBaidu" className="section-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Search radar</p>
              <h2>Hot on Baidu</h2>
            </div>
            <a
              className="section-link"
              href="https://top.baidu.com/"
              target="_blank"
              rel="noreferrer"
            >
              View source →
            </a>
          </div>
          <p className="section-description">
            Real-time search surges from the world&apos;s largest Chinese search
            engine.
          </p>
          <TrendingBaidu />
        </section>

        <section id="trendingNews" className="section-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">News wire</p>
              <h2>Trending Headlines</h2>
            </div>
            <a className="section-link" href="#trendingNews">
              Updated hourly
            </a>
          </div>
          <p className="section-description">
            Curated headlines breaking through on international and Mainland
            desks.
          </p>
          <TrendingNews />
        </section>

        <section id="trendingBilibili" className="section-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Streaming chatter</p>
              <h2>Bilibili Buzz</h2>
            </div>
            <a
              className="section-link"
              href="https://www.bilibili.com/"
              target="_blank"
              rel="noreferrer"
            >
              Watch live →
            </a>
          </div>
          <p className="section-description">
            Videos and creators spiking in popularity across Bilibili&apos;s
            massive community.
          </p>
          <TrendingBilibili />
        </section>

        <section id="sentiment" className="section-card sentiment-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Pulse check</p>
              <h2>Sentiment Monitor</h2>
            </div>
          </div>
          <p className="section-description">
            Daily tone analysis across platforms to measure optimism vs. concern
            in the conversation.
          </p>
          <Sentiment />
        </section>
      </div>
    </div>
  );
};

export default Body;
