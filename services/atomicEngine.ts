
import { GoogleGenAI } from "@google/genai";
import { AtomicBreakdown, ProjectSpecs, QuoteLineItem, DetectedGeometry, ComplexityLevel } from '../types';
import { COMPLEXITY_MULTIPLIERS, MATERIALS, HARDWARE, CONSUMABLES, HOURLY_RATE, GENERAL_MARGIN } from '../constants';

/**
 * ------------------------------------------------------------------
 * AI VISION LAYER
 * ------------------------------------------------------------------
 */

const analyzeWithGemini = async (base64Image: string): Promise<Partial<AtomicBreakdown> | null> => {
  // VEILIGHEID: We checken hier of de API Key in de environment zit.
  // In productie: Zet API_KEY in je environment variables (bijv. Vercel/Netlify).
  // Lokaal: Gebruik een .env bestand.
  if (!process.env.API_KEY) {
    console.warn("Geen API Key gedetecteerd in process.env.API_KEY. Overschakelen naar simulatie.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Je bent de AI-assistent van 'Vlugge Japie', een expert meubelmaker. Analyseer deze technische tekening of schets forensisch.
            
            Kijk specifiek naar:
            1. De structuur: Hoeveel kasten? Welke indeling?
            2. De details: Zichtbare grepen? Lades?
            3. Inschatting complexiteit: Is het standaard recht werk of zit er veel paswerk in?

            Geef output als JSON:
            {
              "visualSummary": "Een professionele, technische omschrijving voor op de offerte (NL). Beschrijf materiaaluitstraling en vorm.",
              "geometry": {
                "baseCabinets": number (onderkasten),
                "drawerUnits": number (ladeblokken),
                "tallCabinets": number (hoge kasten/koelkast),
                "wallCabinets": number (bovenkasten),
                "totalWidthMeters": number (schatting totale breedte),
                "confidenceScore": number (0-100)
              },
              "suggestedComplexity": "SIMPLE" | "NORMAL" | "COMPLEX"
            }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    const data = JSON.parse(text);
    return {
      ...data,
      isRealAnalysis: true
    };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};

/**
 * ------------------------------------------------------------------
 * THE ATOMIC CALCULATION ENGINE
 * ------------------------------------------------------------------
 */

export const performAtomicAnalysis = async (specs: ProjectSpecs): Promise<AtomicBreakdown> => {
  
  // 1. VISION PHASE
  let geometry: DetectedGeometry;
  let visualSummary: string;
  let isRealAnalysis = false;
  let suggestedComplexity = null;

  // Try Real AI first
  const aiResult = specs.imageUrl ? await analyzeWithGemini(specs.imageUrl) : null;

  if (aiResult && aiResult.geometry) {
    geometry = aiResult.geometry as DetectedGeometry;
    visualSummary = aiResult.visualSummary || "AI Analyse voltooid via Gemini Vision.";
    isRealAnalysis = true;
    // @ts-ignore
    suggestedComplexity = aiResult.suggestedComplexity;
  } else {
    // Fallback Simulation (Forensic Mode)
    await new Promise(r => setTimeout(r, 2000)); // Simulatie denktijd
    
    geometry = {
      baseCabinets: 4,
      drawerUnits: 2, 
      tallCabinets: 2,
      wallCabinets: 3,
      totalWidthMeters: 4.8,
      confidenceScore: 85
    };
    
    visualSummary = `Detectie voltooid (Simulatie). Systeem herkent een L-vormige opstelling met ${geometry.tallCabinets} hoge kasten (waarschijnlijk inbouwapparatuur) en een spoel-sectie. ${geometry.drawerUnits} brede ladeblokken geïdentificeerd. Maatvoering suggereert standaard corpushoogte.`;
  }

  // Auto-update complexity if AI suggests it and user hasn't locked it (simplified logic here: just report it)
  // In a real app we might prompt the user "AI suggests COMPLEX due to angles detected".

  // 2. VECTOR DECONSTRUCTION PHASE
  const hBase = 0.78; 
  const dBase = 0.58; 
  const hTall = 2.20;
  const hWall = 0.78;
  const dWall = 0.35;

  // M2 Calculations
  const m2PerBase = (hBase * dBase * 2) + (0.6 * dBase) + (0.6 * 0.1 * 2); 
  const m2PerTall = (hTall * dBase * 2) + (0.6 * dBase * 2) + (0.6 * hTall); 
  const m2PerWall = (hWall * dWall * 2) + (0.6 * dWall * 2);

  const rawCorpusM2 = (geometry.baseCabinets * m2PerBase) + 
                      (geometry.drawerUnits * m2PerBase) + 
                      (geometry.tallCabinets * m2PerTall) + 
                      (geometry.wallCabinets * m2PerWall);

  const rawFrontM2 = (geometry.baseCabinets * 0.6 * hBase) +
                     (geometry.drawerUnits * 0.6 * hBase) +
                     (geometry.tallCabinets * 0.6 * hTall) +
                     (geometry.wallCabinets * 0.6 * hWall);

  const rawBackPanelM2 = rawFrontM2; 
  const rawPlinthMeters = geometry.totalWidthMeters * 1.2; 

  const drawerCount = geometry.drawerUnits * 3; 
  const hingeCount = (geometry.baseCabinets * 2) + (geometry.tallCabinets * 4) + (geometry.wallCabinets * 2);
  const legsCount = Math.ceil(geometry.totalWidthMeters / 0.6) * 4;
  
  const edgeBandingMeters = (rawFrontM2 * 4) + (rawCorpusM2 * 0.8); 

  // 3. FINANCIAL ENGINE
  const lineItems: QuoteLineItem[] = [];
  
  const getMat = (cat: string, id: string) => MATERIALS[cat]?.find(m => m.id === id) || MATERIALS[cat][0];
  const getHard = (cat: string, id: string) => HARDWARE[cat]?.find(h => h.id === id) || HARDWARE[cat][0];

  const corpusMat = getMat('corpus', specs.corpusMaterial);
  const frontMat = getMat('front', specs.frontMaterial);
  const backMat = getMat('backPanel', specs.backPanelMaterial);
  const plinthMat = getMat('plinth', specs.plinthMaterial);
  const worktopMat = getMat('worktop', specs.worktopMaterial);

  let materialCost = 0;

  const addLine = (label: string, qty: number, unit: 'm²'|'m¹'|'st'|'uur', price: number, group: 'Materialen'|'Hardware'|'Arbeid', waste: number = 1.0) => {
    const billedQty = qty * waste;
    const total = billedQty * price;
    lineItems.push({
      id: Math.random().toString(36).substr(2, 9),
      label,
      quantity: parseFloat(billedQty.toFixed(2)),
      unit,
      pricePerUnit: price,
      totalPrice: total,
      group
    });
    return total;
  };

  // Build Line Items
  materialCost += addLine(`Corpus: ${corpusMat.name}`, rawCorpusM2, 'm²', corpusMat.pricePerUnit, 'Materialen', corpusMat.wasteFactor);
  materialCost += addLine(`Fronten: ${frontMat.name}`, rawFrontM2, 'm²', frontMat.pricePerUnit, 'Materialen', frontMat.wasteFactor);
  materialCost += addLine(`Achterwanden: ${backMat.name}`, rawBackPanelM2, 'm²', backMat.pricePerUnit, 'Materialen', backMat.wasteFactor);
  materialCost += addLine(`Plint: ${plinthMat.name}`, rawPlinthMeters, 'm¹', plinthMat.pricePerUnit, 'Materialen', plinthMat.wasteFactor);
  materialCost += addLine('ABS Kantband (incl. smeltlijm)', edgeBandingMeters, 'm¹', CONSUMABLES.edgeBandingPerMeter, 'Materialen');

  if (worktopMat.pricePerUnit > 0) {
    materialCost += addLine(`Werkblad: ${worktopMat.name}`, geometry.totalWidthMeters, 'm¹', worktopMat.pricePerUnit, 'Materialen', worktopMat.wasteFactor);
  }

  let hardwareCost = 0;
  const drawerHard = getHard('drawers', specs.drawerSystem);
  const hingeHard = getHard('hinges', specs.hingeSystem);

  hardwareCost += addLine(`Lades: ${drawerHard.name}`, drawerCount, 'st', drawerHard.pricePerUnit, 'Hardware');
  hardwareCost += addLine(`Scharnieren: ${hingeHard.name}`, hingeCount, 'st', hingeHard.pricePerUnit, 'Hardware');
  hardwareCost += addLine('Stelpoten (set van 4)', legsCount / 4, 'st', CONSUMABLES.legs * 4, 'Hardware');
  hardwareCost += addLine('Verbruiksartikelen (Lijm/Bevestiging)', 1, 'st', CONSUMABLES.constructionGlue + CONSUMABLES.fasteners, 'Hardware');

  // Labor Logic
  const baseHours = (geometry.baseCabinets * 2.5) + 
                    (geometry.tallCabinets * 4.0) + 
                    (geometry.drawerUnits * 3.5) +
                    (geometry.wallCabinets * 2.0);
  
  const handlingTime = 4;
  const installTime = geometry.totalWidthMeters * 2.5;
  
  // Use suggested complexity if available and higher than current? 
  // For now, stick to user selection but maybe warn in UI.
  const complexityMult = COMPLEXITY_MULTIPLIERS[specs.complexity];
  const totalHours = (baseHours + handlingTime + installTime) * complexityMult;

  const laborCost = addLine(`Arbeid & Installatie (${specs.complexity})`, totalHours, 'uur', HOURLY_RATE, 'Arbeid');

  const totalMaterialHardware = (materialCost + hardwareCost) * GENERAL_MARGIN; 
  const totalBaseCost = materialCost + hardwareCost + laborCost;
  const finalPrice = totalMaterialHardware + laborCost;

  return {
    isRealAnalysis,
    visualSummary,
    geometry,
    corpusM2: rawCorpusM2,
    frontM2: rawFrontM2,
    backPanelM2: rawBackPanelM2,
    edgeBandingMeters,
    hinges: hingeCount,
    drawerRunners: drawerCount,
    legs: legsCount,
    lineItems,
    laborHours: totalHours,
    complexityMultiplier: complexityMult,
    totalCost: totalBaseCost,
    totalPrice: finalPrice
  };
};
