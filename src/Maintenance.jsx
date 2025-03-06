import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { 
      text: "Dashboard",
      to: "/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    },
    {
      text: "Notifications",
      to: "/notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"     },
    {
      text: "Settings",
      to: "/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    },
    {
      text: "Logout",
      to: "/loginpage",
      icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Responsive Header with Styled Hamburger */}
      <header className="bg-black text-white p-4 flex justify-between items-center relative">
        <span className="text-lg md:text-xl font-bold">ManageIT</span>
        
        {/* Boxed Hamburger Menu */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg border-2 border-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Animated Dropdown Menu */}
        <div className={`absolute md:hidden top-full right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-30
          transition-all duration-300 ease-out overflow-hidden
          ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>

          {/* Mobile Dropdown Menu */}
          <nav className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.to}
                className="flex items-center px-4 py-3 text-sm hover:bg-gray-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.text}
              </Link>
            ))}
          </nav>
          <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-700">
            Created By Bantilan & Friends
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className={`hidden md:block bg-gray-900 text-white transition-all duration-300 relative h-full z-20
        
          ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>

          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="w-full bg-gray-900 text-white p-2 rounded-lg border-2 border-white transition-colors mb-4 text-sm hover:bg-gray-800"
              >
                {isSidebarCollapsed ? '☰' : 'Collapse'}
              </button>

              <h2 className={`text-sm md:text-base font-bold mb-4 transition-opacity 
                ${!isSidebarCollapsed ? 'opacity-100' : 'opacity-0'}`}>
                USER
              </h2>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.text}
                    to={item.to}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className={`ml-2 transition-opacity ${!isSidebarCollapsed ? 'opacity-100' : 'opacity-0'}`}>
                      {item.text}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className={`text-center text-xs md:text-sm text-gray-400 transition-opacity 
              ${!isSidebarCollapsed ? 'opacity-100' : 'opacity-0'}`}>
              Created By Bantilan & Friends
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-left">Corrective Maintenance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {['Janitorial', 'Carpentry', 'Electrical', 'Air Conditioning'].map((item) => (
              <div 
                key={item}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (item === 'Janitorial') {
                    navigate('/Janitorial');
                  }

                  if (item === 'Electrical') {
                    navigate('/Electrical');n
                  }

                  if (item === 'Carpentry') {
                    navigate('/Carpentry'); 
                  }

                  if (item === 'Air Conditioning') {
                    navigate('/AirConditioning'); 
                  }
                }}
              >
                    
                <h3 className="text-base md:text-lg font-semibold text-gray-800">{item}</h3>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar (Desktop only) */}
        <aside className="hidden lg:block lg:w-1/4 bg-white p-4 border-l">
          <h2 className="text-lg font-bold mb-4">Schedules/Reminders</h2>
          <div className="space-y-4">
            {['Team Meeting', 'Project Deadline', 'System Maintenance'].map((event) => (
              <div key={event} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{event}</p>
                <span className="text-xs text-gray-400">Today 3:00 PM</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;