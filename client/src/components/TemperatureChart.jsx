import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Maximize2, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ChartModal from './ChartModal';

const sondeData = [
  { time: '17 Feb 2026', hour: '9:30AM', temp: 5 },
  { time: '17 Feb 2026', hour: '10:00AM', temp: 28 },
  { time: '17 Feb 2026', hour: '10:30AM', temp: 48 },
  { time: '17 Feb 2026', hour: '11:00AM', temp: 62 },
  { time: '17 Feb 2026', hour: '11:30AM', temp: 38 },
  { time: '17 Feb 2026', hour: '12:00PM', temp: 42 },
];

const weatherData = [
  { time: '17 Feb 2026', hour: '9:30AM', temp: 38 },
  { time: '17 Feb 2026', hour: '10:00AM', temp: 12 },
  { time: '17 Feb 2026', hour: '10:30AM', temp: 22 },
  { time: '17 Feb 2026', hour: '11:00AM', temp: 38 },
  { time: '17 Feb 2026', hour: '11:30AM', temp: 52 }
];

const CustomYAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={-35} 
        y={4} 
        textAnchor="start" 
        fill="#6B7280" 
        fontSize={10} 
        fontWeight="400"
      >
        {payload.value}
      </text>
    </g>
  );
};

const CustomXAxisTick = ({ x, y, payload }) => {
  if (!payload || !payload.value) return null;
  const parts = payload.value.split('\n');
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={12} dy={0} textAnchor="middle" fill="#6B7280" fontSize={9} fontWeight="400">
        {parts[0]}
      </text>
      <text x={0} y={22} dy={0} textAnchor="middle" fill="#6B7280" fontSize={9} fontWeight="500">
        {parts[1]}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label, selectedMetric }) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div 
        className="backdrop-blur-[20px] border border-white/10 p-5 rounded-[20px] shadow-2xl min-w-[220px]"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
        }}
      >
        <div className="flex flex-col gap-1.5 ltr:text-left rtl:text-right">
          <p className="text-[13px] text-[#072227]">
            <span className="font-bold opacity-90">{t('analytics.parameters')} :</span> <span className="opacity-80">{selectedMetric?.split('(')[0].trim() || 'Temperature'}</span>
          </p>
          <p className="text-[13px] text-[#072227]">
            <span className="font-bold opacity-90">{t('analytics.station')} :</span> <span className="opacity-80">{t('analytics.stationName')}</span>
          </p>
          <p className="text-[13px] text-[#072227]">
            <span className="font-bold opacity-90">{t('analytics.details')} :</span> <span className="opacity-80">{payload[0].value.toFixed(2)}</span>
          </p>
          <p className="text-[13px] text-[#072227]">
            <span className="font-bold opacity-90">{t('analytics.dateTime')} :</span> <span className="opacity-80">{label.replace('\\n', ' ')}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const sondeMetrics = [
  'Water Temperature (°c)',
  'Salinity (ppt)',
  'Chlorophyll (ug)',
  'Dissolved Oxygen (mg/l)',
  'pH',
  'Turbidity (NTU)',
  'Blue-Green Algae (ug)',
  'Depth(m)',
  'Specific Conductivity(uS)'
];

const weatherMetrics = [
  'Air Temperature (°c)',
  'Relative Humidity (%)',
  'AWS (m/s)',
  'AWD (Degree)',
  'Wind Gust (Wind Gust)',
  'Pressure (bar)'
];

