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

  const dropdownButtonStyle = "flex items-center justify-between w-full px-5 py-2.5 backdrop-blur-xl text-[#072227] text-[14px] font-semibold transition-all outline-none cursor-pointer";
 
  const customDropdownButtonStyle = {
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.25) 100%)',
    boxShadow: '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset',
    backdropFilter: 'blur(10px)',
  };

  const dropdownListStyle = {
    borderRadius: '21px',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%), radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.24) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
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

      {/* Tab (Sonde/Weather) Dropdown */}
      <div className="flex-1 relative">
        <button
          ref={tabBtnRef}
          onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
          className={dropdownButtonStyle}
          style={customDropdownButtonStyle}
        >
          <span>{activeTab === 'Sonde' ? t('dashboard.sonde') : t('dashboard.weather')}</span>
          <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-300 ${isTabDropdownOpen ? 'rotate-180' : ''} text-[#072227]/70`} />
        </button>
        
        {isTabDropdownOpen && createPortal(
          <div 
            ref={tabDropdownRef}
            className="fixed z-[9999] p-3 flex flex-col gap-2"
            style={{
              top: tabDropdownPos.top,
              left: tabDropdownPos.left,
              width: tabBtnRef.current ? `${tabBtnRef.current.offsetWidth}px` : '140px',
              ...dropdownListStyle
            }}
          >
            {['Sonde', 'Weather'].map((tab) => (
              <button
                key={tab}
                className={`text-left text-[14px] font-bold p-2 rounded-lg transition-colors ${
                  activeTab === tab ? 'text-[#1DCDDD]' : 'text-white hover:text-[#1DCDDD]'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setIsTabDropdownOpen(false);
                }}
              >
                {tab === 'Sonde' ? t('dashboard.sonde') : t('dashboard.weather')}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
