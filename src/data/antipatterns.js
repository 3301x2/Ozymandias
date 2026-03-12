export const ANTI_PATTERN_RULES = [
  // --- Original rules ---
  {
    id: "kafka_lean",
    severity: "high",
    title: "Kafka on a lean budget",
    description: "Kafka requires significant ops investment. Consider managed alternatives like Pub/Sub, Kinesis, or Confluent Cloud.",
    check: (answers, selections) =>
      answers.budget === "lean" &&
      (selections.ingestion || []).includes("kafka"),
  },
  {
    id: "elt_realtime",
    severity: "high",
    title: "ELT-only with real-time SLA",
    description: "ELT batch transforms can't meet real-time latency. Add a stream processing layer (Flink, Spark Streaming) or switch to Lambda/Kappa.",
    check: (answers, selections) =>
      (answers.latency === "rt" || answers.latency === "sub") &&
      (selections.paradigm || []).includes("elt") &&
      !(selections.paradigm || []).some((p) => ["streaming", "lambda", "kappa"].includes(p)),
  },
  {
    id: "debezium_no_kafka",
    severity: "high",
    title: "Debezium without Kafka",
    description: "Debezium CDC requires Kafka as its transport layer. Add Kafka or use a managed CDC alternative.",
    check: (_, selections) =>
      (selections.ingestion || []).includes("debezium") &&
      !(selections.ingestion || []).includes("kafka"),
  },
  {
    id: "dataform_no_gcp",
    severity: "high",
    title: "Dataform without GCP",
    description: "Dataform is a GCP-native service tied to BigQuery. It won't work on AWS or Azure.",
    check: (_, selections) =>
      (selections.transform || []).includes("dataform") &&
      !(selections.cloud || []).includes("gcp"),
  },
  {
    id: "montecarlo_lean",
    severity: "medium",
    title: "Monte Carlo on a lean budget",
    description: "Monte Carlo has enterprise pricing (R90K+/mo). Consider Soda, Great Expectations, or dbt tests for cost-effective quality.",
    check: (answers, selections) =>
      answers.budget === "lean" &&
      (selections.quality || []).includes("montecarlo"),
  },
  {
    id: "rls_hipaa",
    severity: "high",
    title: "Row-Level Security under HIPAA",
    description: "RLS bugs can leak PHI. HIPAA auditors often require stronger isolation (schema-per-tenant or dedicated). Add audit logging at minimum.",
    check: (answers, selections) =>
      answers.compliance === "hipaa" &&
      (selections.tenancy || []).includes("rls"),
  },
  {
    id: "multicloud_sql_team",
    severity: "medium",
    title: "Multi-cloud with SQL-only team",
    description: "Managing multiple clouds requires infrastructure-as-code skills. A SQL-heavy team may struggle with multi-cloud ops.",
    check: (answers, selections) =>
      answers.skills === "sql" &&
      (selections.cloud || []).length > 1,
  },
  {
    id: "bigquery_no_gcp",
    severity: "high",
    title: "BigQuery without GCP",
    description: "BigQuery is a GCP service. Select GCP as a cloud platform or choose a different warehouse.",
    check: (_, selections) =>
      (selections.warehouse || []).includes("bigquery") &&
      !(selections.cloud || []).includes("gcp"),
  },
  {
    id: "redshift_no_aws",
    severity: "high",
    title: "Redshift without AWS",
    description: "Redshift is an AWS service. Select AWS as a cloud platform or choose a different warehouse.",
    check: (_, selections) =>
      (selections.warehouse || []).includes("redshift") &&
      !(selections.cloud || []).includes("aws"),
  },
  {
    id: "synapse_no_azure",
    severity: "high",
    title: "Synapse without Azure",
    description: "Synapse Analytics is an Azure service. Select Azure as a cloud platform or choose a different warehouse.",
    check: (_, selections) =>
      (selections.warehouse || []).includes("synapse_dw") &&
      !(selections.cloud || []).includes("azure"),
  },
  {
    id: "no_quality",
    severity: "low",
    title: "No data quality layer",
    description: "Teams spend 30-40% of their time on data quality issues without automated checks. Add at least dbt tests or Soda.",
    check: (_, selections) =>
      (selections.quality || []).length === 0 &&
      Object.keys(selections).length > 5,
  },
  {
    id: "streaming_no_stream_engine",
    severity: "medium",
    title: "Stream paradigm without stream engine",
    description: "You selected stream processing but no streaming transform engine (Flink, Spark). Add one or reconsider your paradigm.",
    check: (_, selections) =>
      (selections.paradigm || []).some((p) => ["streaming", "kappa"].includes(p)) &&
      !(selections.transform || []).some((t) => ["flink", "databricks", "spark"].includes(t)),
  },

  // --- ThoughtWorks Playbook rules ---
  {
    id: "horizontal_slicing",
    severity: "high",
    title: "Horizontal slicing detected",
    description: "Building data lake -> warehouse -> dashboards sequentially delays user feedback. Slice vertically: deliver thin end-to-end pipelines that serve a single use case first.",
    check: (answers) =>
      answers.delivery === "manual",
  },
  {
    id: "no_observability",
    severity: "medium",
    title: "No pipeline observability",
    description: "Without correlation-ID tracing and proactive alerts, debugging distributed data pipelines becomes guesswork. Plan observability from day one.",
    check: (answers, selections) =>
      (selections.quality || []).length === 0 &&
      (selections.orchestration || []).length > 0,
  },
  {
    id: "pii_no_strategy",
    severity: "high",
    title: "PII data without a test data strategy",
    description: "Handling PII without a clear test data approach (fake, masked, synthetic) creates compliance risk. Simple masking alone doesn't prevent re-identification.",
    check: (answers) =>
      (answers.compliance === "pii" || answers.compliance === "hipaa" || answers.compliance === "gdpr") &&
      (!answers.pii_handling || answers.pii_handling === "no_pii"),
  },
  {
    id: "privacy_debt",
    severity: "medium",
    title: "Privacy debt risk",
    description: "Privacy debt accumulates faster than tech debt. If you handle PII, embed privacy engineering from the start \u2014 don't defer it.",
    check: (answers) =>
      (answers.compliance === "pii" || answers.compliance === "hipaa") &&
      answers.pii_handling === "fake",
  },
  {
    id: "no_data_catalog",
    severity: "low",
    title: "Consider a data catalog",
    description: "Without a catalog (owners, lineage, samples, quality levels), data products become undiscoverable. Metadata is the foundation of quality output.",
    check: (_, selections) =>
      Object.keys(selections).length > 6 &&
      !(selections.quality || []).some((q) => ["dataplex", "montecarlo"].includes(q)),
  },
  {
    id: "manual_deploy_at_scale",
    severity: "high",
    title: "Manual deploys at scale",
    description: "Manual deployments with >100GB/day data volume is unsustainable. Target: deploy frequency on-demand, lead time <20min, restore <1hr (DORA elite).",
    check: (answers) =>
      answers.delivery === "manual" &&
      (answers.volume === "lg" || answers.volume === "xl"),
  },
  {
    id: "no_quality_left_shift",
    severity: "medium",
    title: "Quality checks only at the end",
    description: "Shift quality left: add schema validation at ingestion, not just at the reporting layer. Use Write-Audit-Publish (WAP) pattern to catch issues before data is served.",
    check: (_, selections) =>
      (selections.quality || []).length > 0 &&
      !(selections.quality || []).includes("dbt_tests") &&
      (selections.ingestion || []).length > 0,
  },
];

export function detectAntiPatterns(answers, selections) {
  return ANTI_PATTERN_RULES.filter((rule) => rule.check(answers, selections));
}
