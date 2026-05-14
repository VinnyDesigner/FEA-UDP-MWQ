import React from 'react';
import { Clock, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BuoyStatusCard = ({ activeTab, selectedBuoy, isMobile = false }) => {
  const { t } = useTranslation();
  const isWeather = activeTab === 'Weather';
  const buoyName = selectedBuoy ? selectedBuoy.name : 'AL Aqah Buoy';
  const buoyTemp = selectedBuoy ? selectedBuoy.temp : '25.1';
  const updatedTime = selectedBuoy ? selectedBuoy.updated : '2 min ago';
  const dataInterval = selectedBuoy ? selectedBuoy.interval : (isWeather ? '10 min' : '30 min');

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
            <p className="text-white/80 text-[12px] mb-0.5">{isWeather ? t('dashboard.airTemperature') : t('dashboard.waterTemperature')}</p>
            <div className="flex items-baseline justify-center mb-1">
              <span className="font-bold leading-none" style={{ fontSize: '36px', color: '#1DCDDD', textShadow: '0 0 24px rgba(29,205,221,0.6)' }}>
                {isWeather ? (parseFloat(buoyTemp) - 2.7).toFixed(1) : buoyTemp}
              </span>
              <span className="text-base font-bold text-[#1DCDDD] rtl:mr-1 ltr:ml-1">°C</span>
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
              <p className="text-white/80 text-[16px]">{isWeather ? t('dashboard.airTemperature') : t('dashboard.waterTemperature')}</p>
              <div className="flex items-baseline">
                <span className="font-bold" style={{ fontSize: '48px', color: '#1DCDDD', textShadow: '0 0 30px rgba(29,205,221,0.6)' }}>
                  {isWeather ? (parseFloat(buoyTemp) - 2.7).toFixed(1) : buoyTemp}
                </span>
                <span className="text-2xl font-bold text-[#1DCDDD] rtl:mr-1 ltr:ml-1">°C</span>
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
          {isWeather ? t('dashboard.airTemperature') : t('dashboard.waterTemperature')}
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
            {isWeather ? (parseFloat(buoyTemp) - 2.7).toFixed(1) : buoyTemp}
          </span>
          <span className="text-4xl mt-2 font-bold text-[#1DCDDD]" style={{ textShadow: '0 0 20px rgba(29,205,221,0.5)' }}>°c</span>
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
