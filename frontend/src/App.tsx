import { useEffect, useState } from 'react';
import './App.css'; // Ujisti se, že importuješ ten CSS soubor!

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
  
  // Stavy navigace podle tvých náčrtků
  const [view, setView] = useState<'main' | 'ghost-list' | 'ghost-detail'>('main');
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [detailTab, setDetailTab] = useState<'general' | 'specific'>('general');

  useEffect(() => {
    // Tahle adresa už míří rovnou na tvůj mrak!
    fetch('https://phasmo-journal-backend.onrender.com/api/ghosts')
      .then(response => response.json())
      .then(data => {
        setGhosts(data);
        setLoading(false);
      })
      .catch(err => console.error("Chyba spojení:", err));
  }, []);

  const openGhost = (ghost: Ghost) => {
    setSelectedGhost(ghost);
    setDetailTab('general');
    setView('ghost-detail');
  };

  if (loading) return <div style={{color: 'white', fontSize: '24px'}}>Navazuji spojení se světem duchů...</div>;

  return (
    <div className="journal-wrapper">
      
      {/* Hlavní horní záložky deníku */}
      <div className="tabs">
        <div className={`tab ${view === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>Úvod</div>
        <div className={`tab ${view === 'ghost-list' || view === 'ghost-detail' ? 'active' : ''}`} onClick={() => setView('ghost-list')}>Záznamy o Entitách</div>
      </div>

      <div className="journal">
        
        {/* --- POHLED 1: ÚVODNÍ STRÁNKA --- */}
        {view === 'main' && (
          <div className="view-container">
            <div className="page left-page" style={{ textAlign: 'center' }}>
              <h1 className="typed-text" style={{ fontSize: '42px', marginTop: '30px' }}>Phasmophobia</h1>
              <p className="handwritten" style={{ color: '#666' }}>Field Journal</p>
              <div className="polaroid">
                <div className="photo-placeholder">Bezpečnostní instrukce</div>
                <p className="handwritten">Nikdy nebuď sám.</p>
              </div>
            </div>
            <div className="binding"></div>
            <div className="page right-page">
              <h2 className="typed-text">Vyšetřování</h2>
              <hr />
              <p className="handwritten">Tento deník obsahuje záznamy o všech známých entitách, jejich silných i slabých stránkách a specifickém chování.</p>
              <p className="handwritten">Využívej data z měření, pozoruj rychlost entit při lovu a dbej na prahy příčetnosti.</p>
              <div className="sticky-note">
                <p className="handwritten" style={{ fontSize: '26px' }}>Zkontroluj krucifixy!</p>
              </div>
            </div>
          </div>
        )}

        {/* --- POHLED 2: SEZNAM DUCHŮ --- */}
        {view === 'ghost-list' && (
          <div className="view-container">
            <div className="page left-page">
              <h1 className="typed-text">Záznamy o Entitách</h1>
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
              <h2 className="typed-text">Poznámky</h2>
              <hr />
              <p className="handwritten">Vyber entitu z levé strany pro detailní záznam.</p>
              <br />
              <p className="handwritten">Při identifikaci nezapomínej brát v potaz falešné důkazy od The Mimic a zrychlování v přímé viditelnosti (Line of Sight).</p>
            </div>
          </div>
        )}

        {/* --- POHLED 3: DETAIL DUCHA (General / Specific) --- */}
        {view === 'ghost-detail' && selectedGhost && (
          <div className="view-container">
            
            {/* LEVÁ STRANA DETAILU */}
            <div className="page left-page">
              <span className="back-link" onClick={() => setView('ghost-list')}>⮜ Zpět na seznam</span>
              
              <span className="toggle-link" onClick={() => setDetailTab(detailTab === 'general' ? 'specific' : 'general')}>
                Přepnout na {detailTab === 'general' ? 'Specifické data ⮞' : 'Základní data ⮞'}
              </span>

              <h1 className="typed-text">{selectedGhost.name} {detailTab === 'specific' ? '- Specific' : ''}</h1>
              <hr />

              {/* Náčrtek 2: General - Levá strana */}
              {detailTab === 'general' && (
                <>
                  <div className="generic-list">
                    <p><strong>Důkaz 1:</strong> {selectedGhost.evidence1 || '???'}</p>
                    <p><strong>Důkaz 2:</strong> {selectedGhost.evidence2 || '???'}</p>
                    <p><strong>Důkaz 3:</strong> {selectedGhost.evidence3 || '???'}</p>
                  </div>
                  <div className="image-placeholder">Nákres / Fotografie entity</div>
                </>
              )}

              {/* Náčrtek 3: Specific - Levá strana */}
              {detailTab === 'specific' && selectedGhost.specific && (
                <>
                  <div className="data-label">Situace</div>
                  <div className="data-value">{selectedGhost.specific.situation}</div>
                  
                  <div className="data-label">Rychlost (m/s)</div>
                  <div className="data-value">{selectedGhost.specific.speed}</div>

                  <div className="data-label">Hunt threshold (%)</div>
                  <div className="data-value">{selectedGhost.specific.huntThreshold}</div>
                </>
              )}
            </div>

            <div className="binding"></div>

            {/* PRAVÁ STRANA DETAILU */}
            <div className="page right-page">
              
              {/* Náčrtek 2: General - Pravá strana */}
              {detailTab === 'general' && (
                <>
                  <h2 className="typed-text">Charakteristika</h2>
                  <hr />
                  
                  {selectedGhost.strength && (
                    <>
                      <div className="data-label">Síla (Strength)</div>
                      <p className="handwritten">{selectedGhost.strength}</p>
                    </>
                  )}

                  {selectedGhost.weakness && (
                    <>
                      <div className="data-label">Slabina (Weakness)</div>
                      <p className="handwritten">{selectedGhost.weakness}</p>
                    </>
                  )}

                  {selectedGhost.shortDescription && (
                    <>
                      <div className="data-label">Krátký popis</div>
                      <p className="handwritten" style={{fontSize: '24px'}}>{selectedGhost.shortDescription}</p>
                    </>
                  )}
                  
                  <div className="data-label">Hlavní téma</div>
                  <p className="handwritten">{selectedGhost.mainTheme}</p>
                </>
              )}

              {/* Náčrtek 3: Specific - Pravá strana */}
              {detailTab === 'specific' && selectedGhost.specific && (
                <>
                  <h2 className="typed-text">Poznámky k chování</h2>
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
