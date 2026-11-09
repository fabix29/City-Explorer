import DestinatieCard from './DestinatieCard.jsx';

export default function ListaDestinatii({ destinatii, afisate, textCautare, onToggle }) {
  if (destinatii.length === 0) {
    return <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>;
  }

  if (afisate.length === 0) {
    return <p className="gol">Niciun rezultat pentru „{textCautare}”.</p>;
  }

  return (
    <div className="lista">
      {afisate.map((destinatie) => (
        <DestinatieCard
          key={destinatie.id}
          destinatie={destinatie}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}