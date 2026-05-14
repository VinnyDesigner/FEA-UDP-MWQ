import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const data = [
  { month: 'Feb', waterTemp: 3500, algae: 2000 },
  { month: 'Apr', waterTemp: 6200, algae: 3900 },
  { month: 'Jun', waterTemp: 4600, algae: 2800 },
  { month: 'Aug', waterTemp: 8400, algae: 5200 },
  { month: 'Oct', waterTemp: 6500, algae: 4200 },
  { month: 'Dec', waterTemp: 19000, algae: 12000 },
  { month: 'Feb', waterTemp: 11500, algae: 7200 },
];

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div 
        className="backdrop-blur-[20px] border border-white/10 p-5 rounded-[20px] shadow-2xl min-w-[220px]"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex flex-col gap-1.5 ltr:text-left rtl:text-right">
          <p className="text-[13px] text-white">
            <span className="font-bold opacity-90">{t('analytics.parameters')} :</span> <span className="opacity-80">{t('dashboard.blueGreenAlgae')}</span>
          </p>
          <p className="text-[13px] text-white">
            <span className="font-bold opacity-90">{t('analytics.station')} :</span> <span className="opacity-80">{t('analytics.stationName')}</span>
          </p>
          <p className="text-[13px] text-white">
            <span className="font-bold opacity-90">{t('analytics.details')} :</span> <span className="opacity-80">{payload[0].value}</span>
          </p>
          <p className="text-[13px] text-white">
            <span className="font-bold opacity-90">{t('analytics.duration')} :</span> <span className="opacity-80">{t(`analytics.months.${label.toLowerCase()}`, label)} 2025</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const BuoysChart = ({ isMobile = false, showHeader = true }) => {
  const { t } = useTranslation();
  return (
    <div className={`w-full flex flex-col ${isMobile ? 'min-h-[420px]' : 'h-full'}`}>
      {showHeader && (
        <div className="flex justify-between items-start mb-4">
          <h2 className={`text-[18px] font-bold text-white leading-tight ${isMobile ? 'max-w-[160px]' : ''}`}>
            {t('analytics.buoysOverview')}
          </h2>
          <button 
            className="flex items-center gap-2 px-6 py-2 text-[14px] transition-all hover:brightness-110 active:scale-95"
            style={{
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.30)',
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.25) 100%)',
              boxShadow: '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset',
              color: '#FFFFFF',
              fontWeight: '400',
              backdropFilter: 'blur(10px)'
            }}
          >
            {t('common.download')}
            <ChevronDown size={16} className="text-white/70" />
          </button>
        </div>
      )}

      {/* Chart Area */}
      <div className={`w-full ${isMobile ? 'min-h-[340px] flex justify-center' : ''}`}>
        <div className={isMobile ? 'w-full h-[320px]' : 'w-full h-[300px]'}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={isMobile ? { top: 10, right: 10, left: -25, bottom: 30 } : { top: 20, right: 30, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAlgae" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1DCDDD" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#1DCDDD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={true} stroke="#CACBCE" strokeWidth={1} strokeOpacity={0.2} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => t(`analytics.months.${value.toLowerCase()}`, value)}
                tick={{ fontSize: isMobile ? 12 : 13, fill: 'rgba(255,255,255,0.6)', fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                ticks={[0, 5000, 10000, 15000, 20000]}
                tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}K`}
                tick={{ fontSize: isMobile ? 12 : 13, fill: 'rgba(255,255,255,0.6)', fontWeight: 500 }}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }} 
              />
              <Area 
                type="monotone" 
                dataKey="waterTemp" 
                name={isMobile ? t('dashboard.waterTemperature') : `${t('analytics.stationName')} (${t('dashboard.waterTemperature')})`}
                stroke="#F59E0B" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWater)" 
                dot={{ r: 4, fill: '#ffffff', stroke: '#F59E0B', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#F59E0B', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="algae" 
                name={isMobile ? t('dashboard.blueGreenAlgae') : `${t('analytics.stationName')} (${t('dashboard.blueGreenAlgae')})`}
                stroke="#1DCDDD" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAlgae)" 
                dot={{ r: 4, fill: '#ffffff', stroke: '#1DCDDD', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#1DCDDD', strokeWidth: 2 }}
              />
              {isMobile && (
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  height={60} 
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => <span className="text-white/90 font-medium ml-2 text-[12px] whitespace-normal">{value}</span>}
                  wrapperStyle={{ 
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "10px",
                    textAlign: "center",
                    paddingTop: "20px",
                    width: "100%",
                    position: "relative"
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desktop-only: Custom Legend + Divider */}
      {!isMobile && (
        <>
          <div className="flex items-center justify-center gap-6 pt-3 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#1DCDDD' }} />
              <span className="text-[13px] text-white/80 font-medium">{t('analytics.stationName')} ({t('dashboard.blueGreenAlgae')})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#F59E0B' }} />
              <span className="text-[13px] text-white/80 font-medium">{t('analytics.stationName')} ({t('dashboard.waterTemperature')})</span>
            </div>
          </div>
          <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </>
      )}
    </div>
  );
};

export default BuoysChart;
