import React, { useEffect, useMemo, useState } from "react";
import API from "../helpers/API";

const POSITIVE_THRESHOLD = 0.35;
const NEGATIVE_THRESHOLD = -0.15;
const COLOR_MAP = {
  positive: "#0ba37f",
  neutral: "#f5a623",
  negative: "#d64550",
};

function clampScore(score) {
  if (score == null || Number.isNaN(score)) {
    return null;
  }
  return Math.max(-1, Math.min(1, score));
}

function describeTone(score) {
  if (score == null) {
    return {
      label: "No signal",
      tone: "neutral",
      helper: "Not enough English headlines",
    };
  }
  if (score > POSITIVE_THRESHOLD) {
    return {
      label: "Upbeat",
      tone: "positive",
      helper: "Optimism outweighs concern",
    };
  }
  if (score < NEGATIVE_THRESHOLD) {
    return {
      label: "Concerned",
      tone: "negative",
      helper: "Risk language dominates",
    };
  }
  return { label: "Mixed", tone: "neutral", helper: "Balanced tone" };
}

function formatScore(score) {
  if (score == null) {
    return "--";
  }
  return (score >= 0 ? "+" : "") + score.toFixed(2);
}

function buildTextFromArticle(article) {
  if (!article) {
    return "";
  }
  const pieces = [article.title, article.description, article.summary]
    .filter(Boolean)
    .map((piece) => piece.trim());
  return pieces.join(". ");
}

function hasEnoughAscii(text) {
  if (!text) {
    return false;
  }
  const asciiChars = text.replace(/[^a-zA-Z]/g, "").length;
  return asciiChars / text.length >= 0.2;
}

function Sentiment() {
  const api = useMemo(() => new API(), []);
  const [state, setState] = useState({
    status: "loading",
    stories: [],
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const { error, data } = await api.getTopNews();
        if (!mounted) return;
        if (error || !Array.isArray(data)) {
          setState({
            status: "error",
            stories: [],
            error: "Unable to load sentiment feed.",
          });
          return;
        }

        const trimmed = data.slice(0, 30);
        const scored = trimmed.map((article) => {
          const text = buildTextFromArticle(article);
          if (!hasEnoughAscii(text)) {
            return { article, score: null };
          }
          const score = clampScore(api.getTextSentiment(text, "English"));
          return { article, score };
        });

        setState({ status: "ready", stories: scored, error: null });
      } catch (err) {
        console.error(err);
        if (mounted) {
          setState({
            status: "error",
            stories: [],
            error: "Sentiment service temporarily offline.",
          });
        }
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, [api]);

  const analysis = useMemo(() => {
    const validStories = state.stories.filter(
      (entry) => typeof entry.score === "number",
    );
    if (!validStories.length) {
      return {
        overallScore: null,
        tone: describeTone(null),
        totals: { positive: 0, neutral: 0, negative: 0 },
        highlights: { positive: [], negative: [], neutral: [] },
        sampleSize: 0,
      };
    }

    const overallScore = clampScore(
      validStories.reduce((sum, entry) => sum + entry.score, 0) /
        validStories.length,
    );

    const positives = validStories
      .filter((entry) => entry.score > POSITIVE_THRESHOLD)
      .sort((a, b) => b.score - a.score);
    const negatives = validStories
      .filter((entry) => entry.score < NEGATIVE_THRESHOLD)
      .sort((a, b) => a.score - b.score);
    const neutrals = validStories
      .filter(
        (entry) =>
          entry.score <= POSITIVE_THRESHOLD &&
          entry.score >= NEGATIVE_THRESHOLD,
      )
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

    return {
      overallScore,
      tone: describeTone(overallScore),
      totals: {
        positive: positives.length,
        neutral: neutrals.length,
        negative: negatives.length,
      },
      highlights: {
        positive: positives.slice(0, 3),
        negative: negatives.slice(0, 3),
        neutral: neutrals.slice(0, 3),
      },
      sampleSize: validStories.length,
    };
  }, [state.stories]);

  if (state.status === "loading") {
    return <div className="panel-placeholder">Scoring today's headlines…</div>;
  }

  if (state.status === "error") {
    return <div className="panel-placeholder">{state.error}</div>;
  }

  if (!analysis.sampleSize) {
    return (
      <div className="panel-placeholder">
        Waiting for more English-language stories to analyse.
      </div>
    );
  }

  const meterWidth =
    analysis.overallScore == null ? 0 : ((analysis.overallScore + 1) / 2) * 100;

  return (
    <div className="sentiment-panel">
      <article className="card sentiment-summary">
        <div className="card-meta">
          <span className="badge">Overall mood</span>
          <span>{analysis.sampleSize} headlines analysed</span>
        </div>
        <div
          className="sentiment-score"
          style={{ color: COLOR_MAP[analysis.tone.tone] }}
        >
          {formatScore(analysis.overallScore)}
        </div>
        <h3>{analysis.tone.label}</h3>
        <p className="card-body">{analysis.tone.helper}</p>
        <div
          className="sentiment-meter"
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: "999px",
            height: "0.35rem",
            overflow: "hidden",
          }}
        >
          <div
            className="sentiment-meter-fill"
            style={{
              width: `${meterWidth}%`,
              backgroundColor: COLOR_MAP[analysis.tone.tone],
            }}
          />
        </div>
        <dl
          className="sentiment-stats"
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <dt>Bullish</dt>
            <dd>{analysis.totals.positive}</dd>
          </div>
          <div>
            <dt>Mixed</dt>
            <dd>{analysis.totals.neutral}</dd>
          </div>
          <div>
            <dt>Concerned</dt>
            <dd>{analysis.totals.negative}</dd>
          </div>
        </dl>
      </article>

      <div className="card-grid sentiment-splits">
        {renderHighlightCard(
          "Bright spots",
          analysis.highlights.positive,
          "positive",
        )}
        {renderHighlightCard(
          "On watch",
          analysis.highlights.neutral,
          "neutral",
        )}
        {renderHighlightCard(
          "Pressure points",
          analysis.highlights.negative,
          "negative",
        )}
      </div>
    </div>
  );
}

function renderHighlightCard(title, stories, tone) {
  return (
    <article className="card" key={title}>
      <div className="card-meta">
        <span className="badge" style={{ backgroundColor: COLOR_MAP[tone] }}>
          {title}
        </span>
      </div>
      {stories.length ? (
        <ul
          className="sentiment-list"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {stories.map(({ article, score }) => {
            const key = article.url || article.link || article.title;
            return (
              <li key={key}>
                <span
                  className="badge"
                  style={{ backgroundColor: COLOR_MAP[tone] }}
                >
                  {formatScore(score)}
                </span>
                <a
                  href={article.url || article.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {article.title}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="card-body">No recent stories in this band.</p>
      )}
    </article>
  );
}

export default Sentiment;
