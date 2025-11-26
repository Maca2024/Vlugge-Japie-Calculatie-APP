import { ComplexityLevel, Material, HardwareOption } from './types';

// Multipliers for the "Jaap Factor"
export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  [ComplexityLevel.SIMPLE]: 1.0,
  [ComplexityLevel.NORMAL]: 1.5,
  [ComplexityLevel.COMPLEX]: 2.5,
};

export const HOURLY_RATE = 68.50; // Updated 2024 rate
export const GENERAL_MARGIN = 1.35; // 35% margin on materials

export const MATERIALS: Record<string, Material[]> = {
  corpus: [
    { id: 'melamine-white-st', name: 'Egger W980 Wit (Standaard)', category: 'Spaanplaat', pricePerUnit: 14.50, wasteFactor: 1.10, description: '18mm, stootvast' },
    { id: 'melamine-black-u999', name: 'Egger U999 Zwart', category: 'Spaanplaat', pricePerUnit: 19.50, wasteFactor: 1.10, description: '18mm, diepzwart' },
    { id: 'mdf-prime', name: 'MDF Lakdraagfolie (V313)', category: 'MDF', pricePerUnit: 24.00, wasteFactor: 1.15, description: 'Vochtwerend, om te lakken' },
    { id: 'plywood-birch', name: 'Berken Multiplex (B/BB)', category: 'Multiplex', pricePerUnit: 48.00, wasteFactor: 1.20, description: '18mm, zichtbare laagjes' },
    { id: 'oak-veneer-corpus', name: 'Eiken Gefineerd Spaan', category: 'Fineer', pricePerUnit: 65.00, wasteFactor: 1.25, description: 'A-kwaliteit dosse' },
  ],
  backPanel: [
    { id: 'hdf-white', name: 'HDF Wit 4mm', category: 'HDF', pricePerUnit: 6.50, wasteFactor: 1.10 },
    { id: 'hdf-black', name: 'HDF Zwart 4mm', category: 'HDF', pricePerUnit: 8.50, wasteFactor: 1.10 },
    { id: 'same-as-corpus', name: 'Zelfde als Corpus (8mm)', category: 'Constructief', pricePerUnit: 14.50, wasteFactor: 1.10 },
  ],
  front: [
    { id: 'mdf-lacquer-mat', name: 'MDF Gespoten (Mat RAL/NCS)', category: 'Lakwerk', pricePerUnit: 145.00, wasteFactor: 1.05, description: '3-laags systeem' },
    { id: 'fenix-ntm', name: 'Fenix NTM (Op Berken)', category: 'High-End', pricePerUnit: 165.00, wasteFactor: 1.15, description: 'Supermat, anti-fingerprint' },
    { id: 'deco-legno', name: 'Decolegno (Structuur)', category: 'Melamine', pricePerUnit: 65.00, wasteFactor: 1.15, description: 'Voelbare houtnerf (S0)' },
    { id: 'oak-veneer-front', name: 'Eiken Fineer (Geborsteld)', category: 'Fineer', pricePerUnit: 135.00, wasteFactor: 1.25, description: 'Inclusief afwerking olie/lak' },
    { id: 'hpl-color', name: 'HPL Uni-Kleur (Arpa/Abet)', category: 'HPL', pricePerUnit: 75.00, wasteFactor: 1.15, description: 'Op MDF drager' },
  ],
  plinth: [
    { id: 'plinth-waterproof', name: 'Watervast Multiplex (Zwart)', category: 'Functioneel', pricePerUnit: 35.00, wasteFactor: 1.1 },
    { id: 'plinth-matching', name: 'Gelijk aan frontmateriaal', category: 'Esthetisch', pricePerUnit: 65.00, wasteFactor: 1.1 },
    { id: 'plinth-alu', name: 'Aluminium Look (Geborsteld)', category: 'Modern', pricePerUnit: 45.00, wasteFactor: 1.05 },
  ],
  worktop: [
    { id: 'none', name: 'Geen / Door derden', category: 'Exclusief', pricePerUnit: 0, wasteFactor: 1 },
    { id: 'composite', name: 'Composiet (20mm)', category: 'Steen', pricePerUnit: 320.00, wasteFactor: 1.05 },
    { id: 'ceramic', name: 'Keramiek (Neolith/Dekton)', category: 'Steen', pricePerUnit: 450.00, wasteFactor: 1.05 },
    { id: 'hpl-top', name: 'HPL Multiplex (38mm)', category: 'Kunststof', pricePerUnit: 95.00, wasteFactor: 1.10 },
  ]
};

export const HARDWARE: Record<string, HardwareOption[]> = {
  drawers: [
    { id: 'blum-legrabox-pure', name: 'Blum Legrabox Pure (Mat)', pricePerUnit: 55.00, type: 'runner' },
    { id: 'blum-legrabox-free', name: 'Blum Legrabox Free (Glas)', pricePerUnit: 75.00, type: 'runner' },
    { id: 'blum-movento-wood', name: 'Blum Movento (Voor houten lades)', pricePerUnit: 38.00, type: 'runner' },
    { id: 'hettich-architech', name: 'Hettich ArciTech', pricePerUnit: 48.00, type: 'runner' },
  ],
  hinges: [
    { id: 'blum-cliptop-bluemotion', name: 'Blum Clip Top Bluemotion', pricePerUnit: 6.50, type: 'hinge' },
    { id: 'blum-onyx-black', name: 'Blum Onyx Zwart', pricePerUnit: 8.50, type: 'hinge' },
    { id: 'tip-on', name: 'Tip-On (Greeploos)', pricePerUnit: 12.50, type: 'hinge' },
  ]
};

export const CONSUMABLES = {
  edgeBandingPerMeter: 2.50, // Glue + ABS tape
  legs: 1.25, // Korpusvoet
  constructionGlue: 45.00, // Per project estimation
  fasteners: 35.00, // Screws, domino's per project
};
