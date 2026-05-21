import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';

const GlobalHeader = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageToggle = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header 
      className="flex items-center justify-between w-full h-[80px] px-[30px] z-50 absolute top-0 left-0 right-0 pointer-events-auto bg-transparent"
    >
      {/* Left: Logo */}
      <div className="flex items-center w-1/4">
        <div className="h-12 flex items-center justify-start">
          <img src={logo} alt="Fujairah Environment Authority Logo" className="h-full object-contain" />
        </div>
      </div>

      {/* Center: Title */}
      <div className="flex flex-col items-center justify-center w-2/4 text-center">
        <h1 className="text-[20px] font-bold text-white tracking-wide" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          Marine Water Quality Monitoring Dashboard
        </h1>
      </div>

      {/* Right: Language Toggle */}
      <div className="flex items-center justify-end w-1/4">
        <div 
          className="flex items-center rounded-full p-[4px] cursor-pointer gap-[4px]"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.10)',
            background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.14) 100%)',
            boxShadow: '3px 3px 4px 0 rgba(255, 255, 255, 0.17) inset',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div 
            onClick={() => handleLanguageToggle('ar')}
            className="flex items-center justify-center w-[42px] h-[42px] transition-all"
            style={i18n.language === 'ar' ? {
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(29, 205, 221, 0.06) 0%, rgba(29, 205, 221, 0.24) 100%)',
              boxShadow: '3px 3px 38px 0 #009FAC inset',
            } : { borderRadius: '50px' }}
          >
            <span className={`text-[15px] font-bold ${i18n.language === 'ar' ? 'text-white' : 'text-white/60'}`}>
              ع
            </span>
          </div>
          <div 
            onClick={() => handleLanguageToggle('en')}
            className="flex items-center justify-center w-[42px] h-[42px] transition-all"
            style={i18n.language === 'en' ? {
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(29, 205, 221, 0.06) 0%, rgba(29, 205, 221, 0.24) 100%)',
              boxShadow: '3px 3px 38px 0 #009FAC inset',
            } : { borderRadius: '50px' }}
          >
            <span className={`text-[15px] font-bold ${i18n.language === 'en' ? 'text-white' : 'text-white/60'}`}>
              En
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
