import { useMemo, useState } from "react";
import { Logos } from "./Logos";
import { OPTIONS, CATEGORIES } from "../data/options";
import { getPreflightSummary } from "../data/scoring";
import { detectAntiPatterns } from "../data/antipatterns";
import { T } from "../theme.js";

const SEVERITY_STYLES = {
  high:   { icon: "\u{1F6A8}", bg: "rgba(239,68,68,0.18)",  border: "rgba(239,68,68,0.35)",  text: "#fca5a5", label: "HIGH" },
  medium: { icon: "\u26A0\uFE0F", bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.35)", text: "#fcd34d", label: "MED" },
  low:    { icon: "\u{1F4A1}", bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.30)",  text: "#93c5fd", label: "TIP" },
};

const DATA_PRODUCT_QUALITIES = [
  { id: "discoverable", label: "Discoverable", desc: "Listed in a data catalog with owner, lineage, and samples", icon: "\u{1F50D}" },
  { id: "addressable", label: "Addressable", desc: "Single unique address / endpoint for consumers", icon: "\u{1F3E0}" },
  { id: "self_describing", label: "Self-describing", desc: "Metadata enables self-service without tribal knowledge", icon: "\u{1F4D6}" },
  { id: "trustworthy", label: "Trustworthy", desc: "SLOs/SLIs defined for freshness, accuracy, availability", icon: "\u{1F91D}" },
  { id: "secure", label: "Secure & Governed", desc: "Federated access control, not accessible by default", icon: "\u{1F512}" },
];

function getSelectedOptions(selections) {
  const result = {};
  for (const cat of CATEGORIES) {
    const picked = selections[cat.key] || [];
    const opts = OPTIONS[cat.key] || [];
    result[cat.key] = picked.map((id) => opts.find((o) => o.id === id)).filter(Boolean);
  }
  return result;
}

function computeAggregates(selections) {
  let totalCost = 0;
  let totalComplexity = 0;
  let count = 0;

  for (const cat of CATEGORIES) {
    const picked = selections[cat.key] || [];
    const opts = OPTIONS[cat.key] || [];
    for (const id of picked) {
      const opt = opts.find((o) => o.id === id);
      if (opt) {
        totalCost += opt.cost;
        totalComplexity += opt.complexity;
        count++;
      }
    }
  }

  return {
    cost: count > 0 ? Math.round(totalCost / count * 20) : 0,
    complexity: count > 0 ? Math.round(totalComplexity / count * 20) : 0,
    toolCount: count,
  };
}

function getPlaybookRecs(answers) {
  const recs = [];

  if (answers.delivery === "manual" || answers.delivery === "ci") {
    recs.push({ icon: "\u{1F680}", title: "CI/CD for Data Pipelines", desc: "Target DORA elite: deploy on-demand, lead time <20min, restore <1hr, failure rate <15%." });
  }
  if (answers.compliance === "pii" || answers.compliance === "hipaa" || answers.compliance === "gdpr") {
    recs.push({ icon: "\u{1F6E1}\uFE0F", title: "Data Minimization", desc: "Collect only what you need. A recommendation system works with age brackets \u2014 no birthdate required." });
  }
  if (answers.pii_handling === "masked") {
    recs.push({ icon: "\u{1F50F}", title: "Re-identification Risk", desc: "Simple masking doesn't prevent re-identification. Consider differential privacy or encrypted computation." });
  }

  recs.push({ icon: "\u{1F4DD}", title: "Write-Audit-Publish (WAP)", desc: "Write data, audit quality, then publish. Catch issues before consumers see them." });
  recs.push({ icon: "\u{1F4DC}", title: "Data Contracts", desc: "Producers & consumers agree on: quality thresholds, SLAs, error tolerance, ownership of broken checks." });
  recs.push({ icon: "\u{1F9EA}", title: "Test Grid", desc: "Cover both dimensions: code tests (unit/service/E2E) and data tests (point/sample/global)." });

  return recs;
}

