import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navItems = [
  { icon: '/assets/nav/home.png', labelKey: 'nav.dashboard', path: '/dashboard' },
  { icon: '/assets/nav/analytics.png', labelKey: 'nav.misAnalytics', path: '/mis-analytics' },
  { icon: '/assets/nav/reports.png', labelKey: 'nav.reports', path: '/reports' },
  { icon: '/assets/nav/help.png', labelKey: 'nav.faq', path: '/faq' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pillStyle = {
    borderRadius: '40px',
    border: '1px solid rgba(0, 0, 0, 0.10)',
    background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.14) 100%)',
    boxShadow: '3px 3px 4px 0 rgba(255, 255, 255, 0.17) inset',
    backdropFilter: 'blur(10px)',
    width: '60px',
  };

  return (
    <aside 
      className="hidden md:flex w-[80px] min-w-[80px] flex-col items-center pb-[8px] flex-shrink-0 z-[1100] pointer-events-auto bg-transparent fixed left-0 top-[80px] bottom-0 gap-6" 
      style={{ height: 'calc(100vh - 80px)' }}
    >
      
      {/* Top Navigation Pill (Extended Height) */}
      <div 
        className="flex flex-col items-center py-[20px] gap-[18px] w-[60px] flex-grow justify-start"
        style={pillStyle}
      >
        {navItems.map(({ icon: IconSrc, labelKey, path }) => (
          <NavLink
            key={labelKey}
            to={path}
            title={t(labelKey)}
            className="flex items-center justify-center transition-all w-[42px] h-[42px] group relative"
            style={({ isActive }) => isActive ? {
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(29, 205, 221, 0.06) 0%, rgba(29, 205, 221, 0.24) 100%)',
              boxShadow: '3px 3px 38px 0 #009FAC inset',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <img 
                  src={IconSrc} 
                  alt={t(labelKey)} 
                  className="w-5 h-5 object-contain transition-opacity duration-300" 
                  style={{ opacity: isActive ? 1 : 0.6 }}
                />
                <span className="absolute left-[70px] bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[9999]">
                  {t(labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Profile & Logout Pill */}
      <div 
        className="flex flex-col items-center py-[20px] gap-[18px] w-[60px] flex-shrink-0"
        style={pillStyle}
      >
        {/* Logout Button */}
        <button
          title={t('nav.logout') || 'Logout'}
          onClick={() => navigate('/signin')}
          className="flex items-center justify-center transition-all w-[42px] h-[42px] group relative text-white"
        >
          <LogOut size={20} strokeWidth={2.5} className="transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
          <span className="absolute left-[70px] bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[9999]">
            {t('nav.logout') || 'Logout'}
          </span>
        </button>

        {/* User Profile */}
        <button
          title={t('nav.userProfile') || 'Profile'}
          className="flex items-center justify-center transition-all w-[42px] h-[42px] group relative"
          style={{
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(29, 205, 221, 0.06) 0%, rgba(29, 205, 221, 0.24) 100%)',
            boxShadow: '3px 3px 38px 0 #009FAC inset',
          }}
        >
          <User size={20} color="#ffffff" strokeWidth={2.5} />
          <span className="absolute left-[70px] bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[9999]">
            {t('nav.userProfile') || 'Profile'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

