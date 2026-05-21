import React from 'react';
import { Clock, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BuoyStatusCard = ({ activeTab, selectedBuoy, selectedMetric, isMobile = false }) => {
  const { t } = useTranslation();
  const isWeather = activeTab === 'Weather';
  const buoyName = selectedBuoy ? selectedBuoy.name : 'AL Aqah Buoy';
  const updatedTime = selectedBuoy ? selectedBuoy.updated : '2 min ago';
  const dataInterval = selectedBuoy ? selectedBuoy.interval : (isWeather ? '10 min' : '30 min');

  const defaultMetric = isWeather ? 'Air Temperature (°c)' : 'Water Temperature (°c)';
  const currentMetric = selectedMetric || defaultMetric;

  // Extract label and unit
  const metricParts = currentMetric.split('(');
  const metricLabel = metricParts[0].trim();
  const metricUnit = metricParts[1] ? metricParts[1].replace(')', '') : '';

  // Generate pseudo-dynamic value based on metric and buoy
  const getValue = () => {
    const seed = (selectedBuoy?.id || 1) + (currentMetric.length || 0);
    const variation = Math.sin(seed) * 5;
    
    const baseValues = {
      'Water Temperature (°c)': 25.1,
      'Salinity (ppt)': 36.4,
      'Chlorophyll (ug)': 1.7,
      'Dissolved Oxygen (mg/l)': 5.63,
      'pH': 7.97,
      'Turbidity (NTU)': 0.02,
      'Blue-Green Algae (ug)': 0.65,
      'Depth(m)': 166,
      'Specific Conductivity(uS)': 12.5,
      'Air Temperature (°c)': 24.2,
      'Relative Humidity (%)': 65,
      'AWS (m/s)': 4.2,
      'AWD (Degree)': 120,
      'Wind Gust (Wind Gust)': 6.5,
      'Pressure (bar)': 1.013
    };

    const base = baseValues[currentMetric] || 25.0;
    const value = base + variation;
    
    if (currentMetric.includes('pH') || currentMetric.includes('Turbidity') || currentMetric.includes('Algae') || currentMetric.includes('Chlorophyll') || currentMetric.includes('Oxygen')) {
      return value.toFixed(2);
    }
    if (currentMetric.includes('Temperature') || currentMetric.includes('Salinity') || currentMetric.includes('Conductivity')) {
      return value.toFixed(1);
    }
    return Math.round(value).toString();
  };

  const displayValue = getValue();

  const getMinMax = () => {
    const val = parseFloat(displayValue);
    if (isNaN(val)) return { min: '--', max: '--' };
    
    const seed = (selectedBuoy?.id || 1) + (currentMetric.length || 0);
    const variation = Math.abs(Math.cos(seed) * (val * 0.15)); // 15% variation
    
    const minVal = Math.max(0, val - variation);
    const maxVal = val + variation;
    
    const precision = displayValue.includes('.') ? displayValue.split('.')[1].length : 0;
    
    return {
      min: minVal.toFixed(precision),
      max: maxVal.toFixed(precision)
    };
  };

  const { min, max } = getMinMax();

  if (isMobile) {
    return (
      <>
        {/* --- MOBILE VERTICAL CARD (< 768px) --- */}
        <div
          className="flex md:hidden flex-col flex-shrink-0 z-[1200] relative overflow-y-auto shadow-2xl"
          style={{
            width: '100%',
            height: '220px',
            borderRadius: '20px',
            padding: '14px 14px 12px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#00161A'
          }}
        >
          <img 
            src="/assets/buoy-bg.png" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
          />
          <div className="flex justify-center relative z-10 mb-0.5">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="/assets/buoy-icon.png" alt="Buoy" className="w-full h-full object-contain drop-shadow-[0_0_16px_rgba(29,205,221,0.5)]" />
            </div>
          </div>
          <div className="flex flex-col items-center z-10 text-center">
            <p className="text-[11px] text-white/70 mb-0.5">{t('dashboard.locationName')}</p>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <p className="text-[18px] font-bold text-white tracking-wide uppercase">{buoyName}</p>
            </div>
            <div className="w-full h-[1px] bg-white/10 mb-1" />
            <p className="text-white/80 text-[12px] mb-0.5">{metricLabel}</p>
            <div className="flex items-baseline justify-center mb-1">
              <span className="font-bold leading-none" style={{ fontSize: '36px', color: '#1DCDDD', textShadow: '0 0 24px rgba(29,205,221,0.6)' }}>
                {displayValue}
              </span>
              {metricUnit && (
                <span className="text-base font-bold text-[#1DCDDD] rtl:mr-1 ltr:ml-1">{metricUnit}</span>
              )}
            </div>
            <div className="flex gap-2 mb-2 justify-center text-[10px] text-white/50">
              <span>Min: <span className="text-white font-semibold">{min}{metricUnit}</span></span>
              <span>|</span>
              <span>Max: <span className="text-white font-semibold">{max}{metricUnit}</span></span>
            </div>
            <div className="w-full h-[1px] bg-white/10 mb-2" />
          </div>
          <div className="flex items-stretch justify-between z-10">
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] text-white/60"><Clock size={12} /><span>{t('dashboard.updated')}</span></div>
              <span className="text-[13px] font-semibold text-white">{updatedTime}</span>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] text-white/60"><Activity size={12} /><span>{t('dashboard.dataInterval')}</span></div>
              <span className="text-[13px] font-semibold text-white">{dataInterval}</span>
            </div>
          </div>
        </div>

        {/* --- TABLET HORIZONTAL CARD (768px - 1023px) --- */}
        <div
          className="hidden md:flex items-center flex-shrink-0 z-[1200] relative overflow-hidden shadow-2xl"
          style={{
            width: '100%',
            height: '160px',
            borderRadius: '24px',
            padding: '20px 24px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#00161A'
          }}
        >
          <img src="/assets/buoy-bg.png" alt="Background" className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90" />
          
          {/* Left: Icon */}
          <div className="relative z-10 w-24 flex-shrink-0">
            <img src="/assets/buoy-icon.png" alt="Buoy" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(29,205,221,0.5)]" />
          </div>

          {/* Center: Content */}
          <div className="flex-1 flex flex-col items-center z-10 px-6 ltr:border-r rtl:border-l border-white/10">
            <div className="flex flex-col items-center">
              <p className="text-[14px] text-white/60">{t('dashboard.locationName')}</p>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                <p className="text-[28px] font-bold text-white tracking-wide uppercase">{buoyName}</p>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-white/10 my-2" />

            <div className="flex items-center gap-6">
              <p className="text-white/80 text-[16px]">{metricLabel}</p>
              <div className="flex items-baseline gap-4">
                <div className="flex items-baseline">
                  <span className="font-bold" style={{ fontSize: '48px', color: '#1DCDDD', textShadow: '0 0 30px rgba(29,205,221,0.6)' }}>
                    {displayValue}
                  </span>
                  {metricUnit && (
                    <span className="text-2xl font-bold text-[#1DCDDD] rtl:mr-1 ltr:ml-1">{metricUnit}</span>
                  )}
                </div>
                <div className="flex flex-col text-xs text-white/60">
                  <span>Min: <span className="text-white font-semibold">{min}{metricUnit}</span></span>
                  <span>Max: <span className="text-white font-semibold">{max}{metricUnit}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="w-48 flex-shrink-0 flex flex-col justify-center gap-4 ltr:pl-6 rtl:pr-6 z-10">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-white/60" />
              <div className="flex flex-col">
                <span className="text-[12px] text-white/60">{t('dashboard.updated')}</span>
                <span className="text-[15px] font-semibold text-white leading-tight">{updatedTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-white/60" />
              <div className="flex flex-col">
                <span className="text-[12px] text-white/60">{t('dashboard.dataInterval')}</span>
                <span className="text-[15px] font-semibold text-white leading-tight">{dataInterval}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- DESKTOP RENDER ---
  return (
    <div
      className="flex flex-col flex-shrink-0 z-[1200] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '28px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: '#00161A'
      }}
    >
      {/* Background Image */}
      <img 
        src="/assets/buoy-bg.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
      />

      {/* Top: Buoy Illustration */}
      <div className="flex justify-center relative z-10 mb-3 mt-1">
        <div className="w-32 h-32 flex items-center justify-center">
          <img 
            src="/assets/buoy-icon.png" 
            alt="Buoy Illustration" 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(29,205,221,0.4)]" 
          />
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 z-10">
        <p className="text-[12px] text-white/60 mb-1">{t('dashboard.locationName')}</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          <p className="text-2xl font-bold text-white tracking-wide">{buoyName}</p>
        </div>

        <p className="text-white/60 font-medium text-[12px] mb-1">
          {metricLabel}
        </p>
        <div className="flex items-start justify-center">
          <span 
            className="font-black leading-none tracking-tighter"
            style={{ 
              fontSize: '72px', 
              color: '#1DCDDD', 
              textShadow: '0 0 30px rgba(29,205,221,0.6)' 
            }}
          >
            {displayValue}
          </span>
          {metricUnit && (
            <span className="text-4xl mt-2 font-bold text-[#1DCDDD]" style={{ textShadow: '0 0 20px rgba(29,205,221,0.5)' }}>{metricUnit}</span>
          )}
        </div>

        <div className="flex gap-4 mt-1 justify-center">
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <span className="text-[10px] text-white/50 uppercase">Min</span>
            <span className="text-xs font-semibold text-white">{min}{metricUnit}</span>
          </div>
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <span className="text-[10px] text-white/50 uppercase">Max</span>
            <span className="text-xs font-semibold text-white">{max}{metricUnit}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center z-10 pt-3 border-t border-white/10 mt-auto pt-4">
        <div className="flex items-center gap-1.5 text-[11px] text-white/60">
          <Clock size={12} />
          <span>{t('dashboard.updated')} {updatedTime}</span>
        </div>
        <span className="text-[11px] text-white/60">
          {t('dashboard.interval')}:{dataInterval}
        </span>
      </div>
    </div>
  );
};

export default BuoyStatusCard;
