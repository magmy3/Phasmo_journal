import { useEffect, useState } from 'react'

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
}

function App() {
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ghosts')
      .then(response => {
        if (!response.ok) throw new Error('Síťová odpověď nebyla v pořádku');
        return response.json();
      })
      .then(data => {
        setGhosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Chyba při stahování dat:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#0a0a0a', color: '#e5e5e5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#fff' }}>👻 Phasmo Journal</h1>
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Navazuji spojení s temnotou...</p>
      ) : (
        {/* OPRAVENÝ KOMENTÁŘ: Zde začíná GRID (mřížka) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          
          {ghosts.map(ghost => (
            <div key={ghost.id} style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '25px', 
              borderRadius: '12px', 
              border: '1px solid #333',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              
              <h2 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px', color: '#f3f4f6' }}>
                {ghost.name}
              </h2>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {ghost.evidence1 && <span style={{ backgroundColor: '#374151', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{ghost.evidence1}</span>}
                {ghost.evidence2 && <span style={{ backgroundColor: '#374151', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{ghost.evidence2}</span>}
                {ghost.evidence3 && <span style={{ backgroundColor: '#374151', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{ghost.evidence3}</span>}
              </div>

              {ghost.strength && (
                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <strong style={{ color: '#ef4444' }}>Síla:</strong> {ghost.strength}
                </p>
              )}
              
              {ghost.weakness && (
                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <strong style={{ color: '#10b981' }}>Slabina:</strong> {ghost.weakness}
                </p>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default App
