import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SensorDataFilters = ({ 
  isMobile = false,
  activeSubTab = 'Alarms',
  setActiveSubTab,
  selectedBuoy = 'Al Aqah Buoy',
  setSelectedBuoy,
  selectedDate: propSelectedDate,
  setSelectedDate: propSetSelectedDate
}) => {
  const { t } = useTranslation();
  
  const [isSubTabOpen, setIsSubTabOpen] = useState(false);
  const [isBuoyOpen, setIsBuoyOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [tempSubTab, setTempSubTab] = useState(activeSubTab);
  const [localSelectedDate, localSetSelectedDate] = useState('Today');
  const selectedDate = propSelectedDate !== undefined ? propSelectedDate : localSelectedDate;
  const setSelectedDate = propSetSelectedDate !== undefined ? propSetSelectedDate : localSetSelectedDate;

  const [tempDate, setTempDate] = useState('Today');

  useEffect(() => {
    if (activeSubTab === 'Battery Health') {
      if (selectedDate === 'Today' || !['Live Data', 'Last Day', 'Last Week', 'Last Month', 'Last Three Months'].includes(selectedDate)) {
        setSelectedDate('Last Day');
        setTempDate('Last Day');
      }
    } else {
      if (selectedDate === 'Last Day' || !['Last Hour', 'Today', 'Last One Week', 'Last Two Week', 'Last One Month', 'Last Two Months', 'Last Three Months', 'Choose Period'].includes(selectedDate)) {
        setSelectedDate('Today');
        setTempDate('Today');
      }
    }
  }, [activeSubTab]);

  const [subTabPos, setSubTabPos] = useState({ top: 0, left: 0 });
  const [buoyPos, setBuoyPos] = useState({ top: 0, left: 0 });
  const [datePos, setDatePos] = useState({ top: 0, left: 0 });

  const subTabBtnRef = useRef(null);
  const buoyBtnRef = useRef(null);
  const dateBtnRef = useRef(null);

  const subTabDropdownRef = useRef(null);
  const buoyDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  const updatePositions = useCallback(() => {
    if (subTabBtnRef.current) {
      const rect = subTabBtnRef.current.getBoundingClientRect();
      setSubTabPos({
        top: rect.bottom + window.scrollY + 8,
        left: window.innerWidth < 1024 ? (window.innerWidth - 380) / 2 : rect.right + window.scrollX - 220
      });
    }
    if (buoyBtnRef.current) {
      const rect = buoyBtnRef.current.getBoundingClientRect();
      setBuoyPos({
        top: rect.bottom + window.scrollY + 8,
        left: window.innerWidth < 1024 ? (window.innerWidth - 380) / 2 : rect.right + window.scrollX - 220
      });
    }
    if (dateBtnRef.current) {
      const rect = dateBtnRef.current.getBoundingClientRect();
      setDatePos({
        top: rect.bottom + window.scrollY + 8,
        left: window.innerWidth < 1024 ? (window.innerWidth - 380) / 2 : rect.right + window.scrollX - 380
      });
    }
  }, []);

  useEffect(() => {
    if (isSubTabOpen || isBuoyOpen || isDateOpen) {
      updatePositions();
      window.addEventListener('scroll', updatePositions);
      window.addEventListener('resize', updatePositions);
    }
    return () => {
      window.removeEventListener('scroll', updatePositions);
      window.removeEventListener('resize', updatePositions);
    };
  }, [isSubTabOpen, isBuoyOpen, isDateOpen, updatePositions]);

  useEffect(() => {
    if (isDateOpen) {
      setTempDate(selectedDate);
    }
  }, [isDateOpen, selectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSubTabOpen && subTabBtnRef.current && !subTabBtnRef.current.contains(event.target) && subTabDropdownRef.current && !subTabDropdownRef.current.contains(event.target)) {
        setIsSubTabOpen(false);
      }
      if (isBuoyOpen && buoyBtnRef.current && !buoyBtnRef.current.contains(event.target) && buoyDropdownRef.current && !buoyDropdownRef.current.contains(event.target)) {
        setIsBuoyOpen(false);
      }
      if (isDateOpen && dateBtnRef.current && !dateBtnRef.current.contains(event.target) && dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSubTabOpen, isBuoyOpen, isDateOpen]);

  const subTabs = ['Alarms', 'Battery Health'];
  const buoys = ['All Stations', 'Near Shore Buoy', 'Offshore Buoy', 'Al Aqah Buoy', 'North Dibbah'];
  const timeRanges = activeSubTab === 'Battery Health'
    ? ['Live Data', 'Last Day', 'Last Week', 'Last Month', 'Last Three Months']
    : [
        'Last Hour', 'Today', 'Last One Week', 'Last Two Week', 
        'Last One Month', 'Last Two Months', 'Last Three Months', 'Choose Period'
      ];

  // Resolve array of selected stations
  const selectedArray = Array.isArray(selectedBuoy) 
    ? selectedBuoy 
    : selectedBuoy === 'All Stations' || selectedBuoy === '4 Stations'
      ? ['Near Shore Buoy', 'Offshore Buoy', 'Al Aqah Buoy', 'North Dibbah']
      : [selectedBuoy];

  const getBuoyTriggerLabel = () => {
    if (activeSubTab !== 'Battery Health') {
      return selectedBuoy === '4 Stations' || selectedBuoy === 'All Stations' ? 'All Stations' : selectedBuoy;
    }
    const individualStations = ['Near Shore Buoy', 'Offshore Buoy', 'Al Aqah Buoy', 'North Dibbah'];
    const allSelected = individualStations.every(s => selectedArray.includes(s));
    if (allSelected || selectedBuoy === 'All Stations') {
      return 'All Stations';
    }
    return selectedArray.map(s => s.replace(' Buoy', '')).join(', ');
  };

  const filterStyle = {
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.25) 100%)',
    boxShadow: '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset',
    color: '#FFFFFF',
    fontWeight: '400',
    backdropFilter: 'blur(10px)',
    height: '40px'
  };

  const glassOverlayStyle = {
    borderRadius: '30px',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.24) 100%)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
  };

  return (
    <div className="flex flex-row items-center gap-2 md:gap-3 w-full lg:w-auto lg:justify-end">
      
      {/* 1. Station Health Sub-Tab Selector Dropdown */}
      <button 
        ref={subTabBtnRef}
        onClick={() => setIsSubTabOpen(!isSubTabOpen)}
        className="flex items-center justify-between gap-2 px-3 md:px-5 py-2 text-[11px] md:text-xs font-semibold transition-all hover:brightness-110 active:scale-95 flex-1 lg:flex-none lg:w-auto min-w-0 lg:min-w-[140px]"
        style={filterStyle}
      >
        <span className="whitespace-nowrap text-ellipsis overflow-hidden">{activeSubTab}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isSubTabOpen ? 'rotate-180' : ''} text-white/70 flex-shrink-0`} />
      </button>

      {/* 2. Station Name Dropdown */}
      <button 
        ref={buoyBtnRef}
        onClick={() => setIsBuoyOpen(!isBuoyOpen)}
        className="flex items-center justify-between gap-2 px-3 md:px-5 py-2 text-[11px] md:text-xs font-semibold transition-all hover:brightness-110 active:scale-95 flex-1 lg:flex-none lg:w-auto min-w-0 lg:min-w-[150px]"
        style={filterStyle}
      >
        <div className="flex items-center gap-2 text-ellipsis overflow-hidden">
          <MapPin size={14} className="text-white/70 flex-shrink-0" />
          <span className="whitespace-nowrap text-ellipsis overflow-hidden">{getBuoyTriggerLabel()}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isBuoyOpen ? 'rotate-180' : ''} text-white/70 flex-shrink-0`} />
      </button>

      {/* 3. Date Selector Calendar Dropdown */}
      <button 
        ref={dateBtnRef}
        onClick={() => setIsDateOpen(!isDateOpen)}
        className="flex items-center justify-between gap-2 px-3 md:px-5 py-2 text-[11px] md:text-xs font-semibold transition-all hover:brightness-110 active:scale-95 flex-1 lg:flex-none lg:w-auto min-w-0 lg:min-w-[130px]"
        style={filterStyle}
      >
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-white/70 flex-shrink-0" />
          <span className="whitespace-nowrap">{selectedDate}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isDateOpen ? 'rotate-180' : ''} text-white/70 flex-shrink-0`} />
      </button>

      {/* Portals */}
      {isSubTabOpen && createPortal(
        <div 
          ref={subTabDropdownRef}
          className="fixed z-[9999] p-6 flex flex-col gap-5 shadow-2xl animate-fade-in"
          style={{
            ...glassOverlayStyle,
            top: subTabPos.top,
            left: subTabPos.left,
            width: window.innerWidth < 400 ? 'calc(100% - 32px)' : '380px',
          }}
        >
          <div className="flex flex-col gap-4">
            {subTabs.map((tab) => (
              <label 
                key={tab} 
                className="flex items-center gap-3 cursor-pointer group select-none"
                onClick={() => setTempSubTab(tab)}
              >
                <div 
                  className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all ${
                    tempSubTab === tab ? 'border-white bg-white' : 'border-white/30 group-hover:border-white/50 bg-transparent'
                  }`}
                >
                  {tempSubTab === tab && <div className="w-[10px] h-[10px] bg-[#009FAC] rounded-full" />}
                </div>
                <span className="text-white text-[15px] font-medium">{tab}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 mt-4 pt-2 border-t border-white/5">
            <button 
              onClick={() => setIsSubTabOpen(false)}
              className="text-white/80 text-[15px] font-semibold hover:text-white transition-colors cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setActiveSubTab(tempSubTab);
                setIsSubTabOpen(false);
              }}
              className="px-6 py-2 text-white text-[14px] font-bold tracking-wide flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'radial-gradient(50% 50% at 50% 50%, #1DCDDD 0%, #009FAC 100%)',
                borderRadius: '20px',
                boxShadow: '0 0 20px 0 rgba(0, 159, 172, 0.40)'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>,
        document.body
      )}

      {isBuoyOpen && createPortal(
        <div 
          ref={buoyDropdownRef}
          className="fixed z-[9999] p-4 flex flex-col gap-3.5 shadow-2xl"
          style={{
            ...glassOverlayStyle,
            top: buoyPos.top,
            left: buoyPos.left,
            width: '220px',
          }}
        >
          {buoys.map((buoy) => {
            const isBatteryHealth = activeSubTab === 'Battery Health';
            const individualStations = ['Near Shore Buoy', 'Offshore Buoy', 'Al Aqah Buoy', 'North Dibbah'];
            
            const isChecked = buoy === 'All Stations'
              ? individualStations.every(s => selectedArray.includes(s))
              : selectedArray.includes(buoy);

            return (
              <button
                key={buoy}
                onClick={() => {
                  if (isBatteryHealth) {
                    let nextSelected;
                    if (buoy === 'All Stations') {
                      if (individualStations.every(s => selectedArray.includes(s))) {
                        // Toggle off: keep only the first station
                        nextSelected = ['Near Shore Buoy'];
                      } else {
                        // Toggle on: select all
                        nextSelected = individualStations;
                      }
                    } else {
                      if (selectedArray.includes(buoy)) {
                        // Uncheck if not last remaining
                        if (selectedArray.length > 1) {
                          nextSelected = selectedArray.filter(s => s !== buoy);
                        } else {
                          nextSelected = selectedArray;
                        }
                      } else {
                        // Check
                        nextSelected = [...selectedArray, buoy];
                      }
                    }
                    setSelectedBuoy(nextSelected);
                  } else {
                    // Single select for Alarms and other tabs
                    setSelectedBuoy(buoy);
                    setIsBuoyOpen(false);
                  }
                }}
                className="w-full text-left outline-none cursor-pointer border-none bg-transparent py-1 group"
              >
                {isBatteryHealth ? (
                  <div className="flex items-center gap-3.5 w-full">
                    <div className={`w-[17px] h-[17px] rounded-[4px] border-2 transition-all flex items-center justify-center ${
                      isChecked ? 'border-white bg-white' : 'border-white/40 bg-transparent group-hover:border-white/60'
                    }`}>
                      {isChecked && (
                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#009FAC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-white text-[13px] font-semibold group-hover:text-white/80 transition-colors">{buoy}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3.5 w-full">
                    <div 
                      className={`w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedBuoy === buoy ? 'border-white bg-white' : 'border-white/40 bg-transparent group-hover:border-white/60'
                      }`}
                    >
                      {selectedBuoy === buoy && <div className="w-[7px] h-[7px] bg-[#009FAC] rounded-full" />}
                    </div>
                    <span className="text-white text-[13px] font-semibold group-hover:text-white/80 transition-colors">{buoy}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}

      {isDateOpen && createPortal(
        <div 
          ref={dateDropdownRef}
          className="fixed z-[9999] p-6 flex flex-col gap-5 shadow-2xl"
          style={{
            ...glassOverlayStyle,
            top: datePos.top,
            left: datePos.left,
            width: window.innerWidth < 400 ? 'calc(100% - 32px)' : '380px',
          }}
        >
          <div className="flex flex-col gap-4">
            {timeRanges.map((range) => (
              <label key={range} className="flex items-center gap-3 cursor-pointer group select-none">
                <div 
                  onClick={() => setTempDate(range)}
                  className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all ${
                    tempDate === range ? 'border-white bg-white' : 'border-white/30 group-hover:border-white/50 bg-transparent'
                  }`}
                >
                  {tempDate === range && <div className="w-[10px] h-[10px] bg-[#009FAC] rounded-full" />}
                </div>
                <span className="text-white text-[15px] font-medium" onClick={() => setTempDate(range)}>{range}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 mt-4 pt-2 border-t border-white/5">
            <button 
              onClick={() => setIsDateOpen(false)}
              className="text-white/80 text-[15px] font-semibold hover:text-white transition-colors cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setSelectedDate(tempDate);
                setIsDateOpen(false);
              }}
              className="px-6 py-2 text-white text-[14px] font-bold tracking-wide flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'radial-gradient(50% 50% at 50% 50%, #1DCDDD 0%, #009FAC 100%)',
                borderRadius: '20px',
                boxShadow: '0 0 20px 0 rgba(0, 159, 172, 0.40)'
              }}
            >
              Apply Filter
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SensorDataFilters;
