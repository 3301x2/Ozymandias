# Ozymandias

A data stack advisor for senior data engineers. Answer constraint questions, pick your tools across every pipeline layer, and get an architecture blueprint with anti-pattern warnings and best-practice recommendations.

## Features

- **Preflight questionnaire** — 8 constraint questions (volume, latency, team profile, budget, compliance, architecture strategy, PII handling, delivery maturity) that drive tool recommendations
- **11-step tool selection** — Cloud, Sources, Ingestion, Storage, Paradigm, Transform, Orchestration, Warehouse, Quality, Serving, Multi-Tenancy
- **Recommendation engine** — cards scored and sorted by fit (MATCH / OK / LOW FIT) based on your preflight answers, with budget penalties and cloud-awareness
- **40+ real product logos** — AWS, GCP, Azure, Snowflake, Databricks, Kafka, Airflow, dbt, Fivetran, Flink, and many more as inline SVGs
- **Anti-pattern detection** — 19 rules flag issues like Kafka on a lean budget, Debezium without Kafka, ELT with real-time SLA, horizontal slicing, privacy debt, manual deploys at scale
- **2D architecture blueprint** — orchestration as a cross-cutting top band, data flow in columns (sources to serving), quality and tenancy as bottom bands
- **ThoughtWorks playbook integration** — data product qualities checklist, WAP pattern, data contracts, DORA metrics, test grid recommendations
- **Copy to Markdown** — export the full architecture as a markdown document
- **Polished UI** — progress bars, staggered animations, big visual anchors, checkmark feedback, chunked information

## Tech Stack

- [Vite](https://vite.dev/) — build tool
- [React](https://react.dev/) — UI
- [Tailwind CSS v4](https://tailwindcss.com/) — styling

No backend. Everything runs client-side.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  App.jsx                — Main wizard state machine (splash -> preflight -> build -> blueprint)
  index.css              — Tailwind imports + animations
  components/
    SplashScreen.jsx     — Project name input
    PreflightWizard.jsx  — 8-step constraint questionnaire
    CategoryPicker.jsx   — Tool selection cards with fit scoring
    Blueprint.jsx        — 2D architecture diagram + warnings + recommendations
    Logos.jsx            — Inline SVG logos for all tools
  data/
    questions.js         — Preflight question definitions
    options.js           — Tool options (11 categories) + category config
    scoring.js           — Fit score computation, badges, sorting
    antipatterns.js      — Anti-pattern detection rules
```

## License

MIT
