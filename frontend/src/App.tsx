import { useEffect, useState } from 'react'

// Definice typu pro Ducha (díky tomu nám TypeScript bude napovídat)
interface Ghost {
  id: number;
  name: string;
  description: string;
  strength: string;
  weakness: string;
}

function App() {
  // Tady ukládáme data z databáze a stav načítání
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TOTO JE TEN MOST - Ptáme se backendu na data
    // Díky proxy stačí napsat jen '/api/ghosts'
    fetch('/api/ghosts')
      .then(response => {
        if (!response.ok) throw new Error('Síťová odpověď nebyla v pořádku');
        return response.json();
      })
      .then(data => {
        setGhosts(data); // Uložíme přijatá data
        setLoading(false);
        console.log("Data z backendu dorazila:", data); // Výpis do konzole prohlížeče
      })
      .catch(error => {
        console.error("Chyba při stahování dat:", error);
        setLoading(false);
      });
  }, []); // Prázdná závorka = spusť jen jednou po načtení stránky

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1>👻 Phasmo Journal - Test spojení</h1>
      
      {loading ? (
        <p>Navazuji spojení s temnotou (backendem)...</p>
      ) : (
        <div>
          <h2 style={{ color: '#4ade80' }}>Spojení navázáno úspěšně!</h2>
          <p>Aktuální počet duchů v databázi: <strong>{ghosts.length}</strong></p>
          
          <p>Syrová data z Javy (JSON):</p>
          {/* Tady se vypíšou data, jakmile je přidáme do databáze */}
          <pre style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
            {JSON.stringify(ghosts, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
