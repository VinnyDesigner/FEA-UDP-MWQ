import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import GlobalHeader from '../components/GlobalHeader';
import MobileHeader from '../components/MobileHeader';
import MobileSidebar from '../components/MobileSidebar';
import { useTranslation } from 'react-i18next';
import { ChevronsUpDown, Edit3, Trash2, UserPlus } from 'lucide-react';

const UserManagementPage = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('User Management');

  // Initial Mock Users List matching both screenshots
  const [users, setUsers] = useState([
    { id: 1, name: 'Mohamed Ahmed', email: 'mohamedahmed@gmail.com', org: 'FEA Interface', role: 'Viewer', date: '01-05-2026', status: true },
    { id: 2, name: 'Satish Kumar', email: 'satishkumar@gmail.com', org: '-', role: 'Viewer', date: '21-04-2026', status: true },
    { id: 3, name: 'Neelima Gayatri', email: 'neelima@gmail.com', org: '-', role: 'Viewer', date: '10-04-2026', status: true },
    { id: 4, name: 'Vardhaman', email: 'vardhaman@gmail.com', org: '-', role: 'Viewer', date: '07-03-2026', status: false },
  ]);

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: !u.status } : u));
  };

  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleApprove = (user) => {
    alert(`User "${user.name}" has been successfully approved!`);
    // Optionally toggle their active status
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: true } : u));
  };

  const handleReject = (user) => {
    if (confirm(`Are you sure you want to reject user "${user.name}"?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const cardStyle = {
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.20)',
    padding: '32px 36px',
    width: '100%',
  };

  const activeTabStyle = {
    borderRadius: '20px',
    border: '1px solid #009FAC',
    background: '#BBE6E9',
    boxShadow: '0 4px 24px 0 rgba(0, 159, 172, 0.50) inset',
    backdropFilter: 'blur(12px)',
    color: '#000000',
    fontWeight: '600',
    padding: '8px 24px',
    fontSize: '12.5px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const inactiveTabStyle = {
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.25) 100%)',
    boxShadow: '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset',
    color: '#FFFFFF',
    fontWeight: '400',
    padding: '8px 24px',
    fontSize: '12.5px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const btnNewUserStyle = {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    borderRadius: '30px',
    color: 'white',
    padding: '8px 20px',
    fontSize: '12.5px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
  };

  // Dynamically set title text to match user's mockup screenshots
  const pageTitle = activeTab === 'User Management' ? 'User Management' : 'Profile Settings';
  const pageSubtitle = activeTab === 'User Management' ? 'Access the user management' : 'Update your details or change the password';

  return (
    <div className="w-screen h-screen lg:overflow-hidden p-0 flex flex-col bg-transparent relative">
      {/* Mobile/Tablet Navigation */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Desktop Global Header */}
      <div className="hidden md:block z-[2000]">
        <GlobalHeader />
      </div>

      {/* Main Content Area (Below Header) */}
      <div className="flex-1 relative md:h-[calc(100vh-80px)] flex md:flex-row flex-col md:mt-[80px] min-h-0 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Wrapper */}
        <div className="flex-1 relative h-full w-full md:ml-[92px] md:pr-[8px] md:pb-[8px] overflow-hidden flex flex-col">
          
          {/* --- RESPONSIVE LAYOUT (Mobile & Tablet < 768px) --- */}
          <div className="md:hidden flex-1 flex flex-col w-full min-h-screen bg-transparent overflow-y-auto no-scrollbar pt-[64px]">
            <style>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="p-5 md:p-10 flex-grow flex flex-col gap-6 md:min-h-[calc(100vh-64px)]"
              style={{
                background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(60, 147, 154, 0.30) 0%, rgba(28, 78, 81, 0.44) 100%)',
              }}
            >
              {/* Header Section */}
              <div className="flex flex-col mb-2">
                <h1 className="text-[17px] font-bold text-white tracking-tight leading-[1.2]">
                  {pageTitle}
                </h1>
                <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed opacity-75">
                  {pageSubtitle}
                </p>
              </div>

              {/* Tab Pills & Add Button (Mobile) */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <button style={activeTab === 'User Management' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('User Management')}>User Management</button>
                  <button style={activeTab === 'Approve User' ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab('Approve User')}>Approve User</button>
                </div>
                <button style={btnNewUserStyle} className="w-fit hover:scale-105 active:scale-95">
                  <UserPlus size={14} />
                  <span>New User</span>
                </button>
              </div>

              {/* User Grid (Mobile View Card Lists) */}
              <div className="flex flex-col gap-4">
                {users.map(user => (
                  <div key={user.id} className="p-4 rounded-xl border border-white/10 flex flex-col gap-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-semibold text-sm">{user.name}</h4>
                        <span className="text-xs text-gray-400">{user.email}</span>
                      </div>
                      
                      {activeTab === 'User Management' ? (
                        <div className="flex items-center gap-3">
                          <button className="text-white/60 hover:text-[#1DCDDD]"><Edit3 size={14} /></button>
                          <button className="text-white/60 hover:text-red-400" onClick={() => deleteUser(user.id)}><Trash2 size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleReject(user)}
                            className="w-5.5 h-5.5 rounded-full flex items-center justify-center bg-[#ea3838] text-white hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer"
                          >
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-current stroke-[3.5]"><path d="M18 6L6 18M6 6l12 12" /></svg>
                          </button>
                          <button 
                            onClick={() => handleApprove(user)}
                            className="w-5.5 h-5.5 rounded-full flex items-center justify-center bg-[#20b656] text-white hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer"
                          >
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-current stroke-[3.5]"><path d="M20 6L9 17l-5-5" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2.5 text-xs text-white/80">
                      <div><strong>Org:</strong> {user.org}</div>
                      <div><strong>Role:</strong> {user.role}</div>
                      <div><strong>Date:</strong> {user.date}</div>
                      
                      {activeTab === 'User Management' && (
                        <div className="flex items-center gap-2">
                          <strong>Status:</strong>
                          <button 
                            onClick={() => toggleStatus(user.id)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer ${user.status ? 'bg-[#22c55e]' : 'bg-white/20'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user.status ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- DESKTOP LAYOUT (>= 768px) --- */}
          <div className="hidden md:flex flex-1 flex-col min-w-0 h-full relative"
            style={{
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(60, 147, 154, 0.30) 0%, rgba(28, 78, 81, 0.44) 100%)',
              boxShadow: '3px 3px 4px 0 rgba(255, 255, 255, 0.17) inset',
              backdropFilter: 'blur(7px)',
              padding: '24px',
              overflow: 'hidden'
            }}
          >
            {/* Header Section (Inside Panel) */}
            <div className="flex flex-col mb-6">
              <h1 className="text-[17px] font-bold text-white tracking-tight leading-[1.2]">
                {pageTitle}
              </h1>
              <p className="text-[12.5px] text-gray-400 mt-0.5 opacity-80">
                {pageSubtitle}
              </p>
            </div>

            {/* Main Content Area (Glassmorphic Table Wrapper matching screenshot) */}
            <div className="flex-grow flex items-start justify-start overflow-y-auto no-scrollbar">
              <div style={cardStyle} className="flex flex-col gap-6">
                
                {/* Top Controls Row */}
                <div className="flex justify-between items-center w-full flex-shrink-0">
                  {/* Tabs */}
                  <div className="flex items-center gap-3">
                    <button 
                      style={activeTab === 'User Management' ? activeTabStyle : inactiveTabStyle}
                      onClick={() => setActiveTab('User Management')}
                    >
                      User Management
                    </button>
                    <button 
                      style={activeTab === 'Approve User' ? activeTabStyle : inactiveTabStyle}
                      onClick={() => setActiveTab('Approve User')}
                    >
                      Approve User
                    </button>
                  </div>

                  {/* Add User CTA */}
                  <button 
                    style={btnNewUserStyle} 
                    className="hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <UserPlus size={14} color="#ffffff" strokeWidth={2.5} />
                    <span>New User</span>
                  </button>
                </div>

                {/* Glassmorphic Table Container */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-4.5 px-4 text-left text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                          <div className="flex items-center gap-1.5 select-none cursor-pointer">
                            <span>User Name</span>
                            <ChevronsUpDown size={11} className="opacity-60" />
                          </div>
                        </th>
                        <th className="py-4.5 px-4 text-left text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                          <div className="flex items-center gap-1.5 select-none cursor-pointer">
                            <span>Email ID</span>
                            <ChevronsUpDown size={11} className="opacity-60" />
                          </div>
                        </th>
                        <th className="py-4.5 px-4 text-left text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                          <div className="flex items-center gap-1.5 select-none cursor-pointer">
                            <span>Organization</span>
                            <ChevronsUpDown size={11} className="opacity-60" />
                          </div>
                        </th>
                        <th className="py-4.5 px-4 text-left text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                          <div className="flex items-center gap-1.5 select-none cursor-pointer">
                            <span>Role</span>
                            <ChevronsUpDown size={11} className="opacity-60" />
                          </div>
                        </th>
                        <th className="py-4.5 px-4 text-left text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                          <div className="flex items-center gap-1.5 select-none cursor-pointer">
                            <span>Created Date</span>
                            <ChevronsUpDown size={11} className="opacity-60" />
                          </div>
                        </th>
                        
                        {activeTab === 'User Management' && (
                          <th className="py-4.5 px-4 text-left text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                            <div className="flex items-center gap-1.5 select-none cursor-pointer">
                              <span>Status</span>
                              <ChevronsUpDown size={11} className="opacity-60" />
                            </div>
                          </th>
                        )}

                        <th className="py-4.5 px-4 text-center text-white text-[12px] font-bold opacity-90 tracking-wide whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5 select-none cursor-pointer">
                            <span>Actions</span>
                            <ChevronsUpDown size={11} className="opacity-60" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr 
                          key={user.id} 
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4.5 px-4 text-left text-white text-[13.5px] font-semibold opacity-90 whitespace-nowrap">
                            {user.name}
                          </td>
                          <td className="py-4.5 px-4 text-left text-white text-[13.5px] font-medium opacity-75 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="py-4.5 px-4 text-left text-white text-[13.5px] font-medium opacity-75 whitespace-nowrap">
                            {user.org}
                          </td>
                          <td className="py-4.5 px-4 text-left text-white text-[13.5px] font-medium opacity-75 whitespace-nowrap">
                            {user.role}
                          </td>
                          <td className="py-4.5 px-4 text-left text-white text-[13.5px] font-medium opacity-75 whitespace-nowrap">
                            {user.date}
                          </td>
                          
                          {activeTab === 'User Management' && (
                            <td className="py-4.5 px-4 text-left whitespace-nowrap">
                              <button
                                onClick={() => toggleStatus(user.id)}
                                className={`w-[46px] h-6 rounded-full p-[3px] transition-colors relative cursor-pointer outline-none`}
                                style={{
                                  background: user.status 
                                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                                    : 'rgba(255,255,255,0.25)',
                                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)'
                                }}
                              >
                                <div 
                                  className={`w-[18px] h-[18px] rounded-full bg-white transition-all shadow-md`}
                                  style={{
                                    transform: user.status ? 'translateX(22px)' : 'translateX(0px)'
                                  }}
                                />
                              </button>
                            </td>
                          )}

                          <td className="py-4.5 px-4 text-center whitespace-nowrap">
                            {activeTab === 'User Management' ? (
                              <div className="flex items-center justify-center gap-4.5 text-white/60">
                                <button 
                                  className="hover:text-[#1DCDDD] hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer"
                                  title="Edit User"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button 
                                  onClick={() => deleteUser(user.id)}
                                  className="hover:text-red-400 hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                {/* Red Reject Circle button */}
                                <button 
                                  onClick={() => handleReject(user)}
                                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center bg-[#ea3838] text-white hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer shadow"
                                  title="Reject User"
                                >
                                  <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] fill-none stroke-current stroke-[3.5]"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                                {/* Green Approve Circle button */}
                                <button 
                                  onClick={() => handleApprove(user)}
                                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center bg-[#20b656] text-white hover:scale-110 active:scale-95 transition-all outline-none cursor-pointer shadow"
                                  title="Approve User"
                                >
                                  <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] fill-none stroke-current stroke-[3.5]"><path d="M20 6L9 17l-5-5" /></svg>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
