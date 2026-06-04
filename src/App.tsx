import { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Shield, Wind, Sun, ShieldAlert, 
  Snowflake, Droplets, Lightbulb, Music, BatteryCharging,
  Bus, Truck, Fuel, Target, Zap, Activity, Filter, Settings, Layers, BarChart2, Landmark, FileText, Menu, X, ChevronRight,
  Database, Bath, Monitor, Gauge, ShowerHead, RefreshCw, Droplet, LayoutDashboard, Bed, Fan, AirVent, ArrowDownToLine, Shirt
} from 'lucide-react';

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "rvStrategy", label: "RV Strategy" },
  { id: "marketMetrics", label: "Market Metrics" },
  { id: "gccNetwork", label: "GCC Network" },
  { id: "engineering", label: "Engineering" },
  { id: "nevCv", label: "NEV / CV" },
  { id: "charging", label: "Charging" },
  { id: "motorhomeUpgrades", label: "Upgrades" },
  { id: "glossary", label: "Glossary" }
];

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
  
  .font-space { font-family: 'Space Grotesk', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }

  .bg-blueprint {
    background-color: #F4F7F9;
    background-image: 
      linear-gradient(rgba(0, 90, 145, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 90, 145, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    position: relative;
  }

  .blueprint-line { border-color: rgba(216, 225, 231, 0.6); }
  html { scroll-behavior: smooth; }
  
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* Antigravity Glassmorphism & Depth */
  .glass-panel {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px rgba(0, 90, 145, 0.04);
  }
  
  .glass-panel-dark {
    background: rgba(10, 34, 57, 0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }

  /* Ambient Glowing Orbs */
  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    pointer-events: none;
    z-index: 0;
  }

  /* Recharts Tooltip */
  .custom-tooltip {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 90, 145, 0.2);
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 90, 145, 0.1);
  }

  .circuit-line { position: relative; }
  .circuit-line::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    width: 1px;
    height: 20px;
    background-color: #005A91;
    opacity: 0.3;
  }

  /* 3D Isometric styling */
  .perspective-1000 { perspective: 1200px; }
  .preserve-3d { transform-style: preserve-3d; }
  .iso-layer { transition: background-color 0.4s ease, border-color 0.4s ease; }
