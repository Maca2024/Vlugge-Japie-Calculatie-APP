
import React, { useState } from 'react';
import { 
  Camera, ChevronRight, Ruler, Layers, Zap, Hammer, 
  FileText, CheckCircle, Loader2, ArrowLeft, Euro, Share2, 
  Box, Maximize, Settings, AlertCircle, ScanEye, Printer, X, Sparkles, BrainCircuit
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { AppStep, ProjectSpecs, ComplexityLevel, AtomicBreakdown, QuoteLineItem } from './types';
import { MATERIALS, HARDWARE, COMPLEXITY_MULTIPLIERS, HOURLY_RATE } from './constants';
import { performAtomicAnalysis } from './services/atomicEngine';

// --- UI COMPONENTS ---

const Header = ({ title, subtitle, onBack }: { title: string, subtitle?: string, onBack?: () => void }) => (
  <div className="pt-8 pb-6 px-6 sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gold-500 font-mono mt-0.5 uppercase tracking-wider">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false }: any) => {
  const baseStyle = "w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 shadow-lg shadow-gold-500/20 border border-gold-400/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
    outline: "border-2 border-slate-700 text-slate-300 hover:border-gold-500/50 hover:text-gold-400"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const ConfigSection = ({ title, icon: Icon, children }: any) => (
  <div className="space-y-4 pt-2">
    <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider pl-1">
      <Icon className="text-gold-500" size={16} /> {title}
    </h3>
    <div className="grid gap-3">
      {children}
    </div>
  </div>
);

const SelectBox = ({ label, subLabel, value, options, onChange }: any) => (
  <div className="relative">
    <label className="text-xs text-slate-400 font-semibold mb-1.5 block ml-1">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-sm font-medium pr-10"
      >
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>
            {opt.name} {opt.pricePerUnit > 0 && `(+€${opt.pricePerUnit})`}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <ChevronRight className="rotate-90 w-4 h-4" />
      </div>
    </div>
    {subLabel && <p className="text-[10px] text-slate-500 mt-1 ml-1">{subLabel}</p>}
  </div>
);

// --- PDF PREVIEW COMPONENT ---
const PDFPreview = ({ specs, analysis, onClose }: { specs: ProjectSpecs, analysis: AtomicBreakdown, onClose: () => void }) => {
  const print = () => window.print();
  const dateStr = new Date().toLocaleDateString('nl-NL');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm overflow-y-auto p-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white text-slate-900 shadow-2xl min-h-[297mm] animate-in fade-in zoom-in-95 duration-300 relative print:w-full print:max-w-none print:shadow-none print:absolute print:inset-0">
        
        {/* Screen-only Controls */}
        <div className="absolute top-4 right-4 flex gap-2 print:hidden">
           <button onClick={print} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">
             <Printer size={16} /> Print / Save PDF
           </button>
           <button onClick={onClose} className="bg-slate-200 text-slate-900 p-2 rounded-lg hover:bg-slate-300">
             <X size={20} />
           </button>
        </div>

        {/* DOCUMENT CONTENT */}
        <div className="p-12 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">VLUGGE JAPIE</h1>
              <p className="text-slate-500 font-mono text-sm mt-1">ATOMIC KITCHEN CALCULATIONS</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p className="font-bold">OFFERTE #24-9092</p>
              <p>Datum: {dateStr}</p>
              <p>Klant: {specs.clientName || 'Onbekend'}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 relative overflow-hidden">
             {analysis.isRealAnalysis && (
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">
                  Gemini Vision Verified
                </div>
             )}
             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Forensische Analyse</h3>
             <p className="text-sm leading-relaxed text-slate-700 italic">
               "{analysis.visualSummary}"
             </p>
             <div className="mt-4 flex gap-6 text-sm">
               <div>
                 <span className="block text-xs text-slate-400 uppercase">Onderkasten</span>
                 <span className="font-mono font-bold">{analysis.geometry.baseCabinets} st</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400 uppercase">Hoge Kasten</span>
                 <span className="font-mono font-bold">{analysis.geometry.tallCabinets} st</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-400 uppercase">Est. Breedte</span>
                 <span className="font-mono font-bold">{analysis.geometry.totalWidthMeters} m¹</span>
               </div>
             </div>
          </div>

          {/* Table */}
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3 rounded-tl-lg">Omschrijving</th>
                  <th className="p-3 text-right">Aantal</th>
                  <th className="p-3 text-right">Eenheid</th>
                  <th className="p-3 text-right">Prijs/st</th>
                  <th className="p-3 text-right rounded-tr-lg">Totaal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {analysis.lineItems.map((item, i) => (
                  <tr key={i} className={item.group === 'Arbeid' ? 'bg-slate-50 font-medium' : ''}>
                    <td className="p-3">
                      <span className="block text-slate-900">{item.label}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{item.group}</span>
                    </td>
                    <td className="p-3 text-right font-mono">{item.quantity}</td>
                    <td className="p-3 text-right text-slate-500">{item.unit}</td>
                    <td className="p-3 text-right font-mono">€ {item.pricePerUnit.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">€ {item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Totals */}
          <div className="flex justify-end pt-4">
             <div className="w-64 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotaal</span>
                  <span>€ {(analysis.totalPrice / 1.21).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>BTW (21%)</span>
                  <span>€ {(analysis.totalPrice - (analysis.totalPrice / 1.21)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 border-t-2 border-slate-900 pt-2">
                  <span>Totaal</span>
                  <span>€ {analysis.totalPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                </div>
             </div>
          </div>

          <div className="text-xs text-slate-400 pt-12 text-center">
            <p>Gegenereerd door Vlugge Japie - Atomic Kitchen Calculator.</p>
            <p>Prijzen onder voorbehoud van zet- en drukfouten. Geldigheid: 14 dagen.</p>
          </div>

        </div>
      </div>
    </div>
  );
};


// --- MAIN APP ---

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.DASHBOARD);
  const [specs, setSpecs] = useState<ProjectSpecs>({
    corpusMaterial: 'melamine-white-st',
    backPanelMaterial: 'hdf-white',
    frontMaterial: 'mdf-lacquer-mat',
    plinthMaterial: 'plinth-matching',
    worktopMaterial: 'none',
    drawerSystem: 'blum-legrabox-pure',
    hingeSystem: 'blum-cliptop-bluemotion',
    complexity: ComplexityLevel.NORMAL,
    clientName: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AtomicBreakdown | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  // --- LOGIC ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const runAnalysis = async () => {
    setStep(AppStep.ANALYSIS);
    setIsAnalyzing(true);
    // Pass image string (base64) to specs for the engine
    const analysisSpecs = { ...specs, imageUrl: image || undefined };
    
    try {
      const result = await performAtomicAnalysis(analysisSpecs);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="min-h-screen pb-24 bg-[url('https://images.unsplash.com/photo-1620608226019-b6848c9df258?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10">
        <Header title="Vlugge Japie" subtitle="V2.1 ULTRA VISION" />
        
        <div className="p-6 space-y-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Ruler size={140} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Nieuw Project</h2>
              <p className="text-slate-400 mb-8 max-w-[80%] leading-relaxed">
                Transformeer foto naar offerte. Forensic calculation engine actief.
              </p>
              <Button onClick={() => setStep(AppStep.INPUT)} icon={Camera}>Start Scan</Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-mono text-xs uppercase tracking-wider">Recente Calculaties</h3>
              <button className="text-gold-500 text-xs font-bold">Alles zien</button>
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold border border-slate-700">
                      J
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200">Penthouse Zuid</h4>
                      <p className="text-xs text-slate-500">Gisteren • Eiken Fineer</p>
                    </div>
                  </div>
                  <span className="font-mono text-gold-500 font-bold">€ 24k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header title="Configurator" subtitle="Definieer Details" onBack={() => setStep(AppStep.INPUT)} />
      
      <div className="flex-1 p-6 space-y-8 pb-32 overflow-y-auto">
        
        {/* Complexity - THE JAAP FACTOR */}
        <div className="bg-slate-900/50 border border-gold-500/20 rounded-2xl p-5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap className="text-gold-500" size={18} /> Arbeidsfactor
              </h3>
              <span className="bg-gold-500 text-slate-950 font-bold text-xs px-2 py-1 rounded">
                {COMPLEXITY_MULTIPLIERS[specs.complexity]}x
              </span>
           </div>
           <div className="flex flex-col gap-2">
            {Object.entries(ComplexityLevel).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSpecs({...specs, complexity: label as ComplexityLevel})}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                  specs.complexity === label 
                    ? 'bg-slate-800 border-gold-500/50 text-white shadow-lg' 
                    : 'border-transparent text-slate-500 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {specs.complexity === label && <CheckCircle size={16} className="text-gold-500" />}
                </div>
              </button>
            ))}
           </div>
        </div>

        <ConfigSection title="Casco (Binnenzijde)" icon={Box}>
          <SelectBox 
            label="Corpus Materiaal" 
            subLabel="Basis constructie"
            value={specs.corpusMaterial} 
            options={MATERIALS.corpus} 
            onChange={(v: string) => setSpecs({...specs, corpusMaterial: v})} 
          />
          <SelectBox 
            label="Achterwand" 
            value={specs.backPanelMaterial} 
            options={MATERIALS.backPanel} 
            onChange={(v: string) => setSpecs({...specs, backPanelMaterial: v})} 
          />
        </ConfigSection>

        <ConfigSection title="Exterieur (Zichtwerk)" icon={Layers}>
          <SelectBox 
            label="Front Materiaal" 
            subLabel="Bepalend voor uitstraling"
            value={specs.frontMaterial} 
            options={MATERIALS.front} 
            onChange={(v: string) => setSpecs({...specs, frontMaterial: v})} 
          />
          <SelectBox 
            label="Plint Afwerking" 
            value={specs.plinthMaterial} 
            options={MATERIALS.plinth} 
            onChange={(v: string) => setSpecs({...specs, plinthMaterial: v})} 
          />
          <SelectBox 
            label="Werkblad (Indicatief)" 
            value={specs.worktopMaterial} 
            options={MATERIALS.worktop} 
            onChange={(v: string) => setSpecs({...specs, worktopMaterial: v})} 
          />
        </ConfigSection>

        <ConfigSection title="Hardware Tech" icon={Settings}>
          <SelectBox 
            label="Ladesysteem" 
            subLabel="Geleiders en ladebakken"
            value={specs.drawerSystem} 
            options={HARDWARE.drawers} 
            onChange={(v: string) => setSpecs({...specs, drawerSystem: v})} 
          />
          <SelectBox 
            label="Scharnieren" 
            value={specs.hingeSystem} 
            options={HARDWARE.hinges} 
            onChange={(v: string) => setSpecs({...specs, hingeSystem: v})} 
          />
        </ConfigSection>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40">
        <Button onClick={runAnalysis} icon={Hammer}>
          Bereken Offerte
        </Button>
      </div>
    </div>
  );

  const renderQuote = () => {
    if (!analysis) return null;

    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header title="Offerte" subtitle={specs.clientName || 'Concept'} onBack={() => setStep(AppStep.CONFIG)} />
        
        <div className="flex-1 p-4 pb-32 space-y-6 overflow-y-auto">
          
          {/* Deep Analysis Card */}
          <div className={`border rounded-xl p-4 text-sm relative overflow-hidden ${analysis.isRealAnalysis ? 'bg-slate-900 border-blue-500/30' : 'bg-slate-900 border-slate-800'}`}>
             
             <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 font-bold text-white text-xs uppercase tracking-wider">
                  {analysis.isRealAnalysis ? <BrainCircuit size={14} className="text-blue-400" /> : <ScanEye size={14} className="text-gold-500" />}
                  {analysis.isRealAnalysis ? 'Gemini AI Vision' : 'Simulatie Modus'}
                </h3>
                {analysis.isRealAnalysis && (
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30 animate-pulse">
                    LIVE
                  </span>
                )}
             </div>

             <p className="italic leading-relaxed text-slate-400">
               "{analysis.visualSummary}"
             </p>
             <div className="flex gap-4 mt-3 pt-3 border-t border-slate-800/50">
               <div className="text-center">
                 <div className="text-[10px] text-slate-500 uppercase">Kasten</div>
                 <div className="font-mono text-gold-500 font-bold">{analysis.geometry.baseCabinets + analysis.geometry.tallCabinets}</div>
               </div>
               <div className="text-center">
                 <div className="text-[10px] text-slate-500 uppercase">Lades</div>
                 <div className="font-mono text-gold-500 font-bold">{analysis.geometry.drawerUnits}</div>
               </div>
                <div className="text-center">
                 <div className="text-[10px] text-slate-500 uppercase">Score</div>
                 <div className="font-mono text-gold-500 font-bold">{analysis.geometry.confidenceScore}%</div>
               </div>
             </div>
          </div>

          {/* Total Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-2">Totaal (incl. BTW & Marge)</p>
            <h2 className="text-4xl font-bold text-white font-mono tracking-tighter mb-2">
               € {analysis.totalPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex justify-center gap-2 mt-4">
              <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">Winst OK</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">{specs.complexity}</span>
            </div>
          </div>

          {/* Detailed Line Items */}
          <div className="space-y-6">
            
            {/* Group: Materials */}
            <div className="space-y-3">
              <h4 className="text-gold-500 text-xs font-bold uppercase tracking-wider pl-2">Materialen</h4>
              <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
                {analysis.lineItems.filter(i => i.group === 'Materialen').map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
                    <div>
                      <div className="text-sm font-medium text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.quantity} {item.unit} x €{item.pricePerUnit}</div>
                    </div>
                    <div className="font-mono text-sm text-slate-300">€ {item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group: Hardware */}
            <div className="space-y-3">
              <h4 className="text-blue-500 text-xs font-bold uppercase tracking-wider pl-2">Hardware</h4>
              <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
                {analysis.lineItems.filter(i => i.group === 'Hardware').map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
                    <div>
                      <div className="text-sm font-medium text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.quantity} {item.unit} x €{item.pricePerUnit}</div>
                    </div>
                    <div className="font-mono text-sm text-slate-300">€ {item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group: Labor */}
            <div className="space-y-3">
              <h4 className="text-purple-500 text-xs font-bold uppercase tracking-wider pl-2">Arbeid & Installatie</h4>
              <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
                {analysis.lineItems.filter(i => i.group === 'Arbeid').map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
                    <div>
                      <div className="text-sm font-medium text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.quantity} {item.unit} x €{item.pricePerUnit}</div>
                    </div>
                    <div className="font-mono text-sm text-slate-300">€ {item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex gap-3">
          <Button variant="secondary" className="flex-1" icon={Share2}>Delen</Button>
          <Button variant="primary" className="flex-[2]" onClick={() => setShowPDF(true)} icon={FileText}>PDF Export</Button>
        </div>
      </div>
    );
  };

  const renderInput = () => (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header title="Project Scan" subtitle="Stap 1/3" onBack={() => setStep(AppStep.DASHBOARD)} />
      
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gold-500 uppercase tracking-wider ml-1">Klant Referentie</label>
          <input 
            type="text" 
            placeholder="Bijv. Fam. De Vries"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-gold-500 focus:outline-none transition-colors"
            value={specs.clientName}
            onChange={(e) => setSpecs({...specs, clientName: e.target.value})}
          />
        </div>

        <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl relative flex flex-col items-center justify-center bg-slate-900/20 overflow-hidden group hover:border-gold-500/30 transition-all">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 z-10 cursor-pointer"
          />
          {image ? (
            <img src={image} alt="Upload" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          ) : (
            <div className="text-center p-6 pointer-events-none">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-500 shadow-xl shadow-black/40">
                <Camera size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Tekening</h3>
              <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Maak een foto van de technische tekening of schets.</p>
            </div>
          )}
        </div>

        <Button onClick={() => setStep(AppStep.CONFIG)} disabled={!image} icon={ChevronRight}>
          Volgende Stap
        </Button>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8 bg-slate-950">
      <div className="relative">
        <div className="absolute inset-0 bg-gold-500 blur-2xl opacity-20 animate-pulse"></div>
        <Loader2 className="w-20 h-20 text-gold-500 animate-spin relative z-10" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Forensic Analysis</h2>
        <p className="text-slate-400 text-sm">Deconstructie naar atomaire componenten...</p>
      </div>
      <div className="space-y-2 w-full max-w-xs">
         <div className="flex justify-between text-xs text-slate-500 uppercase font-mono">
           <span>Corpus</span>
           <span className="text-gold-500">Voltooid</span>
         </div>
         <div className="flex justify-between text-xs text-slate-500 uppercase font-mono">
           <span>Fronten</span>
           <span className="text-gold-500">Analyseren...</span>
         </div>
         <div className="flex justify-between text-xs text-slate-500 uppercase font-mono">
           <span>Hardware</span>
           <span>Wachtrij...</span>
         </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans antialiased text-slate-200 selection:bg-gold-500/30 bg-slate-950 min-h-screen">
      {/* PDF OVERLAY */}
      {showPDF && analysis && <PDFPreview specs={specs} analysis={analysis} onClose={() => setShowPDF(false)} />}
      
      {/* MAIN APP STEPS */}
      {!showPDF && (
        <>
          {step === AppStep.DASHBOARD && renderDashboard()}
          {step === AppStep.INPUT && renderInput()}
          {step === AppStep.CONFIG && renderConfig()}
          {step === AppStep.ANALYSIS && renderAnalyzing()}
          {step === AppStep.ANALYSIS && !isAnalyzing && analysis && renderQuote()}
        </>
      )}
    </div>
  );
}
