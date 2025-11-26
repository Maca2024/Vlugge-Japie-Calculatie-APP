
export enum AppStep {
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  CONFIG = 'CONFIG',
  ANALYSIS = 'ANALYSIS',
  QUOTE = 'QUOTE'
}

export enum ComplexityLevel {
  SIMPLE = 'Rechttoe Rechtaan (x1.0)',
  NORMAL = 'Normaal Maatwerk (x1.5)',
  COMPLEX = 'High-End / Complex (x2.5)'
}

export interface Material {
  id: string;
  name: string;
  category: string;
  pricePerUnit: number; // M2 for wood, Piece for hardware
  wasteFactor: number; // e.g. 1.15 for 15% waste
  description?: string;
}

export interface HardwareOption {
  id: string;
  name: string;
  pricePerUnit: number;
  type: 'hinge' | 'runner' | 'system';
}

export interface ProjectSpecs {
  // Casco
  corpusMaterial: string;
  backPanelMaterial: string;
  
  // Exterior
  frontMaterial: string;
  plinthMaterial: string;
  worktopMaterial: string;
  
  // Hardware
  drawerSystem: string;
  hingeSystem: string;
  
  // Meta
  complexity: ComplexityLevel;
  imageUrl?: string;
  clientName?: string;
}

export interface QuoteLineItem {
  id: string;
  label: string;
  quantity: number;
  unit: 'm²' | 'm¹' | 'st' | 'uur';
  pricePerUnit: number;
  totalPrice: number;
  group: 'Materialen' | 'Hardware' | 'Arbeid';
}

export interface DetectedGeometry {
  baseCabinets: number;
  drawerUnits: number;
  tallCabinets: number;
  wallCabinets: number;
  totalWidthMeters: number;
  confidenceScore: number;
}

export interface AtomicBreakdown {
  // AI Vision Data
  isRealAnalysis: boolean; // True if Gemini API was used
  visualSummary: string; // The "Deep Understanding" text
  geometry: DetectedGeometry;

  // Raw Quantities
  corpusM2: number;
  frontM2: number;
  backPanelM2: number;
  edgeBandingMeters: number;
  hinges: number;
  drawerRunners: number;
  legs: number;
  
  // Financials
  lineItems: QuoteLineItem[];
  laborHours: number;
  complexityMultiplier: number;
  totalCost: number;
  totalPrice: number; // Including margin
}
