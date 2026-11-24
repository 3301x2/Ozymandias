import { useState } from "react";
import { T } from "../theme.js";

export function SplashScreen({ onStart }) {
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="animate-fade-in-up" style={{ textAlign:"center", maxWidth:420, width:"100%" }}>
        {/* Logo */}
        <div className="animate-pop-in" style={{ width:108, height:108, margin:"0 auto 20px" }}>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Ozymandias" style={{ width:"100%", height:"100%" }} />
        </div>
        <h1 style={{ fontSize:36, fontWeight:800, letterSpacing:"-0.5px", marginBottom:8 }}>
          <span style={{ color:T.accentLight }}>Ozymandias</span>
        </h1>
        <p style={{ color:T.textMuted, fontSize:14, marginBottom:40 }}>
          Data Stack Advisor for Senior Data Engineers
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ textAlign:"left" }}>
            <label style={{ fontSize:11, color:T.textMuted, textTransform:"uppercase",
              letterSpacing:"0.1em", marginBottom:8, display:"block", fontWeight:600 }}>
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && onStart(name.trim())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. customer-data-platform"
              autoFocus
              style={{
                width:"100%", background:"rgba(255,255,255,0.05)",
                border: focused ? `1px solid ${T.cardSelectedBorder}` : "1px solid rgba(255,255,255,0.12)",
                borderRadius:12, padding:"14px 16px",
                color:T.textPrimary, fontSize:16, outline:"none",
                transition:"border 0.18s",
                boxSizing:"border-box",
              }}
              className="placeholder-slate-600"
            />
          </div>

          <button
            onClick={() => name.trim() && onStart(name.trim())}
            disabled={!name.trim()}
            style={name.trim()
              ? { width:"100%", padding:"14px 0", borderRadius:12, fontSize:14,
                  fontWeight:700, border:"none", cursor:"pointer",
                  background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,
                  color:"#000", boxShadow:`0 4px 24px ${T.accentGlow}`,
                  transition:"all 0.18s" }
              : { width:"100%", padding:"14px 0", borderRadius:12, fontSize:14,
                  fontWeight:700, border:"none",
                  background:"rgba(255,255,255,0.05)", color:T.textMuted,
                  cursor:"not-allowed" }}
          >
            Start Planning
          </button>
        </div>

        {/* Quick visual roadmap */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
          gap:12, marginTop:40, fontSize:12, color:T.textMuted }}>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:T.accent, opacity:0.6 }} />
            8 questions
          </span>
          <span style={{ color:"rgba(255,255,255,0.2)" }}>{"\u2192"}</span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#a78bfa", opacity:0.6 }} />
            Pick tools
          </span>
          <span style={{ color:"rgba(255,255,255,0.2)" }}>{"\u2192"}</span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#34d399", opacity:0.6 }} />
            Blueprint
          </span>
        </div>
      </div>
    </div>
  );
}
