import { useState, useCallback } from "react";
import { PREFLIGHT_QUESTIONS } from "./data/questions";
import { OPTIONS, CATEGORIES } from "./data/options";
import { SplashScreen } from "./components/SplashScreen";
import { PreflightWizard } from "./components/PreflightWizard";
import { CategoryPicker } from "./components/CategoryPicker";
import { Blueprint } from "./components/Blueprint";
import { T } from "./theme.js";

const PHASE_SPLASH = "splash";
const PHASE_PREFLIGHT = "preflight";
const PHASE_BUILD = "build";
const PHASE_BLUEPRINT = "blueprint";

export default function App() {
  const [phase, setPhase] = useState(PHASE_SPLASH);
  const [projectName, setProjectName] = useState("");
  const [preflightStep, setPreflightStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [buildStep, setBuildStep] = useState(0);
  const [selections, setSelections] = useState({});

  const handleStart = useCallback((name) => {
    setProjectName(name);
    setPhase(PHASE_PREFLIGHT);
  }, []);

  const handlePreflightAnswer = useCallback((qId, optId) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
    if (preflightStep < PREFLIGHT_QUESTIONS.length - 1) {
      setPreflightStep((s) => s + 1);
    } else {
      setPhase(PHASE_BUILD);
    }
  }, [preflightStep]);

  const enrichedAnswers = {
    ...answers,
    _clouds: selections.cloud || [],
  };

  const handleToggle = useCallback((catKey, multi, optId) => {
    setSelections((prev) => {
      const current = prev[catKey] || [];
      if (multi) {
        const next = current.includes(optId)
          ? current.filter((x) => x !== optId)
          : [...current, optId];
        return { ...prev, [catKey]: next };
      }
      return { ...prev, [catKey]: [optId] };
    });
  }, []);

  const cat = CATEGORIES[buildStep];
  const canGoNext = phase === PHASE_BUILD && (selections[cat?.key] || []).length > 0;
  const canGoBack =
    (phase === PHASE_PREFLIGHT && preflightStep > 0) ||
    (phase === PHASE_BUILD && buildStep >= 0) ||
    phase === PHASE_BLUEPRINT;

  const goNext = () => {
    if (phase === PHASE_BUILD) {
      if (buildStep < CATEGORIES.length - 1) {
        setBuildStep((s) => s + 1);
      } else {
        setPhase(PHASE_BLUEPRINT);
      }
    }
  };

  const goBack = () => {
    if (phase === PHASE_BLUEPRINT) {
      setPhase(PHASE_BUILD);
      setBuildStep(CATEGORIES.length - 1);
    } else if (phase === PHASE_BUILD) {
      if (buildStep > 0) {
        setBuildStep((s) => s - 1);
      } else {
        setPhase(PHASE_PREFLIGHT);
        setPreflightStep(PREFLIGHT_QUESTIONS.length - 1);
      }
    } else if (phase === PHASE_PREFLIGHT && preflightStep > 0) {
      setPreflightStep((s) => s - 1);
    }
  };

  const restart = () => {
    setPhase(PHASE_SPLASH);
    setProjectName("");
    setPreflightStep(0);
    setAnswers({});
    setBuildStep(0);
    setSelections({});
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.textPrimary,
      fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif",
      position:"relative", overflow:"hidden" }}>

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-15%",left:"-5%",width:700,height:700,
        borderRadius:"50%",pointerEvents:"none",zIndex:0,
        background:`radial-gradient(circle,${T.orb1} 0%,transparent 65%)` }}/>
      <div style={{ position:"fixed",bottom:"-10%",right:"0",width:500,height:500,
        borderRadius:"50%",pointerEvents:"none",zIndex:0,
        background:`radial-gradient(circle,${T.orb2} 0%,transparent 65%)` }}/>

      {/* Header */}
      {phase !== PHASE_SPLASH && (
        <header style={{ background:T.headerBg, backdropFilter:"blur(24px)",
          borderBottom:`1px solid ${T.headerBorder}`, padding:"0 24px",
          position:"relative", zIndex:2 }}>
          <div style={{ maxWidth:1024, margin:"0 auto", display:"flex",
            alignItems:"center", justifyContent:"space-between", padding:"14px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9,
                background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,
                boxShadow:`0 4px 16px ${T.accentGlow}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                overflow:"hidden" }}>
                <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" style={{ width:22, height:22 }} />
              </div>
              <span style={{ color:T.textPrimary, fontWeight:700, fontSize:17 }}>
                Ozymandias
              </span>
              {projectName && (
                <span style={{ color:T.textMuted, fontSize:13 }}>
                  / {projectName}
                </span>
              )}
            </div>
            <button
              onClick={restart}
              style={{ color:T.textMuted, background:"transparent", border:"none",
                fontSize:13, cursor:"pointer" }}
            >
              Start over
            </button>
          </div>
        </header>
      )}

      {/* Main content */}
      <main style={{ padding:"40px 24px", position:"relative", zIndex:1 }}>
        {phase === PHASE_SPLASH && <SplashScreen onStart={handleStart} />}

        {phase === PHASE_PREFLIGHT && (
          <PreflightWizard
            step={preflightStep}
            answers={answers}
            onAnswer={handlePreflightAnswer}
          />
        )}

        {phase === PHASE_BUILD && cat && (
          <CategoryPicker
            category={cat}
            options={OPTIONS[cat.key] || []}
            selected={selections[cat.key] || []}
            onToggle={(optId) => handleToggle(cat.key, cat.multi, optId)}
            answers={enrichedAnswers}
            buildStep={buildStep}
          />
        )}

        {phase === PHASE_BLUEPRINT && (
          <Blueprint
            projectName={projectName}
            answers={answers}
            selections={selections}
          />
        )}
      </main>

      {/* Footer nav */}
      {(phase === PHASE_BUILD || phase === PHASE_BLUEPRINT) && (
        <footer style={{ position:"fixed", bottom:0, left:0, right:0,
          background:T.headerBg, backdropFilter:"blur(24px)",
          borderTop:`1px solid ${T.headerBorder}`, padding:"0 24px", zIndex:10 }}>
          <div style={{ maxWidth:1024, margin:"0 auto", display:"flex",
            alignItems:"center", justifyContent:"space-between", padding:"14px 0" }}>
            <button
              onClick={goBack}
              disabled={!canGoBack}
              style={{ background:"rgba(255,255,255,0.06)",
                border:`1px solid rgba(255,255,255,0.1)`,
                color: canGoBack ? T.textSecondary : T.textMuted,
                borderRadius:12, padding:"8px 18px", fontSize:14, fontWeight:600,
                cursor: canGoBack ? "pointer" : "not-allowed",
                transition:"all 0.18s" }}
            >
              Back
            </button>

            {phase === PHASE_BUILD && (
              <span style={{ color:T.textMuted, fontSize:13 }}>
                {buildStep + 1} / {CATEGORIES.length}
              </span>
            )}

            {phase === PHASE_BUILD && (
              <button
                onClick={goNext}
                disabled={!canGoNext}
                style={canGoNext
                  ? { background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,
                      color:"#000", fontWeight:700, borderRadius:12, border:"none",
                      boxShadow:`0 4px 24px ${T.accentGlow}`,
                      padding:"8px 22px", fontSize:14, cursor:"pointer",
                      transition:"all 0.18s" }
                  : { background:"rgba(255,255,255,0.05)", color:T.textMuted,
                      borderRadius:12, border:"none", padding:"8px 22px",
                      fontSize:14, cursor:"not-allowed" }}
              >
                {buildStep < CATEGORIES.length - 1 ? "Next" : "View Blueprint"}
              </button>
            )}

            {phase === PHASE_BLUEPRINT && (
              <button
                onClick={restart}
                style={{ background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,
                  color:"#000", fontWeight:700, borderRadius:12, border:"none",
                  boxShadow:`0 4px 24px ${T.accentGlow}`,
                  padding:"8px 22px", fontSize:14, cursor:"pointer" }}
              >
                Start New
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
