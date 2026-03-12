export const PREFLIGHT_QUESTIONS = [
  {
    id: "volume", icon: "\u{1F4E6}", title: "Data Volume",
    hint: "How much data flows through your pipelines daily?",
    options: [
      { id: "xs", label: "< 1 GB / day", sub: "Scripts, small teams", score: 1 },
      { id: "sm", label: "1 - 100 GB / day", sub: "Growing startup", score: 2 },
      { id: "lg", label: "100 GB - 1 TB / day", sub: "Mid-size platform", score: 3 },
      { id: "xl", label: "> 1 TB / day", sub: "Large-scale platform", score: 4 },
    ],
  },
  {
    id: "latency", icon: "\u26A1", title: "Latency Requirement",
    hint: "How fresh does the data need to be for your consumers?",
    options: [
      { id: "batch", label: "Batch (hours)", sub: "Nightly / scheduled jobs", score: 1 },
      { id: "near", label: "Near-real-time (mins)", sub: "Micro-batch pipelines", score: 2 },
      { id: "rt", label: "Real-time (seconds)", sub: "Streaming analytics", score: 3 },
      { id: "sub", label: "Sub-second", sub: "Operational / ML serving", score: 4 },
    ],
  },
  {
    id: "skills", icon: "\u{1F9E0}", title: "Team Profile",
    hint: "What does your data team look like today?",
    options: [
      { id: "sql", label: "SQL-heavy", sub: "Analysts, BI engineers", score: 1 },
      { id: "python", label: "Python / Code-heavy", sub: "Software DE team", score: 2 },
      { id: "mixed", label: "Mixed DE + Analytics", sub: "Full-stack data team", score: 3 },
      { id: "large", label: "Large Platform Team", sub: "Dedicated data platform", score: 4 },
    ],
  },
  {
    id: "budget", icon: "\u{1F4B0}", title: "Budget",
    hint: "Monthly infrastructure + tooling spend.",
    options: [
      { id: "lean", label: "Lean (< R90K/mo)", sub: "Startup / MVP", score: 1 },
      { id: "growth", label: "Growth (R90K\u2013R900K/mo)", sub: "Scaling team", score: 2 },
      { id: "scale", label: "Enterprise Scale", sub: "Cost is secondary", score: 3 },
    ],
  },
  {
    id: "compliance", icon: "\u{1F512}", title: "Compliance",
    hint: "What regulatory constraints apply to your data?",
    options: [
      { id: "none", label: "Internal Only", sub: "No external data regs", score: 1 },
      { id: "gdpr", label: "GDPR", sub: "EU data residency", score: 2 },
      { id: "pii", label: "PII Sensitive", sub: "Masked / tokenized data", score: 3 },
      { id: "hipaa", label: "HIPAA / SOC2", sub: "Audit trails required", score: 4 },
    ],
  },
  {
    id: "strategy", icon: "\u{1F3D7}\uFE0F", title: "Architecture Strategy",
    hint: "How much vendor lock-in are you comfortable with?",
    options: [
      { id: "native", label: "Cloud-Native", sub: "Lock into AWS/GCP/Azure", score: 1 },
      { id: "saas", label: "Best-of-Breed SaaS", sub: "Snowflake, dbt, Fivetran", score: 2 },
      { id: "hybrid", label: "Hybrid", sub: "Mix of native + SaaS", score: 3 },
    ],
  },
  {
    id: "pii_handling", icon: "\u{1F6E1}\uFE0F", title: "PII & Test Data",
    hint: "How will you handle sensitive data in non-production?",
    options: [
      { id: "no_pii", label: "No PII involved", sub: "Internal / non-sensitive data only", score: 1 },
      { id: "fake", label: "Fake / Mock data", sub: "Generated data matching prod schema", score: 2 },
      { id: "masked", label: "Masked production data", sub: "Anonymized subset of real data", score: 3 },
      { id: "synthetic", label: "Synthetic + differential privacy", sub: "Model-generated, statistically similar", score: 4 },
    ],
  },
  {
    id: "delivery", icon: "\u{1F680}", title: "Delivery Maturity",
    hint: "How mature are your data engineering practices?",
    options: [
      { id: "manual", label: "Manual deploys", sub: "Scripts, SSH, ad-hoc", score: 1 },
      { id: "ci", label: "CI but manual deploy", sub: "Tests run, deploy is manual", score: 2 },
      { id: "cicd", label: "Full CI/CD", sub: "Automated test + deploy pipeline", score: 3 },
      { id: "elite", label: "Elite (multiple deploys/day)", sub: "Trunk-based, feature toggles, IaC", score: 4 },
    ],
  },
];