`;

const GLOSSARY_DATA = {
  "Economics & Business": [
    { term: "CAGR", definition: "Compound Annual Growth Rate" },
    { term: "HNW", definition: "High-Net-Worth" },
    { term: "TCO", definition: "Total Cost of Ownership" },
    { term: "USD / AED", definition: "United States Dollar / United Arab Emirates Dirham" }
  ],
  "Energy & Power Systems": [
    { term: "AC / DC", definition: "Alternating Current / Direct Current" },
    { term: "LiFePO4", definition: "Lithium Iron Phosphate Battery" },
    { term: "LTO", definition: "Lithium Titanate Oxide Battery" },
    { term: "BMS", definition: "Battery Management System" },
    { term: "MPPT", definition: "Maximum Power Point Tracking Solar Controller" }
  ],
  "Automotive & Engineering": [
    { term: "NEV", definition: "New Energy Vehicle" },
    { term: "CV", definition: "Commercial Vehicle" },
    { term: "BEV", definition: "Battery Electric Vehicle" },
    { term: "FCEV", definition: "Fuel Cell Electric Vehicle" },
    { term: "V2L / V2X", definition: "Vehicle-to-Load / Vehicle-to-Everything" },
    { term: "HVAC", definition: "Heating, Ventilation, and Air Conditioning" },
    { term: "BTU", definition: "British Thermal Unit" },
    { term: "CFM", definition: "Cubic Feet per Minute" },
    { term: "HEPA", definition: "High-Efficiency Particulate Air" },
    { term: "NVH", definition: "Noise, Vibration, and Harshness" }
  ],
  "Regulatory Authorities": [
    { term: "GSO", definition: "GCC Standardization Organization" },
    { term: "ECAS", definition: "Emirates Conformity Assessment Scheme (UAE)" },
    { term: "SASO", definition: "Saudi Standards, Metrology and Quality Organization" },
    { term: "SABER", definition: "Electronic Product Certification Platform (KSA)" },
    { term: "DEWA / ADDC", definition: "Dubai Electricity & Water / Abu Dhabi Distribution (UAE)" },
    { term: "SEC / WERA", definition: "Saudi Electricity / Water & Electricity Regulatory Authority (KSA)" }
  ]
};

const MARKET_METRICS = [
  { territory: "UAE", char: "USD 103.6M to USD 155.2M expansion. Premium luxury overlanding, beach camping, and eco-tourism rentals." },
  { territory: "Saudi Arabia", char: "Largest consumer base (35M+). Driven by Vision 2030 mega eco-tourism projects (NEOM, AlUla, Red Sea)." },
  { territory: "Oman", char: "Rugged deep-desert overlanding sector. Transits through Empty Quarter (Rub' al Khali) and Hajar Mountain wadis." },
  { territory: "Qatar", char: "Boutique high-margin segment driven by luxury glamping infrastructure established post-FIFA event." },
  { territory: "Bahrain", char: "Compact volume segment dominated by urban weekend coastal camper formats and layouts." },
  { territory: "Kuwait", char: "Urban-focused lifestyle segment with concentrated winter seasonal demand for stationary desert base-camps." }
];

const DEALERSHIP_NETWORK = [
  { territory: "UAE", players: "RV Bin Lahej • RV Gulf • Icon Auto • Heartland Emirates RV • X Camper • City RV • MyHome", logistics: "Central nodes for off-grid hardware and accessory pipelines across GCC borders." },
  { territory: "KSA", players: "Al Rajhi Network • Abdul Latif Jameel • Naghi Motors", logistics: "Dominant footprints covering metropolitan grids across Riyadh, Jeddah, Dammam." },
  { territory: "Oman", players: "Suhail Bahwan Automobiles • Saud Bahwan Group • RV Sur", logistics: "Distribution hubs operating across Muscat and Sohar port corridors." },
  { territory: "Qatar", players: "Nasser Bin Khaled Automobiles", logistics: "Luxury installation footprints situated within the Doha Industrial Area." },
  { territory: "Bahrain", players: "Y.K. Almoayyed & Sons", logistics: "Asset footprints managing commercial transit across the King Fahd Causeway." },
  { territory: "Kuwait", players: "Al Mulla Group Trading Network", logistics: "Primary routing infrastructure anchored within the Al Rai Industrial sector." }
];

const SAND_PROTECTION_LAYERS = [
  { id: 1, name: "High-Solids Ceramic Clear-Coat", role: "Blocks radiation, preserves baseline color and protects underlying anti-abrasive layers from photolytic yellowing.", color: "#E0F2FE" },
  { id: 2, name: "Anti-Abrasive Sand-Resistant Coating", role: "Dense elastomeric matrix that absorbs the kinetic impact of high-velocity sand particles.", color: "#BAE6FD" },
  { id: 3, name: "Corrosion-Resistant Primer Layer", role: "Chemical barrier formulated to withstand structural moisture and severe salty ocean breezes.", color: "#7DD3FC" },
  { id: 4, name: "E-Coat (Electrophoretic Protection)", role: "Provides absolute coverage of hidden channels, inner corners, and welded joints via electro-deposition.", color: "#38BDF8" },
  { id: 5, name: "Pre-Treatment Layer", role: "Micro-crystalline zinc phosphate layer optimizing structural molecular adhesion.", color: "#94A3B8" },
  { id: 6, name: "Steel Body Substrate", role: "High-tensile, hot-rolled automotive-grade structural framework engineered to tolerate extreme stresses.", color: "#64748B" }
];

const CHARGING_DEFICIT_DATA = [
  { country: "UAE", regulator: "DEWA / ADDC", target: "45,000 required vs. 10,000 projected by 2035 (Structural Deficit: 35,000 nodes) via EV Green Charger framework", tariff: "DC Fast 1.20 AED/kWh; AC Slow 0.70 AED/kWh. Abu Dhabi Green Bus Programme — LTO battery benchmark deployment." },
  { country: "KSA", regulator: "SEC / WERA", target: "50,000 total nodes by 2030, incl. 5,000 EVIQ Fast DC chargers across 1,000+ locations", tariff: "Supports 30% EV penetration target in Riyadh. PIF investment backing." },
  { country: "Oman", regulator: "Nama Electricity", target: "22,000 active nodes by 2030", tariff: "Nationwide cross-border EV-highway network. Aligned with Oman Vision 2040." },
  { country: "Qatar", regulator: "Kahramaa", target: "1,000–1,500 public stations by 2030", tariff: "Tarsheed programme; prioritizes electrification of 25% of public transit fleet." },
  { country: "Bahrain", regulator: "EWA", target: "Localized urban-core grid pilots", tariff: "DC fast chargers across key commercial nodes (EWA Manama pilots)." },
  { country: "Kuwait", regulator: "MEW", target: "Localized urban-core grid pilots", tariff: "DC fast chargers across key commercial nodes (MEW Salmiya hubs)." }
];

const RV_MARKET_GROWTH_DATA = [
  { year: '2022', value: 103.6, label: 'Baseline' },
  { year: '2024', value: 115.8, label: 'Current' },
  { year: '2026', value: 129.4, label: 'Mission Window' },
  { year: '2028', value: 142.1, label: 'Projection' },
  { year: '2030', value: 155.2, label: 'Target' },
];

const RVSilhouette = ({ children, className }: any) => (
  <div className={`relative w-full aspect-[2/1] max-w-2xl mx-auto ${className}`}>
    <svg viewBox="0 0 800 400" className="w-full h-full text-[#0A2239]/10" preserveAspectRatio="xMidYMid meet">
      <path d="M 120,320 L 120,160 Q 120,140 140,140 L 250,140 L 300,100 L 700,100 Q 750,100 750,150 L 750,320 Z" fill="currentColor" stroke="#0A2239" strokeWidth="4" strokeOpacity="0.3"/>
      <path d="M 120,240 L 250,240 L 280,180 L 120,180 Z" fill="white" stroke="#0A2239" strokeWidth="2" strokeOpacity="0.3"/>
      <path d="M 320,140 L 450,140 L 450,220 L 320,220 Z" fill="white" stroke="#0A2239" strokeWidth="2" strokeOpacity="0.3"/>
      <path d="M 500,140 L 680,140 L 680,220 L 500,220 Z" fill="white" stroke="#0A2239" strokeWidth="2" strokeOpacity="0.3"/>
      <circle cx="250" cy="320" r="45" fill="#F8FAFC" stroke="#0A2239" strokeWidth="4" strokeOpacity="0.3"/>
      <circle cx="250" cy="320" r="25" fill="#0A2239" opacity="0.1"/>
      <circle cx="620" cy="320" r="45" fill="#F8FAFC" stroke="#0A2239" strokeWidth="4" strokeOpacity="0.3"/>
      <circle cx="620" cy="320" r="25" fill="#0A2239" opacity="0.1"/>
      <line x1="100" y1="365" x2="780" y2="365" stroke="#005A91" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="10 10"/>
    </svg>
    {children}
  </div>
);

const CountryIcons = {
  "UAE": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 20 90 L 80 90" />
      <path d="M 35 90 L 35 80 L 40 80 L 40 65 L 43 65 L 43 50 L 46 50 L 46 30 L 48 30 L 48 15 L 52 15 L 52 30 L 54 30 L 54 50 L 57 50 L 57 65 L 60 65 L 60 80 L 65 80 L 65 90" />
      <line x1="40" y1="80" x2="60" y2="80" />
      <line x1="43" y1="65" x2="57" y2="65" />
      <line x1="46" y1="50" x2="54" y2="50" />
      <line x1="48" y1="30" x2="52" y2="30" />
      <line x1="50" y1="15" x2="50" y2="2" />
      <line x1="46" y1="90" x2="46" y2="50" />
      <line x1="54" y1="90" x2="54" y2="50" />
    </svg>
  ),
  "KSA": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 20 90 L 80 90" />
      <path d="M 35 90 L 38 15 L 62 15 L 65 90" />
      <path d="M 43 15 L 43 35 Q 50 55 57 35 L 57 15" />
    </svg>
  ),
  "Saudi Arabia": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 20 90 L 80 90" />
      <path d="M 35 90 L 38 15 L 62 15 L 65 90" />
      <path d="M 43 15 L 43 35 Q 50 55 57 35 L 57 15" />
    </svg>
  ),
  "Oman": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 15 90 L 85 90" />
      <path d="M 25 90 L 25 60 Q 25 50 35 50 L 40 50 L 40 90" />
      <path d="M 30 90 L 30 75 A 3 3 0 0 1 36 75 L 36 90" />
      <path d="M 40 65 L 40 30 L 65 30 L 65 65" />
      <path d="M 38 30 L 38 25 L 43 25 L 43 30 L 48 30 L 48 25 L 53 25 L 53 30 L 58 30 L 58 25 L 63 25 L 63 30 L 67 30 L 67 35" />
      <path d="M 65 80 L 65 55 L 80 55 L 80 80" />
      <path d="M 63 55 L 63 50 L 68 50 L 68 55 L 73 55 L 73 50 L 78 50 L 78 55 L 82 55 L 82 60" />
      <rect x="47" y="45" width="4" height="6" rx="1" />
      <rect x="55" y="45" width="4" height="6" rx="1" />
      <line x1="52" y1="25" x2="52" y2="5" />
      <path d="M 52 5 L 65 10 L 52 15" />
    </svg>
  ),
  "Qatar": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 10 90 L 90 90" />
      <path d="M 25 90 L 25 50 Q 25 15 45 10 L 45 90" />
      <path d="M 28 90 L 28 60 Q 28 25 42 15" />
      <path d="M 45 60 L 55 60 L 55 50 L 65 50 L 65 90" />
      <path d="M 45 70 L 65 70" />
      <path d="M 50 90 L 50 75 L 75 75 L 75 90" />
      <line x1="55" y1="90" x2="55" y2="75" />
      <line x1="60" y1="90" x2="60" y2="75" />
      <line x1="65" y1="90" x2="65" y2="75" />
      <line x1="70" y1="90" x2="70" y2="75" />
      <path d="M 82 90 Q 80 75 83 60" />
      <path d="M 83 60 Q 75 65 78 70" />
      <path d="M 83 60 Q 75 55 77 55" />
      <path d="M 83 60 Q 85 50 88 52" />
      <path d="M 83 60 Q 90 55 92 60" />
      <path d="M 83 60 Q 90 65 88 70" />
    </svg>
  ),
  "Bahrain": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 15 90 L 85 90" />
      <path d="M 25 90 L 40 15 Q 45 45 45 90" />
      <path d="M 75 90 L 60 15 Q 55 45 55 90" />
      <line x1="44" y1="75" x2="56" y2="75" />
      <line x1="42" y1="55" x2="58" y2="55" />
      <line x1="39" y1="35" x2="61" y2="35" />
      <path d="M 50 31 L 50 39 M 46 35 L 54 35" />
      <path d="M 50 51 L 50 59 M 46 55 L 54 55" />
      <path d="M 50 71 L 50 79 M 46 75 L 54 75" />
    </svg>
  ),
  "Kuwait": () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#005A91]" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 20 90 L 80 90" />
      <path d="M 38 90 L 42 10 L 45 10 L 49 90" />
      <circle cx="43.5" cy="60" r="10" fill="white" />
      <circle cx="43.5" cy="30" r="6" fill="white" />
      <path d="M 60 90 L 63 20 L 66 20 L 69 90" />
      <circle cx="64.5" cy="45" r="8" fill="white" />
    </svg>
  )
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="font-space font-bold text-xs text-[#0A2239]">{`${label}`}</p>
        <p className="text-xs font-mono text-[#005A91]">{`Value: $${payload[0].value} Million`}</p>
        {payload[0].payload.label && <p className="text-[10px] text-slate-500">{payload[0].payload.label}</p>}
      </div>
    );
  }
  return null;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedSandLayer, setSelectedSandLayer] = useState(1);
  const [hvacAmbientTemp, setHvacAmbientTemp] = useState(45);
  const [isArabicUi, setIsArabicUi] = useState(true);
  const [activeUiModule, setActiveUiModule] = useState('climate');
  const [activeGlossaryTab, setActiveGlossaryTab] = useState("Economics & Business");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const sectionsRef = {
    overview: useRef(null),
    rvStrategy: useRef(null),
    marketMetrics: useRef(null),
    gccNetwork: useRef(null),
    engineering: useRef(null),
    nevCv: useRef(null),
    charging: useRef(null),
    motorhomeUpgrades: useRef(null),
    glossary: useRef(null)
  };

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const mapY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // 3D Hover Tracking for Chapter 5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [75, 45]); 
  const rotateZ = useTransform(mouseX, [-300, 300], [-30, -60]); 
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springZ = useSpring(rotateZ, { stiffness: 100, damping: 30 });

  // 3D Parallax for Hero Image
  const heroParallaxX = useTransform(mouseX, [-300, 300], [20, -20]);
  const heroParallaxY = useTransform(mouseY, [-300, 300], [20, -20]);
  const heroSpringX = useSpring(heroParallaxX, { stiffness: 50, damping: 20 });
  const heroSpringY = useSpring(heroParallaxY, { stiffness: 50, damping: 20 });
  const heroRotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const heroRotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove3D = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleTouchMove3D = (e) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleMouseLeave3D = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      setIsScrolled(window.scrollY > 50);
      for (const [key, ref] of Object.entries(sectionsRef)) {
        if (ref.current) {
          const top = ref.current.offsetTop;
          const height = ref.current.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(key);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (sectionKey) => {
    sectionsRef[sectionKey]?.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionKey);
  };

  const getActiveUiData = () => {
    switch(activeUiModule) {
      case 'climate': return { title: 'Climate Control', arTitle: 'التحكم في المناخ', val: '22°C', arVal: '22° مئوية', icon: <Snowflake size={24}/>, color: 'text-blue-400' };
      case 'water': return { title: 'Water Management', arTitle: 'إدارة المياه', val: 'Tank 55%', arVal: 'الخزان 55%', icon: <Droplets size={24}/>, color: 'text-cyan-400' };
      case 'lighting': return { title: 'Interior Lighting', arTitle: 'الإضاءة الداخلية', val: 'Auto', arVal: 'تلقائي', icon: <Lightbulb size={24}/>, color: 'text-yellow-400' };
      case 'media': return { title: 'Media & Audio', arTitle: 'الوسائط والصوت', val: 'Active', arVal: 'نشط', icon: <Music size={24}/>, color: 'text-purple-400' };
      case 'power': return { title: 'Power System', arTitle: 'نظام الطاقة', val: '98%', arVal: '98%', icon: <BatteryCharging size={24}/>, color: 'text-emerald-400' };
      default: return { title: '', arTitle: '', val: '', arVal: '' };
    }
  };

  return (
    <div className="bg-blueprint text-[#263238] font-inter min-h-screen relative overflow-x-hidden selection:bg-[#005A91] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Global Ambient Glows */}
      <div className="glow-orb w-[600px] h-[600px] bg-[#005A91] top-[-10%] left-[-10%] mix-blend-multiply"></div>
      <div className="glow-orb w-[800px] h-[800px] bg-[#4E7FA3] top-[40%] right-[-20%] mix-blend-multiply opacity-20"></div>

      {/* Top Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005A91] to-[#7DD3FC] z-[60] origin-left" 
        style={{ scaleX: scrollYProgress }} 
      />

      {/* Floating Dot Navigation (Desktop) */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
        {NAV_ITEMS.map((nav) => (
          <div key={nav.id} className="relative group flex items-center justify-end">
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 font-space text-[10px] uppercase tracking-widest text-[#0A2239] font-bold bg-white/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm whitespace-nowrap pointer-events-none">
              {nav.label}
            </span>
            <button
              onClick={() => navigateTo(nav.id)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSection === nav.id ? 'bg-[#005A91] scale-150' : 'bg-[#005A91]/20 hover:bg-[#005A91]/50'}`}
            />
          </div>
        ))}
      </div>

      {/* STICKY NAV */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-panel border-b border-[#D8E1E7]/50 py-2 shadow-sm' : 'bg-transparent py-4'}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A2239] to-[#005A91] text-white flex items-center justify-center font-space font-bold rounded shadow-[0_4px_10px_rgba(0,90,145,0.3)] hover:scale-105 transition-transform cursor-pointer">S</div>
            <div>
              <span className="font-space font-bold text-sm tracking-widest text-[#0A2239] uppercase block leading-tight">SAHIYOO × GCC</span>
              <span className="text-[9px] font-space text-[#005A91] tracking-widest uppercase block leading-tight">EXPANSION 2026</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((nav) => (
              <button
                key={nav.id}
                onClick={() => navigateTo(nav.id)}
                className={`text-[11px] xl:text-xs font-space tracking-wide uppercase px-3 py-1.5 rounded-full transition-all duration-300 ${activeSection === nav.id ? 'bg-[#0A2239] text-white font-medium shadow-[0_4px_15px_rgba(10,34,57,0.3)] transform -translate-y-0.5' : 'text-[#4E7FA3] hover:text-[#0A2239] hover:bg-white/50 hover:shadow-sm'}`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] xl:text-xs text-emerald-700 glass-panel px-3 py-1.5 rounded-full font-medium font-mono uppercase tracking-wider hover:shadow-lg transition-all cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></span>
              ISO T3 Certified
            </span>
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass-panel text-[#0A2239] shadow-sm hover:bg-white/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 glass-panel-dark flex flex-col items-center justify-center pt-16 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-center">
              {NAV_ITEMS.map((nav, i) => (
                <motion.button
                  key={nav.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  onClick={() => {
                    navigateTo(nav.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`font-space text-2xl uppercase tracking-widest py-2 transition-colors ${activeSection === nav.id ? 'text-[#7DD3FC] font-bold' : 'text-white/70 hover:text-white'}`}
                >
                  {nav.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAPTER 00 - HERO COVER */}
      <section 
        ref={sectionsRef.overview} 
        id="overview" 
        className="relative min-h-[90vh] flex items-center py-16 px-4 overflow-hidden perspective-1000"
        onMouseMove={handleMouseMove3D}
        onMouseLeave={handleMouseLeave3D}
      >
        <motion.div style={{ y: mapY }} className="absolute inset-0 bg-cover bg-center opacity-[0.03] pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 1000 1000" className="w-[120%] h-[120%] text-[#005A91] fill-current">
                <path d="M400 300 Q500 200 600 350 T800 500 Q750 700 600 800 T300 700 Q200 500 400 300 Z" opacity="0.5"/>
            </svg>
        </motion.div>
        
        {/* Floating Particles */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[10%] w-3 h-3 rounded-full bg-[#005A91]/20 blur-sm"></motion.div>
        <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[60%] right-[15%] w-4 h-4 rounded-full bg-[#4E7FA3]/30 blur-sm"></motion.div>

        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#005A91]/20 pointer-events-none rounded-tl-xl"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#005A91]/20 pointer-events-none rounded-br-xl"></div>

        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ y: heroY }} className="px-4">
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 mb-8">
              <img src="/assets/RV%20Bin%20Lahej%20logo%201.webp" alt="RV Bin Lahej Logo" className="h-12 md:h-14 object-contain drop-shadow-sm" />
              <div className="h-8 w-px bg-[#005A91]/20 hidden sm:block"></div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#005A91] animate-pulse"></span>
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#0A2239]">Interactive Executive Briefing</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-space text-6xl md:text-8xl font-bold text-[#0A2239] leading-[1.05] mb-6 tracking-tight drop-shadow-sm">
              Strategic GCC <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005A91] to-[#4E7FA3] drop-shadow-md">Expansion 2026</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="font-space text-lg text-[#4E7FA3] font-medium mb-10 border-l-4 border-[#005A91] pl-5 max-w-xl bg-gradient-to-r from-white/50 to-transparent py-2">
              RV Modification Engineering & Commercial NEV Fleet Deployment Action Plan
            </motion.p>
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,90,145,0.2)] group cursor-default">
                <span className="text-[10px] font-space uppercase text-[#4E7FA3] font-bold tracking-wider block mb-2 group-hover:text-[#005A91] transition-colors">Prepared For</span>
                <p className="text-sm font-bold text-[#0A2239]">SAHIYOO (Socare Life Group)</p>
                <p className="text-xs text-gray-500 mt-1">Executive & Engineering Delegation</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,90,145,0.2)] group cursor-default">
                <span className="text-[10px] font-space uppercase text-[#4E7FA3] font-bold tracking-wider block mb-2 group-hover:text-[#005A91] transition-colors">Mission Window</span>
                <p className="text-sm font-bold text-[#0A2239]">June 8, 2026</p>
                <p className="text-xs text-gray-500 mt-1">Strategic Regional Deployment</p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="hidden lg:block w-full perspective-1000">
            <motion.img 
              src="/assets/11_rv_lineart_silhouette_blue.webp" 
              alt="Strategic RV Silhouette" 
              className="w-full h-auto object-contain mix-blend-multiply opacity-90 drop-shadow-2xl translate-x-12 scale-125 transition-transform" 
              style={{ x: heroSpringX, y: heroSpringY, rotateX: heroRotateX, rotateY: heroRotateY }}
            />
          </motion.div>
        </div>
      </section>

      {/* EXECUTIVE SNAPSHOT METRICS */}
      <section className="glass-panel-dark text-white py-12 relative z-20 border-y border-[#4E7FA3]/30">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {[
              { val: "11", label: "RV Units Confirmed" },
              { val: "$4.05B", label: "Regional CV Scale 2031" },
              { val: "35,000", label: "Charging Node Gap" },
              { val: "June 8", label: "Mission Window" }
            ].map((stat, i) => (
              <div key={i} className="p-4 transition-transform duration-500 hover:-translate-y-2 hover:scale-105 cursor-default group">
                <span className="font-space text-4xl md:text-5xl font-bold text-white block mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:text-blue-200 transition-colors">{stat.val}</span>
                <span className="text-[10px] md:text-xs font-space text-[#7DD3FC] uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 02 & 03 - STRATEGY & METRICS */}
      <section ref={sectionsRef.rvStrategy} id="rvStrategy" className="py-24 px-4 border-b blueprint-line relative">
        <div className="glow-orb w-[500px] h-[500px] bg-[#005A91] top-[20%] left-[-10%] mix-blend-multiply opacity-10"></div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3 drop-shadow-sm">CHAPTERS 02 & 03</span>
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] leading-tight mb-4">Partnership Baseline & Growth Metrics</h2>
          </motion.div>

          {/* Interactive Timeline with properly aligned dots and draw animation */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full relative px-6 md:px-8 py-16 mb-20 glass-panel rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            <span className="absolute top-6 left-8 text-[10px] font-space font-bold text-[#005A91] uppercase tracking-widest bg-blue-50/50 px-3 py-1 rounded-full">Mission Progression Timeline</span>
            
            <div className="relative mt-16 max-w-5xl mx-auto px-4">
              {/* Animated Connecting Line (Desktop) */}
              <div className="hidden md:block absolute left-[12.5%] right-[12.5%] top-[22px] h-1 bg-slate-200/50 rounded-full z-0"></div>
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="hidden md:block absolute left-[12.5%] right-[12.5%] top-[22px] h-1 bg-gradient-to-r from-[#D8E1E7] via-[#005A91] to-[#0A2239] origin-left rounded-full z-0"
              />
              
              {/* Animated Connecting Line (Mobile) */}
              <div className="block md:hidden absolute left-[22px] top-[5%] bottom-[5%] w-1 bg-slate-200/50 rounded-full z-0"></div>
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="block md:hidden absolute left-[22px] top-[5%] bottom-[5%] w-1 bg-gradient-to-b from-[#D8E1E7] via-[#005A91] to-[#0A2239] origin-top rounded-full z-0"
              />

              <div className="flex flex-col md:flex-row justify-between w-full relative z-10">
              {[
                { title: "Foundation (2025)", sub: "Exclusive GCC Rights", isFinal: false },
                { title: "Performance (Dec 2025)", sub: "Targets Exceeded", isFinal: false },
                { title: "Momentum (2026)", sub: "11-unit advance order", isFinal: false },
                { title: "Jun 2026 Mission Hub", sub: "Strategic Deployment", isFinal: true }
              ].map((node, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.3 }}
                  className="flex flex-row md:flex-col items-center md:items-center relative z-10 w-full md:w-1/4 mb-10 md:mb-0 group cursor-default"
                >
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-transparent relative z-10">
                     {node.isFinal ? (
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#005A91] to-[#0A2239] border-[3px] border-white shadow-[0_0_20px_rgba(0,90,145,0.5)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 relative">
                          <div className="absolute inset-0 rounded-full border-2 border-[#005A91] animate-ping opacity-40"></div>
                       </div>
                     ) : (
                       <div className="w-6 h-6 rounded-full bg-[#0A2239] border-[3px] border-white shadow-[0_0_15px_rgba(10,34,57,0.3)] transition-transform duration-300 group-hover:scale-125"></div>
                     )}
                  </div>
                  
                  <div className="ml-6 md:ml-0 md:mt-6 text-left md:text-center transition-transform duration-300 group-hover:-translate-y-2">
                    <span className={`font-space font-bold block px-4 py-1 rounded-full bg-white/60 backdrop-blur-sm shadow-sm ${node.isFinal ? 'text-[#005A91] text-[13px] uppercase tracking-widest' : 'text-[#0A2239] text-[13px]'}`}>
                      {node.title}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">{node.sub}</span>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </motion.div>

          {/* Area Chart Implementation with Glassmorphism */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-panel rounded-3xl overflow-hidden p-8 lg:p-10 h-[450px] transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,90,145,0.15)] relative">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <span className="text-[11px] font-space uppercase text-[#0A2239] tracking-widest font-bold block bg-white/50 px-3 py-1 rounded-md">RV Market Value Growth Projection (USD Millions)</span>
              <div className="flex gap-4 text-[11px] font-mono font-bold text-white bg-[#0A2239] px-4 py-1.5 rounded-full shadow-md">
                <span>CAGR: 5.2%</span>
                <span>TARGET: $155.2M (2030)</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={RV_MARKET_GROWTH_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005A91" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#005A91" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'Space Grotesk', fill: '#4E7FA3' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Space Grotesk', fill: '#4E7FA3' }} axisLine={false} tickLine={false} unit="M" dx={-10} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#005A91', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Area type="monotone" dataKey="value" stroke="#0A2239" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 8, fill: '#005A91', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Country-Level Market Characteristics Grid */}
        </div>
      </section>

      <section ref={sectionsRef.marketMetrics} id="marketMetrics" className="py-24 px-4 border-b blueprint-line relative bg-white">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKET_METRICS.map((metric, idx) => {
              const Icon = CountryIcons[metric.territory] || (() => <Activity size={24} />);
              return (
                <motion.div key={idx} variants={fadeInUp} className="glass-panel p-6 rounded-2xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(0,90,145,0.2)] bg-white/70 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#005A91]/20 group-hover:bg-[#005A91] group-hover:text-white transition-colors duration-300 text-[#005A91] shadow-sm">
                      <div className="w-5 h-5"><Icon /></div>
                    </div>
                    <h4 className="font-space font-bold text-lg text-[#0A2239]">{metric.territory}</h4>
                  </div>
                  <p className="text-sm text-slate-600 font-inter leading-relaxed">{metric.char}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CHAPTER 04 - DEALERSHIP NETWORK */}
      <section ref={sectionsRef.gccNetwork} id="gccNetwork" className="py-24 px-4 border-b blueprint-line max-w-[1440px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <motion.div variants={fadeInUp} className="lg:col-span-4">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">CHAPTER 04</span>
            <h2 className="font-space text-4xl font-bold text-[#0A2239] leading-tight mb-6">Competitor Vulnerabilities & GCC Dealership Network</h2>
            <div className="glass-panel border-l-4 border-l-red-500 p-6 rounded-2xl relative shadow-md mt-8 transition-transform duration-500 hover:-translate-y-2">
              <span className="text-xs font-space font-bold text-red-700 uppercase tracking-widest block mb-3">Legacy Western Imports Failure Modes</span>
              <p className="text-sm text-slate-700 leading-relaxed font-inter mb-4">
                Structural fiberglass delamination under intense UV indexes; T1-rated HVAC compressor collapse above 43°C ambient; critical engine cooling failures under sand dune load.
              </p>
              <span className="text-[10px] font-mono text-red-800 bg-red-50 px-2 py-1 rounded">Thor • Forest River • Airstream • Coachmen</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-8 glass-panel rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,90,145,0.15)]">
            <div className="p-6 bg-[#0A2239]/95 backdrop-blur text-white flex justify-between items-center border-b border-white/10">
              <h3 className="font-space text-sm font-bold uppercase tracking-wider">Pan-GCC B2B Dealership & Distribution Network Matrix</h3>
            </div>
            
            {/* Mobile Scroll Hint */}
            <div className="md:hidden bg-[#F4F7F9] py-2.5 px-4 text-center border-b border-[#D8E1E7] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#005A91]/5 to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
               <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#005A91] flex items-center justify-center gap-2 relative z-10 opacity-80">
                 <ChevronRight size={12} className="rotate-180" /> Swipe horizontally to view full matrix <ChevronRight size={12} />
               </span>
            </div>

            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-[#4E7FA3] font-space font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-5 border-r border-slate-200 w-[15%]">Territory</th>
                    <th className="p-5 border-r border-slate-200 w-[40%]">Key B2B Players / Showrooms</th>
                    <th className="p-5">Logistics Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DEALERSHIP_NETWORK.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/80 transition-colors group cursor-default">
                      <td className="p-5 font-space font-bold text-[#0A2239] border-r border-slate-200 group-hover:text-[#005A91] transition-colors">{row.territory}</td>
                      <td className="p-5 text-slate-700 font-medium border-r border-slate-200 leading-relaxed">{row.players}</td>
                      <td className="p-5 text-slate-600 font-inter leading-relaxed">{row.logistics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CHAPTER 05 - PARTICULATE DEFENSE (3D INTERACTIVE MOUSE PARALLAX) */}
      <section ref={sectionsRef.engineering} id="engineering" className="py-32 px-4 relative border-b blueprint-line overflow-hidden">
        <div className="glow-orb w-[600px] h-[600px] bg-[#38BDF8] top-[10%] right-[-10%] mix-blend-multiply opacity-10"></div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">CHAPTER 05</span>
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] mb-4">Particulate Defense & Sand-Proofing</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text & Info */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="glass-panel p-10 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(0,90,145,0.15)]">
                <span className="text-xs font-mono text-[#005A91] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest block mb-6 w-fit">Interactive Spec Explorer</span>
                <h3 className="font-space text-3xl font-bold text-[#0A2239] mb-4 leading-tight min-h-[80px]">
                  {SAND_PROTECTION_LAYERS.find(l => l.id === selectedSandLayer)?.name}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-inter relative z-10 min-h-[80px]">
                  {SAND_PROTECTION_LAYERS.find(l => l.id === selectedSandLayer)?.role}
                </p>
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3 text-[11px] font-mono text-[#4E7FA3] font-bold">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005A91] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#005A91]"></span>
                  </span>
                  HOVER OVER 4 STRUCTURAL LAYERS TO INSPECT
                </div>
              </div>

              {/* 4 Icon Blocks */}
              <div className="grid grid-cols-2 gap-5">
                 {[
                   { icon: <Shield/>, title: "Body Shielding" },
                   { icon: <Wind/>, title: "Sand-Proofing" },
                   { icon: <Sun/>, title: "UV Protection" },
                   { icon: <ShieldAlert/>, title: "Glass Hardening" }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center gap-4 p-5 glass-panel rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#005A91]/40 cursor-default">
                      <div className="text-[#005A91] p-2.5 bg-white rounded-lg shadow-sm">{item.icon}</div>
                      <span className="text-[12px] font-space font-bold uppercase leading-tight text-[#0A2239]">{item.title}</span>
                   </div>
                 ))}
              </div>

              {/* Body Shielding Warning */}
              <div className="mt-8 glass-panel p-6 rounded-2xl border-l-4 border-red-500 relative overflow-hidden group shadow-md transition-all duration-300 hover:shadow-lg bg-red-50/30">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/40 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="flex items-center gap-3 mb-3 relative z-10">
                    <ShieldAlert size={20} className="text-red-500"/>
                    <h4 className="font-space font-bold text-red-700 uppercase tracking-wider text-[13px]">Body Shielding & Paint Erosion Warning</h4>
                 </div>
                 <p className="text-sm text-slate-700 font-inter leading-relaxed relative z-10 text-justify">
                    Pervasive regional sandstorms and prolonged deep-desert overlanding act as a high-velocity abrasive force that actively strips away standard automotive clear-coats and paint layers. Integrating a specialized, <strong className="text-red-600">military-grade anti-abrasive sand-resistant coating</strong> and high-solids ceramic clear-coat is a mandatory factory requirement; failure to install this specific shielding will cause rapid paint erosion, surface abrasion, and bare metal body exposure during autonomous transit.
                 </p>
              </div>

              {/* Glass Hardening Notice */}
              <div className="mt-6 glass-panel p-6 rounded-2xl border-l-4 border-[#38BDF8] relative overflow-hidden group shadow-md transition-all duration-300 hover:shadow-lg">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/60 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="flex items-center gap-3 mb-3 relative z-10">
                    <ShieldAlert size={20} className="text-[#38BDF8]"/>
                    <h4 className="font-space font-bold text-[#0A2239] uppercase tracking-wider text-[13px]">Glass Hardening</h4>
                 </div>
                 <p className="text-sm text-slate-600 font-inter leading-relaxed relative z-10 text-justify">
                    UV-rejecting tinted laminates executing <strong className="text-[#005A91]">≥95% UVA/UVB blockage</strong> on all structural windshields and habitation windows to shield interior finishes from solar degradation.
                 </p>
              </div>
            </motion.div>

            {/* Right: 3D CSS Interactive Layers Stack */}
            <motion.div 
              variants={fadeInUp} 
              className="relative h-[450px] md:h-[600px] flex items-center justify-center perspective-1000 group"
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              onTouchMove={handleTouchMove3D}
              onTouchEnd={handleMouseLeave3D}
            >
               {/* Invisible overlay to catch mouse/touch events smoothly across the whole area */}
               <div className="absolute inset-0 z-50 cursor-crosshair"></div>
               
               <motion.div 
                 className="relative w-64 h-64 md:w-80 md:h-80 preserve-3d transition-transform duration-200" 
                 style={{ rotateX: springX, rotateZ: springZ }}
               >
                  {/* Using only the top 4 structural layers */}
                  {SAND_PROTECTION_LAYERS.slice(0, 4).reverse().map((layer, index) => {
                     const isSelected = selectedSandLayer === layer.id;
                     const zIndexOffset = isSelected ? 40 : 0;
                     return (
                       <div 
                         key={layer.id}
                         className={`absolute inset-0 iso-layer border-2 shadow-2xl backdrop-blur-md flex items-center justify-center rounded-xl pointer-events-none
                           ${isSelected ? 'border-[#0A2239]' : 'border-white/60'}
                         `}
                         style={{
                            transform: `translateZ(${(index * 50) + zIndexOffset}px) scale(${window.innerWidth < 768 ? 0.8 : 1})`,
                            backgroundColor: layer.color + (isSelected ? 'F0' : 'A0'),
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease, border-color 0.4s ease'
                         }}
                       >
                         {/* Grid pattern on layer */}
                         <div className="w-full h-full opacity-20 rounded-xl" style={{ backgroundImage: 'linear-gradient(#0A2239 1px, transparent 1px), linear-gradient(90deg, #0A2239 1px, transparent 1px)', backgroundSize: '25px 25px' }}></div>
                       </div>
                     )
                  })}
               </motion.div>
               
               {/* Annotations drawing to the right (Desktop) / Bottom (Mobile) - Interactive Menu */}
               <div className="flex absolute bottom-0 md:bottom-auto right-0 left-0 md:left-auto lg:-right-12 md:top-1/2 md:-translate-y-1/2 flex-wrap md:flex-col gap-2 md:gap-8 w-full md:w-56 z-50 px-4 md:px-0">
                 {SAND_PROTECTION_LAYERS.slice(0, 4).map(layer => (
                    <button 
                      key={layer.id} 
                      onMouseEnter={() => setSelectedSandLayer(layer.id)}
                      onClick={() => setSelectedSandLayer(layer.id)}
                      className={`text-center md:text-left w-[48%] md:w-full transition-all duration-300 focus:outline-none ${selectedSandLayer === layer.id ? 'opacity-100 md:translate-x-0' : 'opacity-40 hover:opacity-70 md:translate-x-4 md:hover:translate-x-2'}`}
                    >
                      <span className={`text-[9px] md:text-[11px] font-space font-bold text-[#0A2239] block text-center md:text-right border-b-2 pb-1.5 uppercase tracking-wide truncate md:whitespace-normal ${selectedSandLayer === layer.id ? 'border-[#005A91]' : 'border-slate-300'}`}>{layer.name}</span>
                    </button>
                 ))}
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CHAPTER 06 - THERMAL ENVELOPE & CHASSIS KINETICS */}
      <section className="py-24 px-4 bg-white border-b blueprint-line relative overflow-hidden">
        {/* Subtle chassis background */}
        <div className="absolute bottom-0 right-0 w-full md:w-[800px] h-[400px] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0A2239 0, #0A2239 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-4xl mx-auto mb-20">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">CHAPTER 06</span>
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] mb-4">Thermal Envelope & Chassis Kinetics</h2>
          </motion.div>

          {/* PART 1: THERMAL ENVELOPE */}
          <div className="mb-12 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#005A91] border border-[#005A91]/20 shadow-sm"><Snowflake size={24}/></div>
             <h3 className="font-space text-3xl font-bold text-[#0A2239]">Thermal Defense Architecture</h3>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24">
            {/* Left: Text Block matching PNG */}
            <motion.div variants={fadeInUp} className="lg:col-span-5">
               <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#005A91] to-[#4E7FA3]"></div>
                  <h4 className="font-space font-bold text-xl text-[#0A2239] mb-6">ISO T3 HVAC vs. T1 Engineering Gap</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-inter mb-6 text-justify">
                    Standard T1-rated air conditioning compressors are strictly limited to <strong className="text-red-600">43°C</strong>; exceeding this temperature triggers extreme refrigerant head-pressure spikes, thermal lockup, and catastrophic cooling failure.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed font-inter text-justify">
                    Shifting to certified <strong>ISO 16358-1 T3</strong> rooftop compressor networks guarantees efficient heat rejection and continuous cooling up to <strong className="text-[#005A91]">52°C</strong> ambient, utilizing enlarged condenser coils, dual-compressor loops, and Micro-Air EasyStart soft starters to suppress Locked Rotor Amps (LRA) voltage spikes by <strong className="text-[#005A91]">65–75%</strong> to protect off-grid inverter loops.
                  </p>
               </div>
            </motion.div>

            {/* Right: RV Schematic with Connected Points */}
            <motion.div variants={fadeInUp} className="lg:col-span-7 relative">
               <div className="flex flex-col md:flex-row items-center gap-8 relative">
                  
                  {/* The Schematic */}
                  <div className="w-full md:w-1/2 opacity-30 pointer-events-none md:scale-[1.3] md:-translate-x-16">
                     <RVSilhouette />
                  </div>

                  {/* The Features List */}
                  <div className="w-full md:w-1/2 flex flex-col gap-6 relative z-10 bg-white/60 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none border md:border-none border-white/50">
                    {[
                      { icon: <Wind size={20}/>, title: "Enlarged Condenser Coils", desc: "Maximum heat rejection efficiency in extreme ambient conditions." },
                      { icon: <Settings size={20}/>, title: "Dual-Compressor Loops", desc: "Balanced load distribution for continuous cooling up to 52°C ambient." },
                      { icon: <Zap size={20}/>, title: "Micro-Air EasyStart Soft Starters", desc: "Suppresses Locked Rotor Amps (LRA) voltage spikes by 65–75%." },
                      { icon: <Shield size={20}/>, title: "Off-Grid Inverter Protection", desc: "Protects inverter loops from LRA-induced stress and system instability." }
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-4 group">
                         <div className="relative shrink-0 mt-1">
                            {/* Connecting Line */}
                            {idx !== 3 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-16 bg-[#005A91]/30 group-hover:bg-[#005A91] transition-colors"></div>}
                            <div className="w-9 h-9 rounded-lg bg-white border-2 border-[#005A91] shadow-sm flex items-center justify-center text-[#005A91] group-hover:bg-[#005A91] group-hover:text-white transition-all duration-300 z-10 relative group-hover:scale-110">
                               {feat.icon}
                            </div>
                         </div>
                         <div className="pt-0 pb-4 group-hover:translate-x-1 transition-transform duration-300">
                            <span className="font-space font-bold text-[14px] text-[#0A2239] block mb-1">{feat.title}</span>
                            <span className="text-[12px] text-slate-500 leading-relaxed block">{feat.desc}</span>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          </motion.div>

          {/* Interactive VS Bar (Upgraded Simulator) */}
          <motion.div variants={fadeInUp} className="glass-panel p-8 rounded-[2rem] shadow-xl w-full flex flex-col lg:flex-row gap-12 items-center mb-32 relative overflow-hidden">
             {/* Left side: Range Slider */}
             <div className="w-full lg:w-1/2 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-space font-bold text-lg uppercase tracking-wider text-[#0A2239]">Ambient Heat Simulator</h3>
                  <span className="text-[10px] font-mono font-bold text-white bg-red-500 px-3 py-1 rounded-full shadow-sm animate-pulse flex items-center gap-2"><Filter size={12}/> LIVE TEST</span>
                </div>
                <div className="flex justify-between items-end mb-4">
                   <span className="text-xs font-mono text-[#4E7FA3] font-bold">Desert Surface Air:</span>
                   <span className="font-space text-5xl font-bold text-[#0A2239] drop-shadow-sm">{hvacAmbientTemp}°C</span>
                </div>
                <input 
                  type="range" min="30" max="55" value={hvacAmbientTemp} 
                  onChange={(e) => setHvacAmbientTemp(parseInt(e.target.value))}
                  className="w-full accent-[#005A91] bg-slate-200 cursor-pointer rounded-full h-4 shadow-inner"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-3 font-mono font-bold px-1">
                  <span>30°</span><span className="text-red-500">43° (T1 Limit)</span><span className="text-emerald-600">52° (T3 Limit)</span><span>55°</span>
                </div>
             </div>

             {/* VS Divider */}
             <div className="hidden lg:flex w-16 h-16 rounded-full bg-[#0A2239] text-white font-space font-bold text-xl items-center justify-center shrink-0 shadow-lg relative z-10 border-4 border-white">
                VS
             </div>

             {/* Right side: Dynamic Results */}
             <div className="w-full lg:w-1/2 space-y-4 relative z-10">
                <div className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${hvacAmbientTemp >= 43 ? 'bg-red-50 border-red-300 shadow-[0_10px_20px_rgba(239,68,68,0.1)]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl ${hvacAmbientTemp >= 43 ? 'bg-red-500' : 'bg-slate-400'}`}>
                      {hvacAmbientTemp >= 43 ? '×' : '−'}
                    </div>
                    <div>
                      <p className="font-space font-bold text-[16px] text-[#0A2239] leading-tight">Standard T1 HVAC</p>
                      <p className={`text-[12px] font-bold ${hvacAmbientTemp >= 43 ? 'text-red-600' : 'text-slate-500'}`}>Fails at 43°C</p>
                    </div>
                  </div>
                  {hvacAmbientTemp >= 43 ? (
                    <span className="text-[11px] font-bold text-white bg-red-600 px-3 py-1.5 rounded-full shadow-sm animate-pulse">CRITICAL TRIP</span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-3 py-1.5 rounded-full">ACTIVE</span>
                  )}
                </div>

                <div className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${hvacAmbientTemp > 52 ? 'bg-orange-50 border-orange-300 shadow-[0_10px_20px_rgba(249,115,22,0.1)]' : 'bg-emerald-50 border-emerald-300 shadow-[0_10px_20px_rgba(16,185,129,0.1)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl ${hvacAmbientTemp > 52 ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                      {hvacAmbientTemp > 52 ? '!' : '✓'}
                    </div>
                    <div>
                      <p className="font-space font-bold text-[16px] text-[#0A2239] leading-tight">Certified T3 HVAC</p>
                      <p className={`text-[12px] font-bold ${hvacAmbientTemp > 52 ? 'text-orange-600' : 'text-emerald-700'}`}>Operates to 52°C</p>
                    </div>
                  </div>
                  {hvacAmbientTemp > 52 ? (
                    <span className="text-[11px] font-bold text-white bg-orange-500 px-3 py-1.5 rounded-full shadow-sm">DEGRADED</span>
                  ) : (
                    <span className="text-[11px] font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-full shadow-sm">STABLE COOLING</span>
                  )}
                </div>
             </div>
          </motion.div>

          {/* PART 2: CHASSIS DYNAMICS */}
          <div className="mb-12 flex items-center gap-4 border-t border-[#005A91]/20 pt-16">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#005A91] border border-[#005A91]/20 shadow-sm"><Settings size={24}/></div>
             <h3 className="font-space text-3xl font-bold text-[#0A2239]">Chassis Dynamics & Off-Road Kinetics</h3>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Upgraded Heavy-Duty Suspension System",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 2v20M8 5c-2 0-3 1-3 3s1 3 3 3 3 1 3 3-1 3-3 3M16 5c2 0 3 1 3 3s-1 3-3 3-3 1-3 3 1 3 3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                text: "Factory road-focused suspension setups are entirely inadequate for desert dunes and rocky mountain tracks. Because thick composite walls, expanded freshwater reserves, and massive lithium arrays drastically increase total vehicle curb weight and elevate the center of gravity, the chassis must integrate an upgraded, heavy-duty active suspension system (such as LiquidSpring compressible-fluid systems). This system dynamically eliminates dangerous body roll, cross-axle stress, and torsional frame twisting on corrugated wadis, replacing vulnerable external hydraulic leveling jacks that easily sink into soft sand."
              },
              {
                title: "Mechanical Bead-Lock Wheels & Off-Road Tires",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                text: "Heavy-duty, high-ply flotation all-terrain tires must be paired with mechanical bead-lock wheels. This physical locking mechanism permits operators to safely deflate tires to 10–15 PSI to exponentially widen the tire footprint for sand flotation, preventing the tire bead from peeling or unseating from the rim during high-torque dune climbing."
              },
              {
                title: "Integrated Onboard Air Compressor System",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><rect x="4" y="12" width="16" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12V4M10 4h4M8 20v2M16 20v2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                text: "Deep-desert transit requires frequent tire deflation and inflation transitions. Chassis configurations must incorporate an integrated, high-capacity, heavy-duty onboard air compressor system with plug-and-play exterior quick-connect air ports, enabling operators to rapidly re-inflate heavy-ply flotation tires back to highway pressures on-site."
              }
            ].map((card, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="glass-panel p-8 rounded-3xl shadow-lg border-t-4 border-[#005A91] transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl bg-white/80 group">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A2239] to-[#005A91] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                    {card.icon}
                 </div>
                 <h4 className="font-space font-bold text-xl text-[#0A2239] mb-4 leading-snug">{card.title}</h4>
                 <p className="text-sm text-slate-600 font-inter leading-relaxed text-justify">
                    {card.text}
                 </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CHAPTER 07 - INTERIOR SANITATION & UI LOCALIZATION */}
      <section className="py-24 px-4 bg-[#F8FAFC] border-b blueprint-line relative">
        <div className="glow-orb w-[700px] h-[700px] bg-[#005A91] top-1/2 left-[20%] -translate-y-1/2 mix-blend-multiply opacity-5"></div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">CHAPTER 07</span>
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] mb-4">Interior Sanitation & UI Localization</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* UI Panel Simulator */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-8">
               <div className="glass-panel rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-transform duration-500 hover:-translate-y-2">
                 <h3 className="font-space font-bold text-[#0A2239] text-2xl mb-4">UI Localization Matrix</h3>
                 <p className="text-sm text-slate-600 leading-relaxed mb-8 font-inter">
                   In-cabin control systems feature an <strong>Arabic-first RTL layout</strong>. Use the simulation panel to toggle the core OS rendering direction.
                 </p>
                 
                 <div className="glass-panel-dark text-white p-8 rounded-2xl relative w-full mb-10 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                       <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></span>
                       <button onClick={() => setIsArabicUi(!isArabicUi)} className="bg-white/10 hover:bg-white/20 text-[10px] font-mono tracking-widest text-slate-200 px-4 py-1.5 rounded-full transition-all border border-white/20 hover:border-white/40 flex items-center gap-2">
                         <Settings size={12}/>
                         {isArabicUi ? 'SYSTEM: ENG (LTR)' : 'SYSTEM: AR (RTL)'}
                       </button>
                    </div>
                    <div className="text-center py-6 relative z-10" dir={isArabicUi ? 'rtl' : 'ltr'}>
                       <motion.div 
                         key={activeUiModule}
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className={`inline-flex p-6 rounded-full bg-white/5 backdrop-blur-md mb-6 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${getActiveUiData().color}`}
                       >
                          {getActiveUiData().icon}
                       </motion.div>
                       <h4 className="font-space font-bold text-2xl mb-3 tracking-wide">{isArabicUi ? getActiveUiData().arTitle : getActiveUiData().title}</h4>
                       <span className="text-4xl font-mono text-white/90 drop-shadow-md">{isArabicUi ? getActiveUiData().arVal : getActiveUiData().val}</span>
                    </div>
                 </div>

                 <div className="flex justify-between max-w-sm mx-auto relative z-10 px-2">
                    {[
                      { id: 'climate', icon: <Snowflake/>, label: 'Climate' },
                      { id: 'water', icon: <Droplets/>, label: 'Water' },
                      { id: 'lighting', icon: <Lightbulb/>, label: 'Lighting' },
                      { id: 'media', icon: <Music/>, label: 'Media' },
                      { id: 'power', icon: <BatteryCharging/>, label: 'Power' },
                    ].map(module => (
                       <div key={module.id} className="flex flex-col items-center gap-3 circuit-line group">
                          <button 
                            onClick={() => setActiveUiModule(module.id)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${activeUiModule === module.id ? 'bg-[#0A2239] text-white border-[#0A2239] scale-110 shadow-[0_10px_20px_rgba(10,34,57,0.3)]' : 'bg-white text-[#0A2239] border-[#D8E1E7] hover:border-[#0A2239] hover:-translate-y-1 hover:shadow-md'}`}
                          >
                             {module.icon}
                          </button>
                       </div>
                    ))}
                 </div>
               </div>

               {/* AI Voice Assistant Block */}
               <div className="glass-panel-dark text-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-white/10 transition-transform duration-500 hover:-translate-y-2">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#005A91]/40 blur-3xl rounded-full group-hover:bg-[#38BDF8]/30 transition-colors duration-700"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div>
                        <h4 className="font-space font-bold text-lg mb-2 flex items-center gap-2">
                           <Music size={18} className="text-[#38BDF8]"/> AI Voice Assistant
                        </h4>
                        <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-widest bg-[#38BDF8]/10 px-2 py-1 rounded border border-[#38BDF8]/20">Natively Arabic</span>
                     </div>
                     
                     {/* Animated Audio Waveform */}
                     <div className="flex items-center gap-1.5 h-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <motion.div 
                              key={i}
                              animate={{ height: ["20%", "100%", "20%"] }}
                              transition={{ repeat: Infinity, duration: 1 + i*0.2, ease: "easeInOut" }}
                              className="w-1.5 bg-[#38BDF8] rounded-full"
                           />
                        ))}
                     </div>
                  </div>

                  <p className="text-sm text-slate-300 font-inter leading-relaxed relative z-10 border-t border-white/10 pt-5 text-justify">
                     In-cabin control systems must integrate advanced AI voice assistants engineered to natively process and respond in the Arabic language, enabling hands-free control of environmental, lighting, and entertainment systems.
                  </p>
               </div>
            </motion.div>

            {/* SVG Tank Schematic */}
            <motion.div variants={fadeInUp} className="lg:col-span-7 glass-panel rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative flex flex-col transition-transform duration-500 hover:-translate-y-2 group">
               <div className="flex justify-between items-start mb-6">
                  <h4 className="font-space font-bold text-[11px] uppercase text-[#005A91] bg-white border border-[#D8E1E7] px-4 py-1.5 rounded-full tracking-widest inline-block shadow-sm">Sanitation Architecture</h4>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#005A91]"></span>
                  </span>
               </div>
               
               <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-inner border border-[#D8E1E7] cursor-crosshair">
                  {/* Background Blueprint Image */}
                  <div 
                     className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-95 transition-transform duration-700 group-hover:scale-[1.02]"
                     style={{ backgroundImage: "url('/assets/rv_sanitation.webp')" }}
                  />

                  {/* Interactive Overlay SVG for Pipes */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet">
                     {/* Flowing Water Animation Definitions */}
                     <defs>
                       <linearGradient id="blackWaterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2"/>
                         <stop offset="50%" stopColor="#005A91" stopOpacity="1"/>
                         <stop offset="100%" stopColor="#0A2239" stopOpacity="0.8"/>
                       </linearGradient>
                       <linearGradient id="greyWaterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.2"/>
                         <stop offset="50%" stopColor="#D97706" stopOpacity="1"/>
                         <stop offset="100%" stopColor="#92400E" stopOpacity="0.8"/>
                       </linearGradient>
                     </defs>

                     {/* Black Water Pipes Overlay (Animated) */}
                     {/* Coordinates approximated to match the plumbing in the sketch */}
                     <path d="M 430 380 L 430 480 L 370 480 L 370 560" fill="none" stroke="url(#blackWaterFlow)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse opacity-90 drop-shadow-md" strokeDasharray="12 12">
                        <animate attributeName="stroke-dashoffset" from="48" to="0" dur="1s" repeatCount="indefinite" />
                     </path>
                     <path d="M 280 480 L 370 480" fill="none" stroke="url(#blackWaterFlow)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse opacity-70" strokeDasharray="8 8">
                        <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.5s" repeatCount="indefinite" />
                     </path>

                     {/* Grey Water Pipes Overlay (Animated) */}
                     <path d="M 660 380 L 660 560" fill="none" stroke="url(#greyWaterFlow)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse opacity-90 drop-shadow-md" strokeDasharray="12 12">
                        <animate attributeName="stroke-dashoffset" from="48" to="0" dur="1s" repeatCount="indefinite" />
                     </path>
                     <path d="M 760 480 L 660 480" fill="none" stroke="url(#greyWaterFlow)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse opacity-70" strokeDasharray="8 8">
                        <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.5s" repeatCount="indefinite" />
                     </path>
                  </svg>

                  {/* Interactive Hover Hotspots for Tanks */}
                  <div className="absolute inset-0 pointer-events-auto z-20">
                     {/* Black Water Hotspot */}
                     <div className="absolute left-[30%] top-[70%] w-[20%] h-[20%] group/tank cursor-pointer">
                        <div className="absolute inset-0 bg-[#005A91]/10 rounded-xl border border-[#005A91]/40 opacity-0 group-hover/tank:opacity-100 transition-all duration-300 backdrop-blur-[2px]"></div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#D8E1E7] opacity-0 group-hover/tank:opacity-100 group-hover/tank:-translate-y-2 transition-all duration-300 pointer-events-none">
                           <span className="block font-space font-bold text-[#005A91] text-[11px] uppercase tracking-widest mb-1.5">Black Water (Sewage)</span>
                           <span className="block font-inter text-xs text-slate-700 leading-relaxed">Permanent structural sewage holding tank. High-capacity, leak-proof chassis integration rejecting manual cassettes.</span>
                        </div>
                     </div>

                     {/* Grey Water Hotspot */}
                     <div className="absolute left-[54%] top-[70%] w-[20%] h-[20%] group/tank cursor-pointer">
                        <div className="absolute inset-0 bg-[#D97706]/10 rounded-xl border border-[#D97706]/40 opacity-0 group-hover/tank:opacity-100 transition-all duration-300 backdrop-blur-[2px]"></div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#D8E1E7] opacity-0 group-hover/tank:opacity-100 group-hover/tank:-translate-y-2 transition-all duration-300 pointer-events-none">
                           <span className="block font-space font-bold text-[#D97706] text-[11px] uppercase tracking-widest mb-1.5">Grey Water (Sullage)</span>
                           <span className="block font-inter text-xs text-slate-700 leading-relaxed">Sullage tank routing kitchen and shower runoff. Features advanced anti-odor traps and high-flow external drainage ports.</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-6 bg-[#F3F6F8] p-5 rounded-xl border border-[#D8E1E7] text-sm text-[#0A2239] leading-relaxed font-inter text-center">
                 Regional GCC and premium buyers completely reject standard, manual pull-out cassette toilets. Factory assembly lines must natively integrate permanent, high-capacity onboard <strong>Black Water</strong> and <strong>Grey Water</strong> holding tanks plumbed onto the structural chassis.
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CHAPTER 08 - NEV MARKET INTELLIGENCE */}
      <section ref={sectionsRef.nevCv} id="nevCv" className="py-32 px-4 bg-white border-b blueprint-line relative">
         <div className="max-w-[1440px] mx-auto relative z-10">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
               <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">CHAPTER 08</span>
               <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] mb-4">Commercial Vehicle & NEV Intelligence</h2>
            </motion.div>

            {/* KPI Cards */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24 text-center">
              {[
                { val: "$4.05B", label: "CV Hub by 2031" },
                { val: "7.51%", label: "Segment CAGR" },
                { val: "78.33%", label: "BEV Truck Share" },
                { val: "7.56%", label: "Heavy FCEV CAGR" }
              ].map((kpi, i) => (
                <div key={i} className="glass-panel p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,90,145,0.15)] group">
                   <span className="font-space text-4xl lg:text-5xl font-bold text-[#0A2239] block mb-3 group-hover:text-[#005A91] transition-colors">{kpi.val}</span>
                   <span className="text-[11px] font-space uppercase text-slate-500 tracking-wider font-bold block">{kpi.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Floating Nodes Recreated via CSS */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative max-w-6xl mx-auto mb-20">
               <div className="hidden lg:block absolute top-[4.5rem] left-32 right-32 h-0.5 bg-gradient-to-r from-transparent via-[#005A91]/30 to-transparent"></div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  {[
                    { id: 1, icon: <Bus size={48} strokeWidth={1.5}/>, title: "Urban Electric Buses & City Coaches", badge: "CAGR 7.55%", color: "text-[#005A91]", borderColor: "border-[#005A91]" },
                    { id: 2, icon: <Truck size={48} strokeWidth={1.5}/>, title: "Logistics Fleet Truck BEV Layouts", badge: "78.33% SHARE", color: "text-[#0A2239]", borderColor: "border-[#0A2239]" },
                    { id: 3, icon: <Fuel size={48} strokeWidth={1.5}/>, title: "Heavy Long-Haul FCEV Pipelines", badge: "CAGR 7.56%", color: "text-[#4E7FA3]", borderColor: "border-[#4E7FA3]", extra: <span className="absolute right-0 top-3 bg-white border-2 border-[#4E7FA3] text-[12px] font-bold px-2 rounded-md">H₂</span> }
                  ].map((node) => (
                    <motion.div key={node.id} variants={fadeInUp} className="text-center relative z-10 group">
                       <div className={`w-36 h-36 mx-auto bg-white border-4 ${node.borderColor} rounded-full flex items-center justify-center mb-8 ${node.color} shadow-[0_15px_35px_rgba(0,0,0,0.1)] relative transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-105`}>
                          {node.icon}
                          {node.extra}
                       </div>
                       <span className={`font-space text-4xl font-bold ${node.color} block mb-3`}>{node.id}.</span>
                       <h4 className="font-space font-bold text-[#0A2239] text-base mb-4 px-4">{node.title}</h4>
                       <span className={`text-[12px] font-mono ${node.color} bg-slate-50 border ${node.borderColor}/20 shadow-sm px-4 py-2 rounded-full inline-block font-bold tracking-wider uppercase`}>{node.badge}</span>
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-[#005A91]/5 to-transparent border-l-4 border-l-[#005A91] p-8 rounded-r-2xl flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto glass-panel transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
               <div className="text-[#005A91] p-6 bg-white rounded-full shadow-[0_10px_20px_rgba(0,90,145,0.15)] flex-shrink-0">
                  <Target size={40} strokeWidth={1.5}/>
               </div>
               <div>
                  <h4 className="font-space font-bold text-[#005A91] uppercase tracking-widest text-sm mb-3">Tactical Target</h4>
                  <p className="text-base text-slate-700 leading-relaxed font-inter">
                     Deploy Dongfeng Special Automobile new energy transit portfolios to secure immediate entry points within expanding municipal transport networks across the Gulf — including the RTA Dubai bus electrification track and ADNOC commercial fleet conversion roadmap.
                  </p>
               </div>
            </motion.div>
         </div>
      </section>

      {/* CHAPTER 09 - CHARGING INFRASTRUCTURE */}
      <section ref={sectionsRef.charging} id="charging" className="py-24 px-4 bg-white border-b blueprint-line relative">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <motion.div variants={fadeInUp} className="text-center max-w-4xl mx-auto mb-16">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">CHAPTER 09</span>
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] mb-4">B2B Ecosystem &<br/>Regional Charging Infrastructure</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
             {/* Top Left: Fleet Entity Table & Pills */}
             <div className="lg:col-span-5 flex flex-col gap-6">
                <motion.div variants={fadeInUp} className="glass-panel rounded-xl overflow-hidden shadow-sm border border-[#D8E1E7]">
                   <table className="w-full text-left text-[13px]">
                      <thead>
                         <tr className="bg-[#0A2239] text-white font-space font-bold">
                            <th className="p-4 border-r border-[#ffffff20] w-[40%]">Fleet Entity Node</th>
                            <th className="p-4">Regional Distribution & Fleet Focus Footprint</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D8E1E7] font-inter text-[#263238]">
                         <tr className="bg-white">
                            <td className="p-4 font-bold border-r border-[#D8E1E7]">Al-Futtaim FAMCO</td>
                            <td className="p-4 leading-relaxed">Heavy-duty electric logistics configurations, transit fleets, regional networks.</td>
                         </tr>
                         <tr className="bg-white">
                            <td className="p-4 font-bold border-r border-[#D8E1E7]">Al Rostamani<br/><span className="text-[11px] font-normal text-slate-500">(United Diesel)</span></td>
                            <td className="p-4 leading-relaxed">Turn-key commercial truck leasing, bundle assets, corporate fleet operations.</td>
                         </tr>
                         <tr className="bg-white">
                            <td className="p-4 font-bold border-r border-[#D8E1E7]">Al Naboodah / Gargash / Belhasa</td>
                            <td className="p-4 leading-relaxed">Institutional procurement frameworks handling large-scale public contracts.</td>
                         </tr>
                      </tbody>
                   </table>
                </motion.div>

                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="glass-panel p-5 rounded-xl border border-[#D8E1E7] flex items-center gap-4 bg-white hover:-translate-y-1 transition-transform group cursor-default shadow-sm">
                      <div className="w-12 h-12 rounded-full border border-[#D8E1E7] flex items-center justify-center shrink-0 text-[#0A2239] group-hover:border-[#005A91] group-hover:bg-blue-50 transition-colors"><Layers size={20}/></div>
                      <div>
                         <h5 className="font-space font-bold text-[#005A91] text-[13px] mb-1">Strategic Core Portfolios:</h5>
                         <p className="text-[11px] text-[#263238] font-inter">ISUZU Qingling • Dongfeng • Changan Deepal NEV lines.</p>
                      </div>
                   </div>
                   <div className="glass-panel p-5 rounded-xl border border-[#D8E1E7] flex items-center gap-4 bg-white hover:-translate-y-1 transition-transform group cursor-default shadow-sm">
                      <div className="w-12 h-12 rounded-full border border-[#D8E1E7] flex items-center justify-center shrink-0 text-[#0A2239] group-hover:border-[#005A91] group-hover:bg-blue-50 transition-colors"><BarChart2 size={20}/></div>
                      <div>
                         <h5 className="font-space font-bold text-[#005A91] text-[13px] mb-1">Market Benchmark:</h5>
                         <p className="text-[11px] text-[#263238] font-inter">BYD (60% share)<br/>Foton, JAC, Shacman.</p>
                      </div>
                   </div>
                </motion.div>
             </div>

             {/* Top Right: Custom Graphic */}
             <motion.div variants={fadeInUp} className="lg:col-span-7 glass-panel rounded-xl border border-[#D8E1E7] overflow-hidden relative min-h-[400px] group bg-white shadow-inner flex flex-col justify-end">
                {/* Image Background (Cropped to map) */}
                <div className="absolute inset-0 w-full h-full opacity-[0.25] mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" 
                     style={{ 
                        backgroundImage: "url('/assets/charging_map_bg.webp')", 
                        backgroundPosition: "100% 0%", 
                        backgroundSize: "220%" 
                     }}>
                </div>
                
                {/* Gradient Fade to blend image */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

                {/* Animated overlay points matching the map nodes (rough positioning) */}
                <div className="absolute top-[20%] right-[30%] flex items-center justify-center">
                   <span className="absolute w-8 h-8 bg-[#005A91] rounded-full opacity-20 animate-ping"></span>
                   <span className="w-2 h-2 bg-[#005A91] rounded-full"></span>
                </div>
                <div className="absolute top-[35%] right-[55%] flex items-center justify-center">
                   <span className="absolute w-8 h-8 bg-[#005A91] rounded-full opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></span>
                   <span className="w-2 h-2 bg-[#005A91] rounded-full"></span>
                </div>
                
                {/* Complex SVG for Charging Station overlay */}
                <div className="relative z-10 w-full flex items-end justify-center px-4 pb-0">
                   <svg viewBox="0 0 500 250" className="w-full h-auto drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
                       <defs>
                           <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                               <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                               <stop offset="100%" stopColor="#eaf1f6" stopOpacity="0.8" />
                           </linearGradient>
                           <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                               <stop offset="0%" stopColor="#005A91" />
                               <stop offset="100%" stopColor="#0A2239" />
                           </linearGradient>
                       </defs>
                       
                       {/* Ground Grid */}
                       <path d="M 50 200 L 450 200 M 30 220 L 470 220 M 10 240 L 490 240" stroke="#005A91" strokeWidth="0.5" opacity="0.1"/>
                       <path d="M 250 150 L 250 250 M 150 170 L 100 250 M 350 170 L 400 250 M 50 190 L 0 250 M 450 190 L 500 250" stroke="#005A91" strokeWidth="0.5" opacity="0.1"/>

                       {/* Solar Canopy 1 (Right) */}
                       <g transform="translate(260, 10)">
                          {/* Posts */}
                          <rect x="40" y="40" width="6" height="140" fill="url(#glassGrad)" stroke="#0A2239" strokeWidth="1"/>
                          <rect x="160" y="20" width="5" height="160" fill="url(#glassGrad)" stroke="#0A2239" strokeWidth="1"/>
                          {/* Roof */}
                          <polygon points="10,40 140,20 230,30 80,50" fill="url(#glassGrad)" stroke="#0A2239" strokeWidth="1.5" strokeLinejoin="round"/>
                          <polygon points="10,35 140,15 230,25 80,45" fill="none" stroke="#005A91" strokeWidth="0.5" opacity="0.5"/>
                          <line x1="75" y1="27" x2="165" y2="47" stroke="#0A2239" strokeWidth="0.5" opacity="0.3"/>
                          <line x1="45" y1="35" x2="195" y2="25" stroke="#0A2239" strokeWidth="0.5" opacity="0.3"/>
                       </g>

                       {/* Solar Canopy 2 (Left) */}
                       <g transform="translate(80, 20)">
                          {/* Posts */}
                          <rect x="20" y="50" width="4" height="130" fill="url(#glassGrad)" stroke="#0A2239" strokeWidth="1"/>
                          <rect x="140" y="30" width="4" height="150" fill="url(#glassGrad)" stroke="#0A2239" strokeWidth="1"/>
                          {/* Roof */}
                          <polygon points="0,50 120,30 200,40 60,60" fill="url(#glassGrad)" stroke="#0A2239" strokeWidth="1.5" strokeLinejoin="round"/>
                          <line x1="30" y1="45" x2="150" y2="30" stroke="#0A2239" strokeWidth="0.5" opacity="0.5"/>
                          <line x1="60" y1="55" x2="180" y2="40" stroke="#0A2239" strokeWidth="0.5" opacity="0.5"/>
                       </g>

                       {/* Charging Stations (Right) */}
                       <g transform="translate(320, 100)">
                          {/* Station 1 */}
                          <rect x="0" y="20" width="25" height="70" rx="3" fill="white" stroke="#0A2239" strokeWidth="1.5"/>
                          <path d="M 0 25 Q 12 15 25 25" fill="none" stroke="#0A2239" strokeWidth="1.5"/>
                          <rect x="4" y="30" width="17" height="40" rx="2" fill="url(#blueGrad)"/>
                          <circle cx="12.5" cy="40" r="3" fill="#10B981" className="animate-pulse"/>
                          <path d="M 10 55 L 12 50 L 15 50 L 12 60" fill="none" stroke="white" strokeWidth="1"/>

                          {/* Station 2 */}
                          <rect x="50" y="10" width="28" height="80" rx="3" fill="white" stroke="#005A91" strokeWidth="2"/>
                          <path d="M 50 15 Q 64 5 78 15" fill="none" stroke="#005A91" strokeWidth="2"/>
                          <rect x="54" y="25" width="20" height="45" rx="2" fill="url(#blueGrad)"/>
                          <circle cx="64" cy="35" r="4" fill="#10B981" className="animate-pulse"/>
                          <path d="M 61 50 L 64 45 L 67 45 L 64 55" fill="none" stroke="white" strokeWidth="1"/>
                          
                          {/* Cable */}
                          <path d="M 25 60 Q 40 80 50 60" fill="none" stroke="#0A2239" strokeWidth="1.5" strokeDasharray="3 3"/>
                       </g>

                       {/* Truck (Far Left) */}
                       <g transform="translate(10, 110)">
                          <path d="M 10 70 L 10 20 L 80 20 L 80 70 Z" fill="#F8FAFC" stroke="#0A2239" strokeWidth="1.5"/>
                          {/* Container lines */}
                          <line x1="20" y1="20" x2="20" y2="70" stroke="#0A2239" strokeWidth="0.5" opacity="0.3"/>
                          <line x1="35" y1="20" x2="35" y2="70" stroke="#0A2239" strokeWidth="0.5" opacity="0.3"/>
                          <line x1="50" y1="20" x2="50" y2="70" stroke="#0A2239" strokeWidth="0.5" opacity="0.3"/>
                          <line x1="65" y1="20" x2="65" y2="70" stroke="#0A2239" strokeWidth="0.5" opacity="0.3"/>
                          
                          {/* Cab */}
                          <path d="M 80 70 L 80 35 L 105 35 L 115 50 L 115 70 Z" fill="white" stroke="#0A2239" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M 85 40 L 100 40 L 107 50 L 85 50 Z" fill="#eaf1f6" stroke="#0A2239" strokeWidth="1"/>
                          
                          {/* Wheels */}
                          <circle cx="30" cy="75" r="8" fill="#0A2239"/>
                          <circle cx="30" cy="75" r="3" fill="white"/>
                          <circle cx="95" cy="75" r="8" fill="#0A2239"/>
                          <circle cx="95" cy="75" r="3" fill="white"/>
                       </g>

                       {/* Bus (Middle) */}
                       <g transform="translate(120, 125)">
                          <path d="M 10 55 L 10 10 Q 10 5 15 5 L 140 5 Q 150 5 155 20 L 160 55 Z" fill="white" stroke="#0A2239" strokeWidth="1.5" strokeLinejoin="round"/>
                          {/* Windows */}
                          <rect x="15" y="15" width="120" height="20" rx="2" fill="#eaf1f6" stroke="#0A2239" strokeWidth="1"/>
                          <path d="M 140 15 L 150 25 L 153 35 L 140 35 Z" fill="#eaf1f6" stroke="#0A2239" strokeWidth="1"/>
                          {/* Accent Line */}
                          <line x1="10" y1="45" x2="158" y2="45" stroke="#005A91" strokeWidth="2"/>
                          {/* Wheels */}
                          <circle cx="35" cy="55" r="8" fill="#0A2239"/>
                          <circle cx="35" cy="55" r="3" fill="white"/>
                          <circle cx="125" cy="55" r="8" fill="#0A2239"/>
                          <circle cx="125" cy="55" r="3" fill="white"/>
                       </g>
                   </svg>
                </div>
                
                {/* Overlay Text */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 border border-[#D8E1E7] rounded-lg shadow-sm z-20 hidden md:block">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#10B981] rounded-full animate-ping"></span>
                      <span className="font-mono text-[10px] font-bold text-[#0A2239] tracking-widest uppercase">Charging Matrices Active</span>
                   </div>
                </div>
             </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="glass-panel p-6 rounded-xl border border-[#005A91]/20 flex flex-col md:flex-row gap-6 items-center mb-8 max-w-full bg-white shadow-sm hover:shadow-md transition-shadow">
             <div className="w-20 h-20 shrink-0 border-2 border-[#005A91] rounded-xl flex flex-col items-center justify-center bg-[#F8FAFC] relative overflow-hidden group">
                <span className="font-space font-bold text-[#0A2239] text-lg leading-tight group-hover:scale-110 transition-transform">V2L</span>
                <span className="font-space font-bold text-[#0A2239] text-lg leading-tight group-hover:scale-110 transition-transform">V2X</span>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-[#F8FAFC] px-0.5 text-[#005A91]"><BatteryCharging size={16}/></div>
             </div>
             <div>
                <h4 className="font-space font-bold text-[#005A91] text-[15px] mb-2">B2B Technical Differentiation Benchmark (The Geely Case)</h4>
                <p className="text-[13px] text-[#263238] leading-relaxed font-inter text-justify">
                  The Geely RIDDARA RD6 electric pickup platform (M.A.P. layout) integrates <strong className="text-[#0A2239]">21 kWh V2L power discharge matrix</strong>, allowing operators to run high-load industrial tools natively on site and bypass diesel generators. <strong className="text-[#005A91]">SAHIYOO Action:</strong> Position Changan Deepal assets with equivalent V2L/V2X matrices as a critical commercial pitch vector.
                </p>
             </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-panel rounded-xl shadow-sm border border-[#D8E1E7] overflow-hidden mb-8">
            <div className="p-4 bg-white border-b border-[#D8E1E7]">
               <h3 className="font-space font-bold text-[#0A2239] text-[15px]">Cross-Regional Charging Infrastructure Deficit Breakdown</h3>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="md:hidden bg-[#F4F7F9] py-2.5 px-4 text-center border-b border-[#D8E1E7] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#005A91]/5 to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
               <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#005A91] flex items-center justify-center gap-2 relative z-10 opacity-80">
                 <ChevronRight size={12} className="rotate-180" /> Swipe horizontally to view full breakdown <ChevronRight size={12} />
               </span>
            </div>

            <div className="overflow-x-auto pb-2">
               <table className="w-full text-left text-[13px] min-w-[900px]">
                 <thead>
                   <tr className="bg-[#0A2239] text-white font-space font-bold">
                     <th className="p-4 border-r border-[#ffffff20] w-[12%] text-center">Country</th>
                     <th className="p-4 border-r border-[#ffffff20] w-[15%] text-center">
                        <div className="flex flex-col items-center gap-1.5"><Landmark size={18} className="opacity-70 text-[#7DD3FC]"/><span className="tracking-wider text-[11px] uppercase">Regulator</span></div>
                     </th>
                     <th className="p-4 border-r border-[#ffffff20] w-[38%]">
                        <div className="flex items-center gap-3"><Target size={18} className="opacity-70 text-[#7DD3FC]"/><span>Target Nodes / Horizon</span></div>
                     </th>
                     <th className="p-4">
                        <div className="flex items-center gap-3"><FileText size={18} className="opacity-70 text-[#7DD3FC]"/><span>Baseline Tariff & Notes</span></div>
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#D8E1E7]">
                   {CHARGING_DEFICIT_DATA.map((row, idx) => {
                     const IconComponent = CountryIcons[row.country];
                     return (
                       <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#F3F6F8]'} hover:bg-[#eaf1f6] transition-colors group cursor-default`}>
                         <td className="p-4 border-r border-[#D8E1E7]">
                            <div className="flex flex-col items-center justify-center gap-1">
                               <div className="w-8 h-8 flex items-center justify-center text-[#005A91] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                  {IconComponent && <IconComponent />}
                               </div>
                               <span className="font-space font-bold text-[#005A91] text-[12px] uppercase">{row.country}</span>
                            </div>
                         </td>
                         <td className="p-4 font-bold text-[#0A2239] border-r border-[#D8E1E7] text-center font-mono">{row.regulator}</td>
                         <td className="p-4 text-[#263238] border-r border-[#D8E1E7] font-inter leading-relaxed">{row.target}</td>
                         <td className="p-4 text-[#263238] font-inter leading-relaxed">{row.tariff}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
            </div>
          </motion.div>

          {/* Strategic Pivot Block */}
          <motion.div variants={fadeInUp} className="bg-white border-l-4 border-l-[#005A91] border-y border-r border-[#D8E1E7] p-6 rounded-r-xl flex items-start gap-5 shadow-sm group hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 rounded-lg border border-[#D8E1E7] flex items-center justify-center shrink-0 bg-[#F3F6F8] text-[#0A2239] group-hover:border-[#005A91] group-hover:text-[#005A91] transition-colors">
                <Fuel size={24} />
             </div>
             <div>
                <h4 className="font-space font-bold text-[#005A91] mb-1 text-[15px]">Strategic Pivot:</h4>
                <p className="font-inter text-[#263238] text-[13px] leading-relaxed">
                   Bundle <strong className="text-[#0A2239]">"Vehicle + Private Depot Charger Array"</strong> turnkey packages to bypass national grid gaps — referencing Abu Dhabi LTO battery deployment as a proven precedent for high-cycle, heat-resilient fleet charging architecture.
                </p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* CHANGAN MOTORHOME UPGRADES SECTION */}
      <section ref={sectionsRef.motorhomeUpgrades} id="motorhomeUpgrades" className="py-24 px-4 bg-white border-b blueprint-line relative overflow-hidden">
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,90,145,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,90,145,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">TECHNICAL REQUIREMENTS INSERT</span>
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#0A2239] mb-6 tracking-tight">Changan Motorhome <br/>Upgrade Scope</h2>
            <div className="h-1 w-24 bg-[#005A91] mx-auto rounded-full"></div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* CARD 1 */}
            <motion.div variants={fadeInUp} className="glass-panel border border-[#D8E1E7] rounded-3xl overflow-hidden flex flex-col shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 bg-white/90 backdrop-blur">
              <div className="h-1.5 w-full bg-[#005A91]"></div>
              <div className="p-8 pb-6 border-b border-[#D8E1E7] flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-[#F8FAFC]">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0A2239] to-[#005A91] text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
                  <Droplets size={28} />
                </div>
                <h3 className="font-space font-bold text-[#005A91] text-xl leading-tight uppercase tracking-wide">Toilet and Tank System<br className="hidden sm:block"/>to be Upgraded</h3>
              </div>
              <div className="p-2 flex-grow flex flex-col justify-around min-h-[600px]">
                {[
                  { icon: Database, text: "Black Tank – 50 Litres Capacity" },
                  { icon: Database, text: "Grey Tank – 75 Litres Capacity" },
                  { icon: Bath, text: "Toilet seat American concept / Ceramic" },
                  { icon: Monitor, text: "Control for Auto Drain should be dual control (Main display / Driver side)" },
                  { icon: Gauge, text: "Gauge for black and grey tank should be on the control screen" },
                  { icon: ShowerHead, text: "Shattaf" },
                  { icon: Wind, text: "Black and tank vent" },
                  { icon: RefreshCw, text: "Black and tank flush system" },
                  { icon: Droplet, text: "Fresh water tank upgrade" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border-b border-[#D8E1E7]/50 last:border-0 hover:bg-[#F3F6F8] transition-colors rounded-lg mx-2">
                    <item.icon className="text-[#005A91] shrink-0 mt-0.5" size={20} />
                    <span className="font-space font-bold text-[#4E7FA3] w-5 shrink-0 pt-0.5">{idx + 1}.</span>
                    <span className="font-inter text-[#263238] font-medium leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div variants={fadeInUp} className="glass-panel border border-[#D8E1E7] rounded-3xl overflow-hidden flex flex-col shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 bg-white/90 backdrop-blur">
              <div className="h-1.5 w-full bg-[#0A2239]"></div>
              <div className="p-8 pb-6 border-b border-[#D8E1E7] flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-[#F8FAFC]">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0A2239] to-[#005A91] text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
                  <LayoutDashboard size={28} />
                </div>
                <h3 className="font-space font-bold text-[#0A2239] text-xl leading-tight uppercase tracking-wide">Interior to be Upgraded<br className="hidden sm:block"/>for Motorhome</h3>
              </div>
              <div className="p-2 flex-grow flex flex-col justify-around min-h-[600px]">
                {[
                  { icon: Bed, text: "Bed and Table level (same Hybrid concept)" },
                  { icon: Fan, text: "Need to add 14\" fan In and Out in ceiling area" },
                  { icon: AirVent, text: "A/C position should be in the back same as the hybrid" },
                  { icon: ArrowDownToLine, text: "Stabilizer Jack should be electric" },
                  { icon: Layers, text: "Bunker bed – height should be increased" },
                  { icon: Gauge, text: "Adding Air Compressor" },
                  { icon: Shirt, text: "Cabin for hanging dress with toilet door" },
                  { icon: Sun, text: "The solar panel need to increase" },
                  { icon: Truck, text: "Black edition body" },
                  { icon: BatteryCharging, text: "Upgrade the Battery power" },
                  { icon: Snowflake, text: "Need to add car A/C inside the Cabin" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border-b border-[#D8E1E7]/50 last:border-0 hover:bg-[#F3F6F8] transition-colors rounded-lg mx-2">
                    <item.icon className="text-[#005A91] shrink-0 mt-0.5" size={20} />
                    <span className="font-space font-bold text-[#4E7FA3] w-5 shrink-0 pt-0.5">{idx + 1}.</span>
                    <span className="font-inter text-[#263238] font-medium leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* GLOSSARY SECTION */}
      <section ref={sectionsRef.glossary} id="glossary" className="py-24 px-4 bg-[#F8FAFC] border-b blueprint-line">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-[#005A91] block mb-3">TECHNICAL INDEX</span>
            <h2 className="font-space text-4xl font-bold text-[#0A2239]">Glossary of Terms & Abbreviations</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 justify-center mb-12">
            {Object.keys(GLOSSARY_DATA).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveGlossaryTab(tab)}
                className={`text-[12px] font-space font-bold uppercase px-6 py-3 rounded-full transition-all duration-300 ${activeGlossaryTab === tab ? 'bg-[#0A2239] text-white shadow-[0_10px_20px_rgba(10,34,57,0.3)] transform -translate-y-1' : 'bg-white text-[#4E7FA3] border border-[#D8E1E7] hover:border-[#0A2239] hover:text-[#0A2239] hover:shadow-md'}`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          <div className="glass-panel rounded-3xl p-10 shadow-sm min-h-[350px] max-w-5xl mx-auto flex items-start">
            <motion.div 
              key={activeGlossaryTab} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
            >
               {GLOSSARY_DATA[activeGlossaryTab].map((item, index) => (
                 <div 
                   key={item.term}
                   className="glass-panel bg-white/50 p-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default h-fit"
                 >
                   <span className="font-space text-sm font-bold text-[#0A2239] uppercase tracking-wide block mb-2 border-b border-[#005A91]/20 pb-2">
                     {item.term}
                   </span>
                   <p className="text-sm text-slate-600 font-inter leading-relaxed">
                     {item.definition}
                   </p>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A2239] text-slate-400 py-16 px-4">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-white/10 pb-12 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-slate-200 text-[#0A2239] flex items-center justify-center font-space font-bold rounded-lg shadow-lg">S</div>
              <span className="font-space font-bold text-lg tracking-wider text-white">SAHIYOO × GCC 2026</span>
            </div>
            <p className="leading-relaxed max-w-sm text-slate-500 font-inter">
              An executive-level interactive digital dossier outlining the 2026 expansion strategy for extreme sand-proofed luxury RV deployment and NEV commercial fleet logistics across GCC territories.
            </p>
          </div>
          <div>
            <span className="font-space text-white uppercase font-bold tracking-widest block mb-6 text-xs">Dossier Index</span>
            <div className="flex flex-col gap-2 font-inter text-sm text-[#4E7FA3]">
              {NAV_ITEMS.map(nav => (
                 <button key={nav.id} onClick={() => navigateTo(nav.id)} className="text-left hover:text-white transition-colors">
                    {nav.label}
                 </button>
              ))}
              <button onClick={() => navigateTo("glossary")} className="text-left hover:text-white transition-colors mt-2 text-xs font-bold uppercase text-[#7DD3FC]">  Glossary</button>
            </div>
          </div>
          <div>
            <span className="font-space text-white uppercase font-bold tracking-widest block mb-6 text-xs">Verification Flags</span>
            <ul className="space-y-3 font-mono text-[11px] leading-relaxed bg-white/5 p-5 rounded-xl border border-white/10">
              <li className="flex items-center gap-3 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> RV Units confirmed: 11</li>
              <li className="flex items-center gap-3 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> CV Hub Target: $4.05B</li>
              <li className="flex items-center gap-3 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> T3 52°C Ambient HVAC</li>
              <li className="flex items-center gap-3 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> GSO / SASO Compliant</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500">
          <p>© 2026 SAHIYOO (Socare Life Group). All Rights Reserved.</p>
          <p className="mt-4 sm:mt-0 tracking-widest uppercase">Strategic Dossier Ref — Confidential B2B Release</p>
        </div>
      </footer>

      {/* Mobile Floating Menu Hint */}
      <AnimatePresence>
        {isScrolled && !isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-6 right-6 z-40 lg:hidden"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full glass-panel-dark text-white shadow-[0_8px_25px_rgba(0,34,57,0.4)] border border-white/20 active:scale-95 transition-transform bg-[#0A2239]/90 backdrop-blur"
              aria-label="Open Menu"
            >
              <Menu size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
