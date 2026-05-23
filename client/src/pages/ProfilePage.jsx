import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import GlobalHeader from '../components/GlobalHeader';
import MobileHeader from '../components/MobileHeader';
import MobileSidebar from '../components/MobileSidebar';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'FEA',
    lastName: 'Admin',
    email: 'Jahangir@fea.com',
    phoneNumber: '+971 563872839',
    organization: 'iSpatial Techno Solutions',
    emiratesId: '+971 563872839',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile Updated successfully!');
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    borderRadius: '10px',
    color: 'white',
    padding: '11px 16px',
    fontSize: '13.5px',
    fontWeight: '500',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    opacity: '0.85',
    marginBottom: '6px',
  };

  const buttonStyle = {
    background: 'radial-gradient(50% 50% at 50% 50%, #1DCDDD 0%, #009FAC 100%)',
    borderRadius: '29.455px',
    boxShadow: '0 0 50px 0 rgba(0, 159, 172, 0.30), 0 0 1px 4px rgba(255, 255, 255, 0.10), 0 -4px 2px 0 rgba(0, 0, 0, 0.25) inset, 0 2px 1px 0 rgba(255, 255, 255, 0.25) inset',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '13.5px',
    padding: '11px 32px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

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
                  Profile Settings
                </h1>
                <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed opacity-75">
                  Update your details or change the password
                </p>
              </div>

              {/* Form Container (Mobile) */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 p-6 rounded-[20px] border border-white/10"
                style={{
                  background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.10) 100%)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label style={labelStyle}>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label style={labelStyle}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label style={labelStyle}>Phone Number</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label style={labelStyle}>Organization</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label style={labelStyle}>Emirates ID</label>
                    <input type="text" name="emiratesId" value={formData.emiratesId} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 mt-4">
                  <button type="button" style={buttonStyle} className="hover:scale-[1.02] active:scale-[0.98]">Change Password</button>
                  <button type="submit" style={buttonStyle} className="hover:scale-[1.02] active:scale-[0.98]">Update Profile</button>
                </div>
              </form>
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
                Profile Settings
              </h1>
              <p className="text-[12.5px] text-gray-400 mt-0.5 opacity-80">
                Update your details or change the password
              </p>
            </div>

            {/* Form Section (Unified Inner Glass Container matching screenshot) */}
            <div className="flex-grow flex items-start justify-start pt-2 overflow-y-auto no-scrollbar">
              <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-[850px] flex flex-col gap-8"
                style={{
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'radial-gradient(251.65% 89.92% at 50.22% 50.31%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.20)',
                  padding: '36px 40px',
                }}
              >
                {/* 2-Column Grid of Inputs */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* First Name */}
                  <div className="flex flex-col">
                    <label style={labelStyle}>First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      style={inputStyle} 
                      className="hover:border-white/35 focus:border-[#1DCDDD] focus:bg-white/10"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col">
                    <label style={labelStyle}>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      style={inputStyle} 
                      className="hover:border-white/35 focus:border-[#1DCDDD] focus:bg-white/10"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label style={labelStyle}>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      style={inputStyle} 
                      className="hover:border-white/35 focus:border-[#1DCDDD] focus:bg-white/10"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col">
                    <label style={labelStyle}>Phone Number</label>
                    <input 
                      type="text" 
                      name="phoneNumber" 
                      value={formData.phoneNumber} 
                      onChange={handleChange} 
                      style={inputStyle} 
                      className="hover:border-white/35 focus:border-[#1DCDDD] focus:bg-white/10"
                    />
                  </div>

                  {/* Organization */}
                  <div className="flex flex-col">
                    <label style={labelStyle}>Organization</label>
                    <input 
                      type="text" 
                      name="organization" 
                      value={formData.organization} 
                      onChange={handleChange} 
                      style={inputStyle} 
                      className="hover:border-white/35 focus:border-[#1DCDDD] focus:bg-white/10"
                    />
                  </div>

                  {/* Emirates ID */}
                  <div className="flex flex-col">
                    <label style={labelStyle}>Emirates ID</label>
                    <input 
                      type="text" 
                      name="emiratesId" 
                      value={formData.emiratesId} 
                      onChange={handleChange} 
                      style={inputStyle} 
                      className="hover:border-white/35 focus:border-[#1DCDDD] focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Bottom Action Buttons Center Aligned */}
                <div className="flex items-center justify-center gap-6 mt-2">
                  <button 
                    type="button" 
                    style={buttonStyle} 
                    className="hover:scale-[1.03] active:scale-[0.97]"
                  >
                    Change Password
                  </button>
                  <button 
                    type="submit" 
                    style={buttonStyle} 
                    className="hover:scale-[1.03] active:scale-[0.97]"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
