import { PREFLIGHT_QUESTIONS } from "../data/questions";
import { T } from "../theme.js";

export function PreflightWizard({ step, answers, onAnswer }) {
  const q = PREFLIGHT_QUESTIONS[step];
  if (!q) return null;

  const progress = ((step + 1) / PREFLIGHT_QUESTIONS.length) * 100;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth:640, margin:"0 auto" }} key={step}>
      {/* Progress bar */}
      <div style={{ marginBottom:32 }}>
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
            {step + 1} of {PREFLIGHT_QUESTIONS.length}
          </span>
          <span style={{ fontSize:12, color:T.accentLight, fontWeight:700 }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Question header */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <span className="animate-pop-in" style={{ fontSize:52, display:"block", marginBottom:12,
          filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{q.icon}</span>
        <h2 style={{ fontSize:28, fontWeight:800, color:"#ffffff",
          letterSpacing:"-0.5px", margin:0 }}>{q.title}</h2>
        {q.hint && (
          <p style={{ color:T.textSecondary, fontSize:15, marginTop:8 }}>{q.hint}</p>
        )}
      </div>

      {/* Options */}
      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {q.options.map((opt) => {
          const selected = answers[q.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onAnswer(q.id, opt.id)}
              className="animate-fade-in-up"
              style={{
                textAlign:"left", padding:"16px 20px", borderRadius:14,
                cursor:"pointer", transition:"all 0.18s", display:"block", width:"100%",
                background: selected ? T.cardSelectedBg : "rgba(255,255,255,0.04)",
                border: selected
                  ? `1px solid ${T.cardSelectedBorder}`
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: selected
                  ? `0 0 0 1px ${T.cardSelectedBorder}, 0 8px 32px rgba(6,182,212,0.12)`
                  : "none",
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                {/* Radio indicator */}
                <div style={{
                  width:20, height:20, borderRadius:"50%", flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.18s",
                  border: selected ? `2px solid ${T.accent}` : "2px solid rgba(255,255,255,0.2)",
                  background: selected ? T.accent : "transparent",
                }}>
                  {selected && (
                    <svg className="animate-check-pop" style={{ width:12, height:12, color:"#000" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ color:"#ffffff", fontWeight:600, fontSize:15 }}>{opt.label}</div>
                  <div style={{ color:T.textSecondary, fontSize:13, marginTop:2 }}>{opt.sub}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step dots */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:32 }}>
        {PREFLIGHT_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={i === step ? "animate-pulse-glow" : ""}
            style={{
              borderRadius:"50%", transition:"all 0.3s",
              ...(i < step
                ? { width:8, height:8, background:T.accentLight, opacity:0.45 }
                : i === step
                  ? { width:10, height:10, background:T.accent }
                  : { width:8, height:8, background:"rgba(255,255,255,0.1)" }),
            }}
          />
        ))}
      </div>
    </div>
  );
}
