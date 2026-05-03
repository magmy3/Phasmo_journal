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

function App() {
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<'main' | 'ghost-list' | 'ghost-detail'>('main');
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [detailTab, setDetailTab] = useState<'general' | 'specific'>('general');

  useEffect(() => {
    fetch('https://phasmo-journal-backend.onrender.com/api/ghosts')
      .then(response => response.json())
      .then(data => {
        setGhosts(data);
        setLoading(false);
      })
      .catch(err => console.error("Connection error:", err));
  }, []);

  const openGhost = (ghost: Ghost) => {
    setSelectedGhost(ghost);
    setDetailTab('general');
    setView('ghost-detail');
  };

  if (loading) return <div style={{color: 'white', fontSize: '24px'}}>Establishing connection with the spirit world...</div>;

  return (
    <div className="journal-wrapper">
      
      {/* Hlavní horní záložky deníku */}
      <div className="tabs">
        <div className={`tab ${view === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>Introduction</div>
        <div className={`tab ${view === 'ghost-list' || view === 'ghost-detail' ? 'active' : ''}`} onClick={() => setView('ghost-list')}>Ghost Types</div>
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

        {/* --- POHLED 3: DETAIL DUCHA (General / Specific) --- */}
        {view === 'ghost-detail' && selectedGhost && (
          <div className="view-container">
            
            {/* LEVÁ STRANA DETAILU */}
            <div className="page left-page">
              <span className="back-link" onClick={() => setView('ghost-list')}>⮜ Back to list</span>
              
              <span className="toggle-link" onClick={() => setDetailTab(detailTab === 'general' ? 'specific' : 'general')}>
                Switch to {detailTab === 'general' ? 'Specific Data ⮞' : 'General Data ⮞'}
              </span>

              <h1 className="typed-text">{selectedGhost.name} {detailTab === 'specific' ? '- Specific' : ''}</h1>
              <hr />

              {/* General - Levá strana */}
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

              {/* Specific - Levá strana */}
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

            {/* PRAVÁ STRANA DETAILU */}
            <div className="page right-page">
              
              {/* General - Pravá strana */}
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

              {/* Specific - Pravá strana */}
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

      </div>
    </div>
  );
}

export default App;
