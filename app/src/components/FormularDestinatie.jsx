import { useState } from 'react';

export default function FormularDestinatie({ onAdd, seTrimite }) {
  const [valori, setValori] = useState({ oras: '', tara: '', zile: '' });
  const [erori, setErori] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValori((curent) => ({ ...curent, [name]: value }));
  }

  function valideaza(val) {
    const mesaje = {};
    if (val.oras.trim().length < 2) {
      mesaje.oras = 'Orașul are cel puțin două caractere.';
    }
    if (!val.tara.trim()) {
      mesaje.tara = 'Țara este obligatorie.';
    }
    const nrZile = Number(val.zile);
    if (!val.zile || Number.isNaN(nrZile) || nrZile < 1 || nrZile > 30) {
      mesaje.zile = 'Numărul de zile este între 1 și 30.';
    }
    return mesaje;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const rezultateErori = valideaza(valori);
    setErori(rezultateErori);

    if (Object.keys(rezultateErori).length > 0) {
      return;
    }

    onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    });

    setValori({ oras: '', tara: '', zile: '' });
    setErori({});
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          type="number"
          name="zile"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  );
}