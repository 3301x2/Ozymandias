import { useMemo } from "react";
import { Logos } from "./Logos";
import { CATEGORIES } from "../data/options";
import { computeFitScore, getFitBadge, sortByFit } from "../data/scoring";
import { T } from "../theme.js";

export function CategoryPicker({ category, options, selected, onToggle, answers, buildStep }) {
  const sorted = useMemo(() => sortByFit(options, answers), [options, answers]);
  const selectedCount = selected.length;
  const totalSteps = CATEGORIES.length;
  const progress = ((buildStep + 1) / totalSteps) * 100;

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }} key={category.key}>
      {/* Progress bar */}
      <div style={{ marginBottom:24 }}>
        <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:3,
          overflow:"hidden", position:"relative" }}>
          <div
            style={{ height:"100%", width:`${progress}%`,
              background:T.progressBg, borderRadius:3,
              boxShadow:`0 0 10px ${T.progressGlow}`,
              transition:"width 0.5s ease-out" }}
          />
          <div className="progress-shimmer" style={{ position:"absolute", inset:0, borderRadius:3 }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
          <span style={{ fontSize:12, color:T.textMuted }}>
            Step {buildStep + 1} of {totalSteps}
          </span>
          <span style={{ fontSize:12, color:T.accentLight, fontWeight:700 }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="animate-fade-in-up" style={{ textAlign:"center", marginBottom:32 }}>
        <span className="animate-pop-in" style={{ fontSize:52, display:"block", marginBottom:12,
          filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{category.icon}</span>
        <h2 style={{ fontSize:30, fontWeight:800, color:"#ffffff",
          letterSpacing:"-0.5px", margin:0 }}>{category.title}</h2>
        <p style={{ color:T.textSecondary, fontSize:15, marginTop:6 }}>
          {category.multi ? "Select all that apply" : "Choose one"}
        </p>

        {selectedCount > 0 && (
          <div className="animate-pop-in" style={{ display:"inline-flex", alignItems:"center",
            gap:6, marginTop:12, fontSize:13, fontWeight:600,
            background:T.accentBg, border:`1px solid ${T.cardSelectedBorder}`,
            borderRadius:999, padding:"4px 14px", color:T.accentLight }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:T.accentLight }} />
            {selectedCount} selected
          </div>
        )}
      </div>

      {/* Card grid */}
      <div className="stagger" style={{ display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
        {sorted.map((opt) => {
          const Logo = Logos[opt.logo];
          const isSelected = selected.includes(opt.id);
          const score = computeFitScore(opt, answers);
          const badge = getFitBadge(score);

          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              className="animate-fade-in-up"
              style={{
                textAlign:"left", padding:0, borderRadius:16, overflow:"hidden",
                border:`1px solid ${isSelected ? T.cardSelectedBorder : T.cardBorder}`,
                background: isSelected ? T.cardSelectedBg : T.cardBg,
                backdropFilter:"blur(24px)", cursor:"pointer", transition:"all 0.18s",
                boxShadow: isSelected
                  ? `0 0 0 1px ${T.cardSelectedBorder}, 0 8px 32px rgba(6,182,212,0.12)`
                  : "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {/* TOP: Logo strip */}
              <div style={{
                padding:"14px 14px 12px",
                borderBottom:`1px solid ${T.cardBorder}`,
                background:"rgba(0,0,0,0.28)",
                display:"flex", alignItems:"center", gap:12
              }}>
                {Logo && (
                  <div style={{ borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                    <div style={{ width:72, height:Math.round(72*40/56) }}><Logo /></div>
                  </div>
                )}
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:"#ffffff",
                    marginBottom:5, letterSpacing:"-0.2px" }}>{opt.label}</div>
                  <FitBadge badge={badge} />
                </div>
                {isSelected && (
                  <div className="animate-check-pop" style={{ width:22, height:22, borderRadius:"50%",
                    background:T.accent, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:11, color:"#000",
                    fontWeight:"bold", flexShrink:0 }}>{"\u2713"}</div>
                )}
              </div>

              {/* BOTTOM: Pro/con + meters */}
              <div style={{ padding:"12px 14px 14px" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                  <div style={{ display:"flex", gap:7, fontSize:13, lineHeight:1.45 }}>
                    <span style={{ color:T.colorSuccess, flexShrink:0, fontWeight:700 }}>{"\u2713"}</span>
                    <span style={{ color:T.textSecondary }}>{opt.pro}</span>
                  </div>
                  <div style={{ display:"flex", gap:7, fontSize:13, lineHeight:1.45 }}>
                    <span style={{ color:T.colorDanger, flexShrink:0, fontWeight:700 }}>{"\u2717"}</span>
                    <span style={{ color:T.textMuted }}>{opt.con}</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:12, paddingTop:10,
                  borderTop:`1px solid ${T.cardBorder}` }}>
                  <Meter label="Cost" value={opt.cost} max={5} color={T.colorCost} />
                  <Meter label="Complexity" value={opt.complexity} max={5} color={T.colorComplexity} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FitBadge({ badge }) {
  const s = badge.style === "match" ? T.badgeMatch
           : badge.style === "ok"   ? T.badgeOk
           :                          T.badgeLow;
  return (
    <span style={{ fontSize:10, padding:"2px 9px", borderRadius:999,
      background:s.bg, border:`1px solid ${s.border}`,
      color:s.text, fontWeight:700, letterSpacing:"0.07em" }}>
      {badge.label}
    </span>
  );
}

function Meter({ label, value, max, color }) {
  return (
    <div style={{ flex:1 }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        fontSize:11, color:T.textMuted, marginBottom:4, fontWeight:500 }}>
        <span>{label}</span><span>{value}/{max}</span>
      </div>
      <div style={{ height:3, background:"rgba(255,255,255,0.08)", borderRadius:2 }}>
        <div style={{ height:"100%", width:`${(value/max)*100}%`,
          background:color, borderRadius:2 }} />
      </div>
    </div>
  );
}
