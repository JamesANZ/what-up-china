# what-up-china

Live cultural radar for mainland China: one place to skim Baidu surges, Toutiao briefs, Douban chatter, Bilibili buzz, curated global headlines, and a sentiment pulse powered by keyword analysis.

---

## Why

People outside China see the internet there through filters: language barriers, slow discovery flows, and editorial bias. The project trims the friction by:

- **Aggregating** multiple public leaderboards (Baidu, Toutiao, Douban, Bilibili, etc.) on a single dashboard.
- **Normalizing** snippets, imagery, and metadata into a consistent card layout that is machine-translatable.
- **Surfacing sentiment** from English-language headline sets so you can monitor optimism vs concern at a glance.

---

## Features

| Section                 | Data source / behaviour                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| Baidu Search & Hot News | Crawls `top.baidu.com` and `news.baidu.com` for real-time surges.              |
| Toutiao Hot Board       | Mirrors ByteDance’s mobile news leaderboard.                                   |
| Douban Film Pulse       | Highlights most discussed cinema threads.                                      |
| Global Headlines        | Curated feeds across international and Mainland desks.                         |
| Bilibili Buzz           | Trending videos/creators from the Bilibili front page.                         |
| Sentiment Monitor       | Local sentiment analyzer (`natural` + AFINN) scoring recent English headlines. |

All sections share the same visual system: responsive cards, accessible typography, and copy that is short enough for auto-translation widgets (Google Translate is bootstrapped via `public/index.html`).

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

## Deployment notes

- The live site is hosted at [https://whatupchina.org](https://whatupchina.org) and references `%PUBLIC_URL%` for assets like the custom favicon.
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
