import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import GlobalHeader from '../components/GlobalHeader';
import DashboardHeader from '../components/DashboardHeader';
import MetricsGrid from '../components/MetricsGrid';
import BuoyStatusCard from '../components/BuoyStatusCard';
import TemperatureChart from '../components/TemperatureChart';
import MapView from '../components/MapView';
import MobileHeader from '../components/MobileHeader';
import MobileSidebar from '../components/MobileSidebar';

import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Compass, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stations = [
  { id: 1, name: 'AL Aqah Buoy', position: [25.4725, 56.4162], temp: '25.1', color: 'orange', updated: '2 min ago', interval: '30 min' },
  { id: 2, name: 'Fujairah Buoy 1', position: [25.1288, 56.3572], temp: '24.9', color: 'yellow', updated: '5 min ago', interval: '30 min' },
  { id: 3, name: 'Fujairah Buoy 2', position: [25.2041, 56.3738], temp: '25.3', color: 'cyan', updated: '1 min ago', interval: '30 min' },
  { id: 4, name: 'Coastal Buoy A', position: [25.3100, 56.3950], temp: '24.8', color: 'pink', updated: '8 min ago', interval: '30 min' },
];

const Dashboard = () => {
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Sonde');
  const [selectedBuoy, setSelectedBuoy] = useState(stations[0]);
  const [selectedMetric, setSelectedMetric] = useState(activeTab === 'Sonde' ? 'Water Temperature (°c)' : 'Air Temperature (°c)');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 24 Hours');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { i18n } = useTranslation();
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const isRtl = i18n.language === 'ar';

  // Mobile Bottom Sheet State (Framer Motion)
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);

  useEffect(() => {
    setSelectedMetric(activeTab === 'Sonde' ? 'Water Temperature (°c)' : 'Air Temperature (°c)');
  }, [activeTab]);

  const handleDragEnd = (_, info) => {
    // Negative offset means dragging up
    if (info.offset.y < -100) {
      setIsBottomSheetExpanded(true);
    } else if (info.offset.y > 100) {
      setIsBottomSheetExpanded(false);
    }
  };

  return (
    <div className="w-screen h-screen lg:overflow-hidden p-0 flex flex-col bg-transparent relative">
      {/* Mobile/Tablet Navigation */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Desktop Global Header */}
      <div className="hidden lg:block z-[2000]">
        <GlobalHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          stations={stations}
          selectedBuoy={selectedBuoy}
          setSelectedBuoy={setSelectedBuoy}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
        />
      </div>

      {/* Main Content Area (Below Header) */}
      <div className="flex-1 relative h-full flex lg:flex-row flex-col lg:mt-[80px]">
        {/* Desktop Sidebar */}
        <Sidebar selectedBuoy={selectedBuoy} activeTab={activeTab} />

        {/* Main Dashboard Content */}
        <div className="flex-1 relative h-full w-full lg:ml-[80px] lg:pl-[12px] lg:pr-[8px] lg:pb-[8px] overflow-hidden">
        
        {/* --- RESPONSIVE LAYOUT (Mobile & Tablet < 1024px) --- */}
        <div className="lg:hidden fixed inset-0 overflow-hidden bg-transparent">
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {/* Fixed Map Section (Background) */}
          <div className="fixed top-[64px] left-0 right-0 bottom-0 z-0">
            <MapView onBuoySelect={setSelectedBuoy} selectedBuoy={selectedBuoy} isMobile={true} />
          </div>

          {/* Draggable Bottom Sheet */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            animate={{
              y: isBottomSheetExpanded ? "0%" : "65%"
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 32
            }}
            className={`fixed left-0 right-0 bottom-0 z-[5000] no-scrollbar pointer-events-auto ${isBottomSheetExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}
            style={{
              height: '90vh',
              borderRadius: '24px 24px 0 0',
              border: '1px solid rgba(0, 0, 0, 0.10)',
              background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.44) 100%)',
              boxShadow: '3px 3px 4px 0 rgba(255, 255, 255, 0.17) inset',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              touchAction: 'none'
            }}
          >
            {/* Drag Handle Area */}
            <div className="w-full flex justify-center pt-3 pb-0 sticky top-0 z-[60] bg-transparent">
              <div style={{ cursor: 'grab' }} className="text-black/40 transition-opacity">
                {isBottomSheetExpanded ? <ChevronDown size={24} strokeWidth={2.5} /> : <ChevronUp size={24} strokeWidth={2.5} />}
              </div>
            </div>

            <div 
              className="pt-2 px-4 flex flex-col gap-6 pb-20 max-w-2xl mx-auto"
              style={{ touchAction: isBottomSheetExpanded ? 'auto' : 'none' }}
            >
              {/* Summary Card */}
              <BuoyStatusCard activeTab={activeTab} selectedBuoy={selectedBuoy} isMobile={true} />

              {/* Dashboard Content Container */}
                <div className="flex flex-col gap-6">
                  <div className="text-center hidden">
                    {/* DashboardHeader was here */}
                  </div>

                  <div className="w-full h-[200px] mb-4">
                    <TemperatureChart 
                      activeTab={activeTab} 
                      selectedBuoy={selectedBuoy} 
                      selectedMetric={selectedMetric} 
                      isMobile={true} 
                      selectedDateRange={selectedDateRange}
                    />
                  </div>

                  <MetricsGrid 
                    activeTab={activeTab} 
                    selectedMetric={selectedMetric} 
                    setSelectedMetric={setSelectedMetric} 
                    isMobile={true} 
                    selectedBuoy={selectedBuoy}
                    selectedDateRange={selectedDateRange}
                  />
                </div>
            </div>
          </motion.div>
        </div>

        {/* --- DESKTOP LAYOUT (>= 1024px) --- */}
        <div className="hidden lg:block w-full h-full relative">
          {/* MapContainer */}
          <div className="w-full h-full rounded-[28px] overflow-hidden relative" style={{ background: '#f4f3f0' }}>
            <MapView ref={mapRef} onBuoySelect={setSelectedBuoy} selectedBuoy={selectedBuoy} />
          </div>

          {/* Map controls floating to the left/right of the right panel */}
          <div 
            className="absolute top-[32px] z-[1000] flex flex-col gap-2.5 transition-all duration-300"
            style={{
              right: isRtl ? 'auto' : (isRightPanelCollapsed ? '32px' : '552px'),
              left: isRtl ? (isRightPanelCollapsed ? '32px' : '552px') : 'auto',
            }}
          >
            {/* Compass/Recenter button */}
            <button
              onClick={() => {
                if (mapRef.current && selectedBuoy) {
                  mapRef.current.setView(selectedBuoy.position, 11);
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-white/20 text-[#072227] shadow-lg cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
              title="Recenter Map"
            >
              <Compass size={20} className="text-[#072227]" />
            </button>
            {/* Zoom In button */}
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-white/20 text-[#072227] shadow-lg cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
              title="Zoom In"
            >
              <Plus size={20} className="text-[#072227]" />
            </button>
            {/* Zoom Out button */}
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-white/20 text-[#072227] shadow-lg cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
              title="Zoom Out"
            >
              <Minus size={20} className="text-[#072227]" />
            </button>
          </div>

          {/* Buoy Status Card (Floating Left on desktop) */}
          <div className="absolute ltr:left-[16px] rtl:right-[16px] bottom-[16px] w-[340px] h-[480px] z-[15]">
            <BuoyStatusCard activeTab={activeTab} selectedBuoy={selectedBuoy} selectedMetric={selectedMetric} />
          </div>

          {/* Collapsible Vertical Right Panel (Desktop) — parent does NOT scroll */}
          <motion.div 
            className="absolute top-0 bottom-0 z-[15] w-[520px] flex flex-col"
            style={{
              left: isRtl ? '0px' : 'auto',
              right: isRtl ? 'auto' : '0px',
              borderRadius: '28px',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              background: 'radial-gradient(136.65% 89.92% at 50% 50%, rgba(220, 240, 245, 0.45) 0%, rgba(140, 210, 220, 0.55) 100%)',
              boxShadow: '3px 3px 4px 0 rgba(255, 255, 255, 0.17) inset, 0 20px 50px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              padding: '0',
              overflow: 'hidden'  /* Panel itself NEVER scrolls */
            }}
            initial={{ x: 0 }}
            animate={{ x: isRightPanelCollapsed ? (isRtl ? -544 : 544) : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
              className="absolute top-1/2 -translate-y-1/2 z-[20] flex items-center justify-center w-[24px] h-[52px] bg-white/80 backdrop-blur-md border border-white/40 shadow-md cursor-pointer hover:bg-white/90 transition-colors"
              style={{
                left: isRtl ? 'auto' : '-24px',
                right: isRtl ? '-24px' : 'auto',
                borderRadius: isRtl ? '0 12px 12px 0' : '12px 0 0 12px'
              }}
            >
              {isRightPanelCollapsed ? (
                isRtl ? <ChevronRight size={16} className="text-[#072227]" /> : <ChevronLeft size={16} className="text-[#072227]" />
              ) : (
                isRtl ? <ChevronLeft size={16} className="text-[#072227]" /> : <ChevronRight size={16} className="text-[#072227]" />
              )}
            </button>
 
            {/* ① Dropdowns row — fixed, never scrolls */}
            <div className="flex-shrink-0 mb-3 pt-5 px-5">
              <DashboardHeader 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                stations={stations}
                selectedBuoy={selectedBuoy}
                setSelectedBuoy={setSelectedBuoy}
              />
            </div>
 
            {/* ② Metric Cards — independent vertical scrollbar only, fixed portion of the panel */}
            <div 
              className="flex-shrink-0 overflow-y-auto overflow-x-hidden panel-metrics-scrollbar px-5"
              style={{ maxHeight: '264px' }}
            >
              <MetricsGrid 
                activeTab={activeTab} 
                selectedMetric={selectedMetric} 
                setSelectedMetric={setSelectedMetric} 
                selectedBuoy={selectedBuoy}
                selectedDateRange={selectedDateRange}
              />
            </div>
 
            {/* Divider */}
            <div className="mx-5 h-[1.5px] bg-white/20 my-2 flex-shrink-0" />
 
            {/* ③ Chart section — takes all remaining height, independent scrollbar */}
            <div className="flex-1 min-h-0 overflow-hidden px-5 pb-5">
              <TemperatureChart 
                activeTab={activeTab} 
                selectedBuoy={selectedBuoy} 
                selectedMetric={selectedMetric} 
                setSelectedMetric={setSelectedMetric}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default Dashboard;
