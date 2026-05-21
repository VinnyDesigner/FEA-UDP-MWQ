import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const DashboardHeader = ({ activeTab, setActiveTab, stations = [], selectedBuoy, setSelectedBuoy }) => {
  const { t } = useTranslation();
  
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [locationDropdownPos, setLocationDropdownPos] = useState({ top: 0, left: 0 });
  const [tabDropdownPos, setTabDropdownPos] = useState({ top: 0, left: 0 });

  const locationBtnRef = useRef(null);
  const tabBtnRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const tabDropdownRef = useRef(null);

  const updateDropdownPos = useCallback(() => {
    if (locationBtnRef.current) {
      const rect = locationBtnRef.current.getBoundingClientRect();
      setLocationDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
    if (tabBtnRef.current) {
      const rect = tabBtnRef.current.getBoundingClientRect();
      setTabDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
  }, []);

  useEffect(() => {
    if (isLocationOpen || isTabDropdownOpen) {
      updateDropdownPos();
      window.addEventListener('scroll', updateDropdownPos);
      window.addEventListener('resize', updateDropdownPos);
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPos);
      window.removeEventListener('resize', updateDropdownPos);
    };
  }, [isLocationOpen, isTabDropdownOpen, updateDropdownPos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLocationOpen && 
          locationBtnRef.current && !locationBtnRef.current.contains(event.target) &&
          locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (isTabDropdownOpen && 
          tabBtnRef.current && !tabBtnRef.current.contains(event.target) &&
          tabDropdownRef.current && !tabDropdownRef.current.contains(event.target)) {
        setIsTabDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLocationOpen, isTabDropdownOpen]);

  const [tempSelectedTab, setTempSelectedTab] = useState(activeTab);

  useEffect(() => {
    if (isTabDropdownOpen) {
      setTempSelectedTab(activeTab);
    }
  }, [isTabDropdownOpen, activeTab]);

  const dropdownButtonStyle = "flex items-center justify-between w-full px-5 py-2.5 backdrop-blur-xl text-[#072227] text-[14px] font-semibold transition-all outline-none cursor-pointer";
 
  const customDropdownButtonStyle = {
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.25) 100%)',
    boxShadow: '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset',
    backdropFilter: 'blur(10px)',
  };

  const dropdownListStyle = {
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.24) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
  };

  const tabDropdownListStyle = {
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.44) 100%)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    boxShadow: '3px 3px 4px 0 rgba(255, 255, 255, 0.17) inset, 0 12px 40px rgba(0, 0, 0, 0.15)'
  };
 
  return (
    <div className="flex items-center gap-3 w-full pb-2">
      {/* Location Dropdown */}
      <div className="flex-1 relative">
        <button
          ref={locationBtnRef}
          onClick={() => setIsLocationOpen(!isLocationOpen)}
          className={dropdownButtonStyle}
          style={customDropdownButtonStyle}
        >
          <span className="truncate">{selectedBuoy?.name || t('dashboard.selectStation')}</span>
          <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''} text-[#072227]/70`} />
        </button>
        
        {isLocationOpen && createPortal(
          <div 
            ref={locationDropdownRef}
            className="fixed z-[9999] p-3 flex flex-col gap-2"
            style={{
              top: locationDropdownPos.top,
              left: locationDropdownPos.left,
              width: locationBtnRef.current ? `${locationBtnRef.current.offsetWidth}px` : '180px',
              ...dropdownListStyle
            }}
          >
            {stations.map((station) => (
              <button
                key={station.id}
                className="text-left text-white text-[14px] font-bold hover:text-[#1DCDDD] p-2 rounded-lg transition-colors"
                onClick={() => {
                  if (setSelectedBuoy) setSelectedBuoy(station);
                  setIsLocationOpen(false);
                }}
              >
                {station.name}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>

      {/* Tab (Sonde/Weather/Windrose) Dropdown */}
      <div className="flex-1 relative">
        <button
          ref={tabBtnRef}
          onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
          className={dropdownButtonStyle}
          style={customDropdownButtonStyle}
        >
          <span>
            {activeTab === 'Sonde' 
              ? t('dashboard.sonde', 'Sonde') 
              : activeTab === 'Weather' 
                ? t('dashboard.weather', 'Weather') 
                : t('dashboard.windrose', 'Windrose')}
          </span>
          <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-300 ${isTabDropdownOpen ? 'rotate-180' : ''} text-[#072227]/70`} />
        </button>
        
        {isTabDropdownOpen && createPortal(
          <div 
            ref={tabDropdownRef}
            className="fixed z-[9999] p-5 flex flex-col gap-4"
            style={{
              top: tabDropdownPos.top,
              left: tabDropdownPos.left,
              width: '280px',
              ...tabDropdownListStyle
            }}
          >
            {/* Options list */}
            <div className="flex flex-col gap-3">
              {['Sonde', 'Weather', 'Windrose'].map((tab) => {
                const isChecked = tempSelectedTab === tab;
                return (
                  <button
                    key={tab}
                    className="flex items-center gap-3 w-full py-1.5 px-1.5 transition-colors cursor-pointer text-left focus:outline-none"
                    onClick={() => setTempSelectedTab(tab)}
                  >
                    <div 
                      className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked ? 'bg-white border-white' : 'border-white/40 bg-transparent'
                      }`}
                    >
                      {isChecked && (
                        <div className="w-[10px] h-[10px] rounded-full bg-[#009FAC]" />
                      )}
                    </div>
                    <span className={`text-[15px] font-bold transition-all ${isChecked ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                      {tab === 'Sonde' 
                        ? t('dashboard.sonde', 'Sonde') 
                        : tab === 'Weather' 
                          ? t('dashboard.weather', 'Weather') 
                          : t('dashboard.windrose', 'Windrose')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsTabDropdownOpen(false)}
                className="text-white/80 hover:text-white font-bold text-[14px] px-2 py-1.5 cursor-pointer transition-colors focus:outline-none"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  setActiveTab(tempSelectedTab);
                  setIsTabDropdownOpen(false);
                }}
                className="px-5 py-2 rounded-full font-bold text-white text-[13.5px] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer shadow-lg focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, #1DCDDD 0%, #009FAC 100%)',
                  boxShadow: '0 4px 15px rgba(0, 159, 172, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.3)'
                }}
              >
                {t('common.apply', 'Apply Filters')}
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
