import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      <text x={0} y={15} dy={0} textAnchor="middle" fill="#6B7280" fontSize={9} fontWeight="400">
        {parts[0]}
      </text>
      <text x={0} y={26} dy={0} textAnchor="middle" fill="#6B7280" fontSize={9} fontWeight="500">
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

const TemperatureChart = ({ activeTab, selectedBuoy, selectedMetric, isMobile = false }) => {
  const { t } = useTranslation();
  const isWeather = activeTab === 'Weather';
  const rawData = isWeather ? weatherData : sondeData;
  
  // Pseudo-dynamic data generation based on selectedBuoy and selectedMetric
  const getDynamicData = () => {
    const seed = (selectedBuoy?.id || 1) + (selectedMetric?.length || 0);
    return rawData.map((d, index) => {
      const variation = Math.sin(seed + index) * 5;
      return {
        ...d,
        label: `${d.time},\n${d.hour}`,
        value: Math.max(0, d.temp + variation)
      };
    });
  };

  const currentData = getDynamicData();
  const metricName = selectedMetric || (isWeather ? 'Air Temperature (°c)' : 'Water Temperature (°c)');
  
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

  const translatedTitle = metricKeyMap[metricName] ? t(metricKeyMap[metricName]) : metricName;

  return (
    <div 
      className="flex flex-col h-full relative"
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        borderRadius: isMobile ? '20px' : '24px',
        padding: isMobile ? '12px 14px' : '16px 20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
        border: '1px solid rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className={`flex justify-between items-start ${isMobile ? 'mb-2' : 'mb-4'}`}>
        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[19px]'} font-bold text-[#072227] tracking-tight`}>
          {translatedTitle}
        </h3>
        <button className="text-gray-400 hover:text-[#009FAC] transition-all p-1 bg-white/60 rounded-lg shadow-sm border border-white/40">
          <Maximize2 size={10} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 30, left: -20, bottom: 20 }}>
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
              height={50}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(0,0,0,0.45)", fontWeight: 500 }}
              domain={['auto', 'auto']}
              width={45}
            />
            <Tooltip 
              content={<CustomTooltip selectedMetric={selectedMetric} />} 
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
};

export default TemperatureChart;
