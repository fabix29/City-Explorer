// Lista cu numele orselor (folosind map)
export const getOrase = (list) => list.map((o) => o.oras)

// Destinatiile care nu au fost vizitate (folosind filter)
export const getNevizitate = (list) => list.filter((o) => !o.vizitat)

// Suma totala a zilelor (folosind reduce)
export const totalZile = (list) => list.reduce((sum, o) => sum + o.zile, 0)

// Formatarea unui rand de text pentru o destinație
export const formatDestinatie = ({ oras, tara, zile, vizitat }) => 
  `[${vizitat ? 'x' : ' '}] ${oras}, ${tara} (${zile} zile)`

// Numarul de destinatii din fiecare tara (folosind reduce cu obiect acumulator)
export const numarPeTara = (list) => 
  list.reduce((acc, { tara }) => ({ ...acc, [tara]: (acc[tara] ?? 0) + 1 }), {})

// Lista ordonata descrescator dupa zile (pe o copie a listei)
export const sortDupaZile = (list) => [...list].sort((a, b) => b.zile - a.zile)

// Marcheaza o destinatie ca vizitata/nevizitata (inversand starea)
export const marcheazaVizitat = (list, id) =>
  list.map((o) => (o.id === id ? { ...o, vizitat: !o.vizitat } : o))

// Adauga o destinatie noua la finalul listei
export const adaugaDestinatie = (list, d) => [...list, d]

// Sterge o destinatie dupa ID
export const stergeDestinatie = (list, id) => list.filter((o) => o.id !== id)