function generateMarkdown(projectName, answers, selections) {
  const selected = getSelectedOptions(selections);
  const preflight = getPreflightSummary(answers);
  const antiPatterns = detectAntiPatterns(answers, selections);
  const agg = computeAggregates(selections);

  let md = `# ${projectName} - Data Stack Architecture\n\n`;
  md += `## Preflight Configuration\n\n`;
  md += `| Dimension | Selection |\n|---|---|\n`;
  for (const p of preflight) {
    md += `| ${p.icon} ${p.title} | ${p.value} |\n`;
  }

  md += `\n## Stack Summary\n\n`;
  md += `- **Tools:** ${agg.toolCount}\n`;
  md += `- **Avg Cost:** ${agg.cost}%\n`;
  md += `- **Avg Complexity:** ${agg.complexity}%\n\n`;

  for (const cat of CATEGORIES) {
    const opts = selected[cat.key];
    if (opts && opts.length > 0) {
      md += `### ${cat.icon} ${cat.title}\n\n`;
      for (const opt of opts) {
        md += `- **${opt.label}** \u2014 ${opt.pro}\n`;
      }
      md += `\n`;
    }
  }

  if (antiPatterns.length > 0) {
    md += `## Warnings\n\n`;
    for (const ap of antiPatterns) {
      const sev = ap.severity.toUpperCase();
      md += `- **[${sev}] ${ap.title}:** ${ap.description}\n`;
    }
  }

  md += `\n## Data Product Quality Checklist\n\n`;
  for (const q of DATA_PRODUCT_QUALITIES) {
    md += `- [ ] **${q.label}** \u2014 ${q.desc}\n`;
  }

  md += `\n## Recommended Practices\n\n`;
  const recs = getPlaybookRecs(answers);
  for (const r of recs) {
    md += `- **${r.title}:** ${r.desc}\n`;
  }

  md += `\n---\n*Generated by Ozymandias Data Stack Advisor*\n`;
  return md;
}

