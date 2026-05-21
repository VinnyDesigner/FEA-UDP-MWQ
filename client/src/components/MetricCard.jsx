import React from 'react';

const MetricCard = ({ label, value, icon: Icon, isSelected, onClick, isMobile = false }) => {
  const cardStyle = {
    borderRadius: '20px',
    border: isSelected ? '1px solid #009FAC' : '1px solid rgba(255, 255, 255, 0.10)',
    background: isSelected ? '#BBE6E9' : 'rgba(255, 255, 255, 0.60)',
    boxShadow: isSelected 
      ? '0 4px 24px 0 rgba(0, 159, 172, 0.50) inset' 
      : '0 4px 4px 0 rgba(255, 255, 255, 0.40) inset',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    height: '100%'
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-row items-center gap-2 p-2 select-none cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={cardStyle}
    >
      {/* Left Icon Section */}
      <div className="flex-shrink-0 flex items-center justify-center">
        {typeof Icon === 'string' ? (
          <img 
            src={Icon} 
            alt={label} 
            className={`${isMobile ? 'w-5 h-5' : 'w-[22px] h-[22px]'} object-contain`}
          />
        ) : (
          <Icon size={isMobile ? 18 : 22} className={isSelected ? 'text-[#009FAC]' : 'text-[#072227]'} strokeWidth={1.5} />
        )}
      </div>

      {/* Right Text Section */}
      <div className="flex flex-col justify-center min-w-0 ltr:text-left rtl:text-right">
        <p className={`text-[10px] md:text-[11px] font-semibold leading-tight tracking-tight ${isSelected ? 'text-[#072227] font-bold' : 'text-[#585858]'}`}>
          {label}
        </p>
        <p className={`text-[12px] md:text-[13px] font-bold mt-0.5 leading-none ${isSelected ? 'text-[#072227]' : 'text-[#585858]'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default MetricCard;
