# what-up-china

Live cultural radar for mainland China: one place to skim Baidu surges, Toutiao briefs, Douban chatter, Bilibili buzz, curated global headlines, and a sentiment pulse powered by keyword analysis. The interface ships with a custom Space Grotesk + Inter theme, glassmorphism cards, a bespoke SVG favicon, and a built-in Google‑Translate banner so the copy stays readable worldwide.

---

## Why

People outside China see the internet there through filters: language barriers, slow discovery flows, and editorial bias. The project trims the friction by:

- **Aggregating** multiple public leaderboards (Baidu, Toutiao, Douban, Bilibili, etc.) on a single dashboard.
- **Normalizing** snippets, imagery, and metadata into a consistent card layout that is machine-translatable.
- **Surfacing sentiment** from English-language headline sets so you can monitor optimism vs concern at a glance.

---

## Features

| Section                     | Data source / behaviour                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Baidu Search & Hot News** | Polls `top.baidu.com` and `news.baidu.com` on a schedule to surface real-time spike queries and editor-curated headlines.                                     |
| **Toutiao Hot Board**       | Mirrors ByteDance’s mobile news leaderboard and distills each entry down to title, source, and heat so you can scan the feed in seconds.                      |
| **Douban Film Pulse**       | Highlights the most talked-about films on Douban, complete with ratings and key quotes for quick cultural context.                                            |
| **Bilibili Buzz**           | Pulls the current “hot list” of creators and videos from Bilibili to capture what’s resonating with younger audiences.                                        |
| **Global Headlines**        | Reads from the `/top-news/` API to blend international coverage with mainland news into one cohesive feed of shareable cards.                                 |
| **Sentiment Monitor**       | Reuses the global headline feed, runs the English snippets through `natural`, `stopword`, `apos-to-lex-form`, and AFINN, and visualises optimism vs. concern. |

Every card uses the same responsive layout, accessible typography, and short copy so the Google‑Translate banner defined in `public/index.html` can translate the entire page on the fly.

---

## Live data & API contract

The React app talks to a companion backend (not included in this repo) that emits JSON arrays for each feed. The helper in `src/helpers/API.js` normalises common shapes so components always receive a simple array of items.

| Endpoint              | Used by                   | Example payload (abridged)                                           |
| --------------------- | ------------------------- | -------------------------------------------------------------------- |
| `/baidu/hot-news/`    | `TrendingBaidu`           | `{ "data": [{ "title": "…", "link": "…", "heat": 123 }] }`           |
| `/baidu/hot-search/`  | `TrendingBaidu`           | `{ "data": [{ "keyword": "…", "score": 98, "url": "…" }] }`          |
| `/toutiao/hot-board/` | `TrendingToutiao`         | `{ "data": [{ "title": "…", "source": "…", "hotValue": 100 }] }`     |
| `/douban/hot-movies/` | `TrendingDouban`          | `{ "data": [{ "name": "…", "rating": 8.6, "quote": "…" }] }`         |
| `/bilibili/trending/` | `TrendingBilibili`        | `{ "data": [{ "title": "…", "author": "…", "plays": 540000 }] }`     |
| `/top-news/`          | `TrendingNews`, Sentiment | `{ "articles": [{ "title": "…", "description": "…", "url": "…" }] }` |

> **Heads-up:** The Global Headlines section and the Sentiment Monitor both depend on `/top-news/`. If that endpoint is unreachable (for example, because `REACT_APP_API_ROOT` still points at `http://localhost:3000` in production) those panels will display empty-state messaging.

---

## Tech stack

- **React 17 / CRA 4** for the UI shell.
- **Superagent** for serverless HTTP fetching (proxied through a simple API layer).
- **Natural + stopword + apos-to-lex-form** for basic text normalization and sentiment scoring.
- **Space Grotesk + Inter** typography, custom gradients, and glassmorphism CSS for the presentation layer.

---

## Development

```bash
git clone https://github.com/James-Sangalli/what-up-china.git
cd what-up-china
npm install
npm start
```

The dev server runs at `http://localhost:3000`. Create React App handles hot reloading and proxying.

### Available scripts

| Script                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm start`            | Start local dev server with hot reload.   |
| `npm run build`        | Production build (outputs to `build/`).   |
| `npm test`             | CRA test runner (Jest + RTL scaffolding). |
| `npm run test-helpers` | Runs helper-layer mocha tests (if any).   |

> ⚠️ The `natural` package optionally looks for `webworker-threads`. CRA emits a warning during `npm run build`, but the bundle still works without that optional dependency.

---

## Configuration

| Variable             | Default      | Purpose                                                                                                                                                                                                                                 |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_API_ROOT` | `""` (empty) | Base URL for the backing API. Leave empty when the API is served from the same origin, set to `http://localhost:3000` for local proxies, or to your hosted backend (e.g. `https://api.whatupchina.org`) before running `npm run build`. |

If this variable is missing or incorrect, `/top-news/` will resolve to `http://localhost:3000/top-news/` in end users’ browsers and both the Global Headlines + Sentiment feeds will render “No data”.

Other assets worth customising:

- `public/favicon.svg` – the skyline/lantern icon used across the site.
- `public/index.html` – houses the Google‑Translate snippet and Hotjar tracking block.

---

## Deployment notes

- The live site is hosted at [https://whatupchina.org](https://whatupchina.org) and references `%PUBLIC_URL%` for assets such as the custom favicon.
- If you fork + redeploy, update the `homepage` field in `package.json` so CRA emits the right asset paths.

---

## Contributing

Issues and PRs are welcome! Ideas that help the dashboard stay fast, accessible, or add source diversity are especially appreciated. Before submitting:

1. Run `npm run build` to ensure the prod bundle succeeds.
2. Document any new environment variables or API endpoints.
3. Add screenshots/GIFs for visual changes if possible.

---

## License

MIT © [James Sangalli](https://github.com/James-Sangalli)