const DateRangeDropdown = ({ selectedDateRange, setSelectedDateRange, isMobile }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  const updateDropdownPos = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 60
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPos();
      window.addEventListener('scroll', updateDropdownPos);
      window.addEventListener('resize', updateDropdownPos);
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPos);
      window.removeEventListener('resize', updateDropdownPos);
    };
  }, [isOpen, updateDropdownPos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          btnRef.current && !btnRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const dateRanges = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1 bg-white/60 hover:bg-white/85 rounded-lg border border-white/40 text-[#072227] text-[11px] font-bold shadow-sm transition-all outline-none cursor-pointer"
      >
        <span>{selectedDateRange || 'Last 24 Hours'}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-[#072227]/70`} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] p-3 flex flex-col gap-2"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            minWidth: '150px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            color: '#072227',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
          }}
        >
          {dateRanges.map((range) => (
            <button
              key={range}
              className={`text-left text-xs font-semibold p-1.5 rounded-lg transition-colors ${
                (selectedDateRange || 'Last 24 Hours') === range 
                  ? 'text-[#009FAC] bg-[#009FAC]/10 font-bold' 
                  : 'text-[#072227] hover:text-[#009FAC] hover:bg-black/5'
              }`}
              onClick={() => {
                if (setSelectedDateRange) setSelectedDateRange(range);
                if (range !== 'Custom Range') {
                  setIsOpen(false);
                }
              }}
            >
              {range}
            </button>
          ))}
          {selectedDateRange === 'Custom Range' && (
            <div className="border-t border-black/5 mt-1 pt-2 flex flex-col gap-1.5">
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] text-[#072227]/60">From</label>
                <input type="date" className="bg-black/5 border border-black/10 rounded px-1.5 py-0.5 text-xs text-[#072227] outline-none" style={{colorScheme: 'light'}} />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] text-[#072227]/60">To</label>
                <input type="date" className="bg-black/5 border border-black/10 rounded px-1.5 py-0.5 text-xs text-[#072227] outline-none" style={{colorScheme: 'light'}} />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-1 bg-[#009FAC] hover:bg-[#00b4c4] text-white py-1 rounded-lg text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

const TemperatureChart = ({ activeTab, selectedBuoy, selectedMetric, setSelectedMetric, isMobile = false, selectedDateRange, setSelectedDateRange }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language === 'ar';
  const isWeather = activeTab === 'Weather';
  const rawData = isWeather ? weatherData : sondeData;
  const metrics = isWeather ? weatherMetrics : sondeMetrics;
  
  const containerRef = useRef(null);
  const chartRefs = useRef({});
  const isScrollingRef = useRef(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalMetric, setActiveModalMetric] = useState(null);

  // Pseudo-dynamic data generation based on selectedBuoy and metric
  const getDynamicData = (metric) => {
    const seed = (selectedBuoy?.id || 1) + (metric?.length || 0) + (selectedDateRange?.length || 0);
    return rawData.map((d, index) => {
      const variation = Math.sin(seed + index) * 5;
      return {
        ...d,
        label: `${d.time},\n${d.hour}`,
        value: Math.max(0, d.temp + variation)
      };
    });
  };

  const metricKeyMap = {
    'Water Temperature (°c)': 'dashboard.waterTemperature',
    'Salinity (ppt)': 'dashboard.salinity',
    'Chlorophyll (ug)': 'dashboard.chlorophyll',
    'Dissolved Oxygen (mg/l)': 'dashboard.dissolvedOxygen',
    'pH': 'dashboard.ph',
    'Turbidity (NTU)': 'dashboard.turbidity',
    'Blue-Green Algae (ug)': 'dashboard.blueGreenAlgae',
    'Depth(m)': 'dashboard.depth',
    'Specific Conductivity(uS)': 'dashboard.specificConductivity',
    'Air Temperature (°c)': 'dashboard.airTemperature',
    'Relative Humidity (%)': 'dashboard.relativeHumidity',
    'AWS (m/s)': 'dashboard.aws',
    'AWD (Degree)': 'dashboard.awd',
    'Wind Gust (Wind Gust)': 'dashboard.windGust',
    'Pressure (bar)': 'dashboard.pressure'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const metric = entry.target.getAttribute('data-metric');
            if (metric && setSelectedMetric) {
              setSelectedMetric(metric);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6 // 60% visibility
      }
    );

    const elements = Object.values(chartRefs.current);
    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [metrics, setSelectedMetric]);

  const smoothScrollTo = (targetY, duration) => {
    const container = containerRef.current;
    if (!container) return;
    
    isScrollingRef.current = true;
    
    const startY = container.scrollTop;
    const distance = targetY - startY;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function: easeInOutQuad
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      container.scrollTop = startY + distance * ease;

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        isScrollingRef.current = false;
      }
    };

    requestAnimationFrame(animation);
  };

  const activeMetrics = metrics.filter(m => m === selectedMetric);
  const displayMetrics = activeMetrics.length > 0 ? activeMetrics : [metrics[0]];

  return (
    <div 
      ref={containerRef}
      className="flex flex-col relative overflow-hidden h-full"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: isMobile ? '16px' : '24px',
        padding: isMobile ? '10px' : '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        border: isMobile ? '1px solid rgba(255,255,255,0.5)' : 'none',
        backdropFilter: 'blur(8px)',
        width: '100%'
      }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 159, 172, 0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 159, 172, 0.4); }
      `}</style>

      {displayMetrics.map((metric) => {
        const currentData = getDynamicData(metric);
        const translatedTitle = metricKeyMap[metric] ? t(metricKeyMap[metric]) : metric;
        
        return (
          <div 
            key={metric}
            ref={(el) => (chartRefs.current[metric] = el)}
            data-metric={metric}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className={`flex justify-between items-center ${isMobile ? 'mb-1' : 'mb-3'}`}>
              <h3 className={`${isMobile ? 'text-[14px]' : 'text-[16px]'} font-bold text-[#072227] tracking-tight`}>
                {translatedTitle}
              </h3>
              <div className="flex items-center gap-2">
                {!isMobile && setSelectedDateRange && (
                  <DateRangeDropdown 
                    selectedDateRange={selectedDateRange} 
                    setSelectedDateRange={setSelectedDateRange} 
                    isMobile={isMobile}
                  />
                )}
                <button 
                  onClick={() => {
                    setActiveModalMetric(metric);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-400 hover:text-[#009FAC] transition-all p-1.5 bg-white/60 rounded-lg shadow-sm border border-white/40 cursor-pointer"
                >
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData} margin={{ top: 10, right: 15, left: -20, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1DCDDD" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1DCDDD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={true} stroke="rgba(0,0,0,0.1)" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false}
                    tickLine={false}
                    tick={<CustomXAxisTick />}
                    interval={0}
                    height={35}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "rgba(0,0,0,0.45)", fontWeight: 500 }}
                    domain={['auto', 'auto']}
                    width={45}
                  />
                  <Tooltip 
                    content={<CustomTooltip selectedMetric={metric} />} 
                    cursor={{ stroke: 'rgba(0,159,172,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1DCDDD" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                    dot={{ r: 4, fill: '#ffffff', stroke: '#1DCDDD', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#ffffff', stroke: '#1DCDDD', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
      
      {isModalOpen && createPortal(
        <ChartModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          metric={activeModalMetric} 
          data={getDynamicData(activeModalMetric)} 
        />,
        document.body
      )}
    </div>
  );
};

export default TemperatureChart;
