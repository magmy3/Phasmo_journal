import { useEffect, useState } from 'react';
import './App.css'; 

interface GhostSpecific {
  situation: string | null;
  speed: string | null;
  huntThreshold: string | null;
  notesOnBehaviour: string | null;
}

interface Ghost {
  id: number;
  name: string;
  evidence1: string | null;
  evidence2: string | null;
  evidence3: string | null;
  strength: string | null;
  weakness: string | null;
  shortDescription: string | null;
  mainTheme: string | null;
  specific: GhostSpecific | null;
}

const ALL_EVIDENCES = [
  "EMF 5", "Spirit Box", "Ultraviolet", "Orbs", "Book Writing", "Freezing", "D.O.T.S."
];

function App() {
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation
  const [view, setView] = useState<'main' | 'ghost-list' | 'ghost-detail' | 'cheat-sheet'>('main');
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [detailTab, setDetailTab] = useState<'general' | 'specific'>('general');

  // Cheat Sheet States
  const [foundEvidences, setFoundEvidences] = useState<string[]>([]);
  const [ruledOutEvidences, setRuledOutEvidences] = useState<string[]>([]);
  const [smudgeTimer, setSmudgeTimer] = useState<number>(0); // v sekundách
  const [timerActive, setTimerActive] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://phasmo-journal-backend.onrender.com/api/ghosts')
      .then(response => response.json())
      .then(data => {
        setGhosts(data);
        setLoading(false);
      })
      .catch(err => console.error("Connection error:", err));
  }, []);

  // Smudge Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && smudgeTimer > 0) {
      interval = setInterval(() => {
        setSmudgeTimer((prev) => prev - 1);
      }, 1000);
    } else if (smudgeTimer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, smudgeTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startSmudgeTimer = () => {
    setSmudgeTimer(180); // 3 minuty maximum pro Spirita
    setTimerActive(true);
  };

  // Evidence Toggle Logic (Neutral -> Found -> Ruled Out -> Neutral)
  const toggleEvidence = (ev: string) => {
    if (foundEvidences.includes(ev)) {
      setFoundEvidences(foundEvidences.filter(e => e !== ev));
      setRuledOutEvidences([...ruledOutEvidences, ev]);
    } else if (ruledOutEvidences.includes(ev)) {
      setRuledOutEvidences(ruledOutEvidences.filter(e => e !== ev));
    } else {
      if (foundEvidences.length < 3) {
        setFoundEvidences([...foundEvidences, ev]);
      }
    }
  };

  const openGhost = (ghost: Ghost) => {
    setSelectedGhost(ghost);
    setDetailTab('general');
    setView('ghost-detail');
  };

  // Filtr duchů
  const possibleGhosts = ghosts.filter(g => {
    const ghostEvidences = [g.evidence1, g.evidence2, g.evidence3];
    const hasAllFound = foundEvidences.every(ev => ghostEvidences.includes(ev));
    const hasNoRuledOut = ruledOutEvidences.every(ev => !ghostEvidences.includes(ev));
    return hasAllFound && hasNoRuledOut;
  });

  if (loading) return <div style={{color: 'white', fontSize: '24px'}}>Establishing connection with the spirit world...</div>;

  return (
    <div className="journal-wrapper">
      
      {/* Hlavní horní záložky deníku */}
      <div className="tabs">
        <div className={`tab ${view === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>Introduction</div>
        <div className={`tab ${view === 'ghost-list' || view === 'ghost-detail' ? 'active' : ''}`} onClick={() => setView('ghost-list')}>Ghost Types</div>
        <div className={`tab ${view === 'cheat-sheet' ? 'active' : ''}`} onClick={() => setView('cheat-sheet')}>Cheat Sheet</div>
      </div>

      <div className="journal">
        
        {/* --- POHLED 1: ÚVODNÍ STRÁNKA --- */}
        {view === 'main' && (
          <div className="view-container">
            <div className="page left-page" style={{ textAlign: 'center' }}>
              <h1 className="typed-text" style={{ fontSize: '42px', marginTop: '30px' }}>Phasmophobia</h1>
              <p className="handwritten" style={{ color: '#666' }}>Field Journal</p>
              <div className="polaroid">
                <div className="photo-placeholder">Safety Instructions</div>
                <p className="handwritten">Never go alone.</p>
              </div>
            </div>
            <div className="binding"></div>
            <div className="page right-page">
              <h2 className="typed-text">Investigation</h2>
              <hr />
              <p className="handwritten">This journal contains records of all known entities, their strengths, weaknesses, and specific behaviors.</p>
              <p className="handwritten">Use measurement data, observe entity hunting speeds, and mind your sanity thresholds.</p>
              <div className="sticky-note">
                <p className="handwritten" style={{ fontSize: '26px' }}>Check the crucifixes!</p>
              </div>
            </div>
          </div>
        )}

        {/* --- POHLED 2: SEZNAM DUCHŮ --- */}
        {view === 'ghost-list' && (
          <div className="view-container">
            <div className="page left-page">
              <h1 className="typed-text">Entity Records</h1>
              <hr />
              <div className="ghost-grid">
                {ghosts.map((ghost, index) => (
                  <span key={ghost.id} className="ghost-link" onClick={() => openGhost(ghost)}>
                    {index + 1}. {ghost.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="binding"></div>
            <div className="page right-page">
              <h2 className="typed-text">Field Notes</h2>
              <hr />
              <p className="handwritten">Select an entity from the left page for a detailed record.</p>
              <br />
              <p className="handwritten">When identifying, don't forget to account for fake evidence from The Mimic and Line of Sight acceleration.</p>
            </div>
          </div>
        )}

        {/* --- POHLED 3: DETAIL DUCHA --- */}
        {view === 'ghost-detail' && selectedGhost && (
          <div className="view-container">
            <div className="page left-page">
              <span className="back-link" onClick={() => setView('ghost-list')}>⮜ Back to list</span>
              <span className="toggle-link" onClick={() => setDetailTab(detailTab === 'general' ? 'specific' : 'general')}>
                Switch to {detailTab === 'general' ? 'Specific Data ⮞' : 'General Data ⮞'}
              </span>
              <h1 className="typed-text">{selectedGhost.name} {detailTab === 'specific' ? '- Specific' : ''}</h1>
              <hr />
              {detailTab === 'general' && (
                <>
                  <div className="generic-list">
                    <p><strong>Evidence 1:</strong> {selectedGhost.evidence1 || '???'}</p>
                    <p><strong>Evidence 2:</strong> {selectedGhost.evidence2 || '???'}</p>
                    <p><strong>Evidence 3:</strong> {selectedGhost.evidence3 || '???'}</p>
                  </div>
                  <div className="image-placeholder">Entity Sketch / Photograph</div>
                </>
              )}
              {detailTab === 'specific' && selectedGhost.specific && (
                <>
                  <div className="data-label">Situation</div>
                  <div className="data-value">{selectedGhost.specific.situation}</div>
                  <div className="data-label">Speed (m/s)</div>
                  <div className="data-value">{selectedGhost.specific.speed}</div>
                  <div className="data-label">Hunt threshold (%)</div>
                  <div className="data-value">{selectedGhost.specific.huntThreshold}</div>
                </>
              )}
            </div>
            <div className="binding"></div>
            <div className="page right-page">
              {detailTab === 'general' && (
                <>
                  <h2 className="typed-text">Characteristics</h2>
                  <hr />
                  {selectedGhost.strength && (
                    <>
                      <div className="data-label">Strength</div>
                      <p className="handwritten">{selectedGhost.strength}</p>
                    </>
                  )}
                  {selectedGhost.weakness && (
                    <>
                      <div className="data-label">Weakness</div>
                      <p className="handwritten">{selectedGhost.weakness}</p>
                    </>
                  )}
                  {selectedGhost.shortDescription && (
                    <>
                      <div className="data-label">Short Description</div>
                      <p className="handwritten" style={{fontSize: '24px'}}>{selectedGhost.shortDescription}</p>
                    </>
                  )}
                  <div className="data-label">Main Theme</div>
                  <p className="handwritten">{selectedGhost.mainTheme}</p>
                </>
              )}
              {detailTab === 'specific' && selectedGhost.specific && (
                <>
                  <h2 className="typed-text">Behavior Notes</h2>
                  <hr />
                  <p className="handwritten" style={{fontSize: '28px'}}>{selectedGhost.specific.notesOnBehaviour}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* --- POHLED 4: CHEAT SHEET (NOVÉ) --- */}
        {view === 'cheat-sheet' && (
          <div className="view-container">
            {/* LEVÁ STRANA: FILTR EVIDENCÍ A DUCHŮ */}
            <div className="page left-page">
              <h1 className="typed-text">Evidence Tracker</h1>
              <hr />
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {ALL_EVIDENCES.map(ev => {
                  let bgColor = '#e5e7eb'; // Neutral
                  let color = '#374151';
                  let textDecoration = 'none';
                  
                  if (foundEvidences.includes(ev)) {
                    bgColor = '#10b981'; // Green
                    color = '#fff';
                  } else if (ruledOutEvidences.includes(ev)) {
                    bgColor = '#ef4444'; // Red
                    color = '#fff';
                    textDecoration = 'line-through';
                  }

                  return (
                    <button 
                      key={ev} 
                      onClick={() => toggleEvidence(ev)}
                      style={{ 
                        padding: '8px 16px', borderRadius: '8px', border: 'none', 
                        fontFamily: "'Special Elite', monospace", fontSize: '16px',
                        cursor: 'pointer', backgroundColor: bgColor, color: color, 
                        textDecoration: textDecoration, transition: '0.2s',
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                      {ev}
                    </button>
                  );
                })}
              </div>

              <h2 className="typed-text" style={{ fontSize: '24px' }}>Possible Entities ({possibleGhosts.length})</h2>
              <div className="ghost-grid" style={{ gridTemplateColumns: '1fr 1fr', fontSize: '22px' }}>
                {possibleGhosts.map(g => (
                   <span key={g.id} className="ghost-link" style={{ fontSize: '24px' }} onClick={() => openGhost(g)}>
                     {g.name}
                   </span>
                ))}
              </div>
            </div>

            <div className="binding"></div>

            {/* PRAVÁ STRANA: STOPKY A SMART TIPY */}
            <div className="page right-page">
              <h1 className="typed-text">Investigation Tools</h1>
              <hr />
              
              {/* Smudge Timer */}
              <div style={{ backgroundColor: '#262626', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '30px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Special Elite', monospace", margin: '0 0 10px 0', color: '#ccc' }}>Smudge Timer</h3>
                <div style={{ fontSize: '48px', fontFamily: "monospace", fontWeight: 'bold', marginBottom: '10px' }}>
                  {formatTime(smudgeTimer)}
                </div>
                <button 
                  onClick={startSmudgeTimer}
                  style={{ padding: '10px 20px', backgroundColor: '#f4d03f', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Special Elite', monospace", fontSize: '18px', color: '#111', marginRight: '10px' }}
                >
                  START SMUDGE (180s)
                </button>
                <button 
                  onClick={() => { setTimerActive(false); setSmudgeTimer(0); }}
                  style={{ padding: '10px 20px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Special Elite', monospace", fontSize: '18px', color: '#fff' }}
                >
                  RESET
                </button>

                {/* Milníky Timeru */}
                <div style={{ marginTop: '15px', fontSize: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ color: smudgeTimer <= 120 && smudgeTimer > 0 ? '#ef4444' : '#888' }}>
                    🚨 <strong>1:00 (60s)</strong> - Demon can hunt again
                  </span>
                  <span style={{ color: smudgeTimer <= 90 && smudgeTimer > 0 ? '#ef4444' : '#888' }}>
                    🚨 <strong>1:30 (90s)</strong> - Normal ghosts can hunt again
                  </span>
                  <span style={{ color: smudgeTimer === 0 && timerActive === false ? '#888' : '#10b981' }}>
                    ✅ <strong>3:00 (180s)</strong> - Spirit can hunt again
                  </span>
                </div>
              </div>

              {/* Smart Tipy */}
              <h2 className="typed-text" style={{ fontSize: '24px' }}>What to check next</h2>
              <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
                {possibleGhosts.length === 0 ? (
                  <p className="handwritten" style={{ color: '#8b0000', margin: 0 }}>No ghost matches this evidence. Check your facts, or it's The Mimic!</p>
                ) : possibleGhosts.length > 6 ? (
                  <p className="handwritten" style={{ margin: 0 }}>Gather more evidence to narrow down the list. Try setting up D.O.T.S. or using the Spirit Box in the dark.</p>
                ) : possibleGhosts.length > 1 ? (
                  <ul className="handwritten" style={{ paddingLeft: '20px', margin: 0, fontSize: '26px' }}>
                    {possibleGhosts.map(g => (
                      <li key={g.id} style={{ marginBottom: '10px' }}>
                        <strong>{g.name}:</strong> {g.shortDescription || g.strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="handwritten" style={{ fontSize: '32px', color: '#8b0000', margin: 0 }}>
                    <strong>It's a {possibleGhosts[0].name}!</strong><br/><br/>
                    Be careful: {possibleGhosts[0].strength}
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
