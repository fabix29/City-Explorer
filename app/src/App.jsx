import { useEffect, useState } from 'react';
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js';
import { getNevizitate, totalZile } from './utils/destinatii.js';

import Rezumat from './components/Rezumat.jsx';
import FormularDestinatie from './components/FormularDestinatie.jsx';
import Cautare from './components/Cautare.jsx';
import ListaDestinatii from './components/ListaDestinatii.jsx';
import './App.css';

export default function App() {
  const [destinatii, setDestinatii] = useState([]);
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState(null);
  const [seTrimite, setSeTrimite] = useState(false);
  const [textCautare, setTextCautare] = useState('');

  useEffect(() => {
    async function incarcaDate() {
      try {
        const date = await getDestinatii();
        setDestinatii(date);
      } catch (err) {
        setEroare(err.message);
      } finally {
        setIncarcare(false);
      }
    }
    incarcaDate();
  }, []);

  const handleToggle = async (id) => {
    const cardCurent = destinatii.find((d) => d.id === id);
    if (!cardCurent) return;

    try {
      const salvata = await patchVizitat(id, !cardCurent.vizitat);
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)));
    } catch (err) {
      console.error('Eroare la actualizare:', err.message);
    }
  };

  const handleAdd = async (nouaDestinatie) => {
    try {
      setSeTrimite(true);
      const salvata = await postDestinatie(nouaDestinatie);
      setDestinatii((curent) => [...curent, salvata]);
    } catch (err) {
      console.error('Eroare la adăugare:', err.message);
    } finally {
      setSeTrimite(false);
    }
  };

  const text = textCautare.trim().toLowerCase();
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text)
  );

  const nevizitate = getNevizitate(destinatii);
  const zileTotal = totalZile(nevizitate);

  return (
    <main>
      <h1>City Explorer</h1>

      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}
      {eroare && <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>}

      {!incarcare && !eroare && (
        <>
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={zileTotal}
          />
          <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
          <Cautare valoare={textCautare} onChange={setTextCautare} />
          <ListaDestinatii
            destinatii={destinatii}
            afisate={afisate}
            textCautare={textCautare}
            onToggle={handleToggle}
          />
        </>
      )}
    </main>
  );
}