export function Blueprint({ projectName, answers, selections }) {
  const selected = useMemo(() => getSelectedOptions(selections), [selections]);
  const preflight = useMemo(() => getPreflightSummary(answers), [answers]);
  const antiPatterns = useMemo(() => detectAntiPatterns(answers, selections), [answers, selections]);
  const aggregates = useMemo(() => computeAggregates(selections), [selections]);
  const recs = useMemo(() => getPlaybookRecs(answers), [answers]);
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const md = generateMarkdown(projectName, answers, selections);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth:1024, margin:"0 auto", paddingBottom:80 }}>

      {/* Title row */}
      <div style={{ display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:20 }}>
        <div>
          <div style={{ fontSize:11, color:T.textLabel, letterSpacing:"0.12em",
            textTransform:"uppercase", fontWeight:600, marginBottom:6 }}>
            Architecture Blueprint
          </div>
          <h1 style={{ fontSize:32, fontWeight:800, margin:"0 0 10px",
            letterSpacing:"-0.6px", color:"#fff" }}>{projectName}</h1>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {preflight.map(p => (
              <span key={p.title} style={{ fontSize:12, padding:"3px 10px",
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:999, color:T.textSecondary, fontWeight:500 }}>
                {p.icon} {p.value}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          {[
            { label:"Avg Cost",   value:`${aggregates.cost}%`,      color:T.colorCost },
            { label:"Complexity", value:`${aggregates.complexity}%`, color:T.colorComplexity },
            { label:"Tools",      value:aggregates.toolCount,        color:T.accentLight },
          ].map(s => (
            <div key={s.label} style={{ background:T.cardBg, border:`1px solid ${T.cardBorder}`,
              borderRadius:12, padding:"12px 16px", textAlign:"center",
              backdropFilter:"blur(20px)" }}>
              <div style={{ fontSize:20, fontWeight:800, color:s.color,
                letterSpacing:"-0.3px" }}>{s.value}</div>
              <div style={{ fontSize:11, color:T.textMuted, fontWeight:500,
                marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Data Architecture */}
      <SectionLabel label="Data Architecture" />

      {/* Orchestration band */}
      <div style={{ display:"flex", alignItems:"center", gap:12,
        background:"rgba(167,139,250,0.07)",
        border:"1px solid rgba(167,139,250,0.20)",
        borderRadius:12, padding:"10px 18px", marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase",
          letterSpacing:"0.12em", color:"#c4b5fd", minWidth:110 }}>
          {"\u{1F3AF}"} Orchestration
        </span>
        <div style={{ width:1, height:28, background:"rgba(167,139,250,0.25)" }}/>
        {(selected.orchestration || []).map(opt => <ToolPill key={opt.id} opt={opt} />)}
        {(selected.orchestration || []).length === 0 && (
          <span style={{ fontSize:11, color:"rgba(167,139,250,0.4)" }}>None selected</span>
        )}
        <div style={{ flex:1, height:1, background:"rgba(167,139,250,0.12)", marginLeft:8 }}/>
        <span style={{ fontSize:11, color:"rgba(167,139,250,0.45)", fontStyle:"italic" }}>
          Schedules &amp; monitors all layers below
        </span>
      </div>

      {/* Pipeline row */}
      <div style={{ display:"flex", alignItems:"stretch", gap:0, overflowX:"auto" }}>
        <PipelineLane items={selected.sources || []}   label="Sources"   color="rgba(34,211,238,0.04)" borderColor="rgba(34,211,238,0.20)" />
        <PipelineArrow label="CDC / Pull" color="rgba(34,211,238,0.5)" />
        <PipelineLane items={selected.ingestion || []} label="Ingestion" color="rgba(34,211,238,0.05)" borderColor="rgba(34,211,238,0.22)" />
        <PipelineArrow label="Raw load"   color="rgba(167,139,250,0.5)" />
        <PipelineLane items={selected.storage || []}   label="Storage"   color="rgba(167,139,250,0.05)" borderColor="rgba(167,139,250,0.22)" />
        <PipelineArrow label="ELT"        color="rgba(167,139,250,0.5)" />
        <PipelineLane items={selected.transform || []} label="Transform" color="rgba(167,139,250,0.06)" borderColor="rgba(167,139,250,0.25)" />
        <PipelineArrow label="Curated"    color="rgba(34,211,238,0.5)" />
        <PipelineLane items={selected.warehouse || []} label="Warehouse" color="rgba(34,211,238,0.07)" borderColor="rgba(34,211,238,0.28)" />
        <PipelineArrow label="Query"      color="rgba(251,146,60,0.6)" />
        <PipelineLane items={selected.serving || []}   label="Serving"   color="rgba(251,146,60,0.05)" borderColor="rgba(251,146,60,0.25)" />
      </div>

      {/* Quality band */}
      <div style={{ display:"flex", alignItems:"center", gap:12,
        background:"rgba(52,211,153,0.05)",
        border:"1px solid rgba(52,211,153,0.20)",
        borderRadius:12, padding:"10px 18px", marginTop:10 }}>
        <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase",
          letterSpacing:"0.12em", color:"#34d399", minWidth:110 }}>
          {"\u2705"} Data Quality
        </span>
        <div style={{ width:1, height:28, background:"rgba(52,211,153,0.25)" }}/>
        {(selected.quality || []).map(opt => <ToolPill key={opt.id} opt={opt} />)}
        {(selected.quality || []).length === 0 && (
          <span style={{ fontSize:11, color:"rgba(52,211,153,0.4)" }}>None selected</span>
        )}
        <div style={{ flex:1, height:1, background:"rgba(52,211,153,0.12)", marginLeft:8 }}/>
        <span style={{ fontSize:11, color:"rgba(52,211,153,0.45)", fontStyle:"italic" }}>
          Validates every layer above
        </span>
      </div>

      {/* Cloud + Tenancy footer */}
      <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200, display:"flex", alignItems:"center", gap:10,
          background:"rgba(248,250,252,0.03)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:10, padding:"8px 14px" }}>
          {(selected.cloud || []).length > 0
            ? (selected.cloud || []).map(opt => {
                const Logo = Logos[opt.logo];
                return (
                  <div key={opt.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {Logo && <div style={{ width:38, height:Math.round(38*40/56), borderRadius:6, overflow:"hidden" }}><Logo /></div>}
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:T.textPrimary }}>{opt.label}</div>
                      <div style={{ fontSize:11, color:T.textMuted }}>Cloud platform</div>
                    </div>
                  </div>
                );
              })
            : <span style={{ fontSize:11, color:T.textMuted }}>No cloud selected</span>
          }
        </div>
        <div style={{ flex:1, minWidth:200, display:"flex", alignItems:"center", gap:10,
          background:"rgba(245,158,11,0.05)",
          border:"1px solid rgba(245,158,11,0.18)",
          borderRadius:10, padding:"8px 14px" }}>
          {(selected.tenancy || []).length > 0
            ? (selected.tenancy || []).map(opt => {
                const Logo = Logos[opt.logo];
                return (
                  <div key={opt.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {Logo && <div style={{ width:38, height:Math.round(38*40/56), borderRadius:6, overflow:"hidden" }}><Logo /></div>}
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:T.textPrimary }}>{opt.label}</div>
                      <div style={{ fontSize:11, color:T.textMuted }}>Tenancy model</div>
                    </div>
                  </div>
                );
              })
            : <span style={{ fontSize:11, color:T.textMuted }}>No tenancy selected</span>
          }
        </div>
      </div>

      {/* Warnings + Recommendations 2-col grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:32 }}>
        {/* Warnings */}
        <div>
          <SectionLabel label={`Warnings (${antiPatterns.length})`} />
          {antiPatterns.length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {antiPatterns.map((ap) => {
                const sev = SEVERITY_STYLES[ap.severity];
                return (
                  <div key={ap.id} style={{ background:sev.bg, border:`1px solid ${sev.border}`,
                    borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:"1px 6px",
                        borderRadius:4, background:"rgba(0,0,0,0.25)", color:sev.text }}>
                        {sev.label}
                      </span>
                      <span style={{ fontSize:13, fontWeight:700, color:sev.text }}>{ap.title}</span>
                    </div>
                    <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.55, margin:0 }}>{ap.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize:13, color:T.textMuted, padding:16,
              background:T.cardBg, borderRadius:10, border:`1px solid ${T.cardBorder}` }}>
              No warnings detected
            </div>
          )}
        </div>

        {/* Recommended Practices */}
        <div>
          <SectionLabel label="Recommended Practices" />
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {recs.map((r, i) => (
              <div key={i} style={{ background:T.accentBg,
                border:"1px solid rgba(34,211,238,0.15)",
                borderRadius:10, padding:"10px 12px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.accentLight,
                      marginBottom:2 }}>{r.title}</div>
                    <p style={{ fontSize:12, color:T.textMuted, lineHeight:1.55, margin:0 }}>{r.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Product Quality Checklist */}
      <div style={{ marginTop:32 }}>
        <SectionLabel label="Data Product Qualities" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
          {DATA_PRODUCT_QUALITIES.map((q) => (
            <div key={q.id} style={{ background:T.cardBg, border:`1px solid ${T.cardBorder}`,
              borderRadius:10, padding:"10px 12px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <span style={{ fontSize:14 }}>{q.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:T.textPrimary }}>{q.label}</span>
              </div>
              <p style={{ fontSize:11, color:T.textMuted, lineHeight:1.5, margin:0 }}>{q.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div style={{ marginTop:32, textAlign:"center" }}>
        <button
          onClick={handleCopyMarkdown}
          style={copied
            ? { padding:"10px 28px", borderRadius:12, fontSize:14, fontWeight:600,
                cursor:"pointer", transition:"all 0.18s",
                background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.4)",
                color:"#34d399" }
            : { padding:"10px 28px", borderRadius:12, fontSize:14, fontWeight:600,
                cursor:"pointer", transition:"all 0.18s",
                background:T.cardBg, border:`1px solid ${T.cardBorder}`,
                color:T.textSecondary }}
        >
          {copied ? "\u2713 Copied!" : "Copy to Markdown"}
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{ fontSize:11, color:T.textMuted, textTransform:"uppercase",
      letterSpacing:"0.1em", fontWeight:700, marginBottom:14 }}>
      {label}
    </div>
  );
}

function ToolPill({ opt }) {
  const Logo = Logos[opt.logo];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6,
      background:"rgba(0,0,0,0.2)", borderRadius:8,
      padding:"4px 10px 4px 5px" }}>
      {Logo && (
        <div style={{ width:34, height:Math.round(34*40/56),
          borderRadius:5, overflow:"hidden" }}>
          <Logo />
        </div>
      )}
      <span style={{ fontSize:12, color:T.textSecondary, fontWeight:500 }}>
        {opt.label}
      </span>
    </div>
  );
}

function PipelineLane({ items, label, color, borderColor }) {
  return (
    <div style={{ display:"flex", flexDirection:"column",
      background:color, border:`1px solid ${borderColor}`,
      borderRadius:14, minHeight:120, flex:1 }}>
      {/* Top label */}
      <div style={{ fontSize:9, fontWeight:700,
        textTransform:"uppercase", letterSpacing:"0.12em", color:borderColor,
        padding:"8px 10px", textAlign:"center",
        borderBottom:`1px solid ${borderColor}`, opacity:0.85 }}>
        {label}
      </div>
      {/* Tool nodes — centered */}
      <div style={{ padding:"14px 10px", display:"flex",
        flexDirection:"column", gap:10, alignItems:"center",
        justifyContent:"center", flex:1 }}>
        {items.map(opt => {
          const Logo = Logos[opt.logo];
          return (
            <div key={opt.id} style={{ display:"flex", flexDirection:"column",
              alignItems:"center", gap:5 }}>
              {Logo && (
                <div style={{ width:52, height:Math.round(52*40/56),
                  borderRadius:8, overflow:"hidden",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}>
                  <Logo />
                </div>
              )}
              <span style={{ fontSize:10, color:T.textMuted, textAlign:"center",
                fontWeight:500, lineHeight:1.2, maxWidth:70 }}>
                {opt.label}
              </span>
            </div>
          );
        })}
        {items.length === 0 && (
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.15)" }}>{"\u2014"}</span>
        )}
      </div>
    </div>
  );
}

function PipelineArrow({ label, color }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", flexShrink:0, padding:"0 2px" }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        <div style={{ width:24, height:1.5, background:color }} />
        <div style={{ width:0, height:0,
          borderTop:"5px solid transparent",
          borderBottom:"5px solid transparent",
          borderLeft:`7px solid ${color}` }} />
      </div>
      {label && (
        <div style={{ fontSize:8, color:T.textMuted, marginTop:4,
          fontWeight:500, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>
          {label}
        </div>
      )}
    </div>
  );
}
