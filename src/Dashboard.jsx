import { useState, useReducer, useEffect, useCallback, memo, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

// Custom Hooks
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

// Reducer
const sidebarReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case 'CLOSE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: false };
    default:
      return state;
  }
};

// Constants
const CARD_ICONS = {
  Maintenance: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",
  Transportation: "M18.92 6.01C18.72 5.4 18.17 5 17.54 5H6.46c-.63 0-1.18.4-1.38 1.01L3 11v7a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-7l-2.08-4.99ZM6.85 7h10.3l1.37 3.3c.11.26.18.53.18.8V12H5v-.9c0-.27.06-.54.18-.8L6.85 7ZM6 14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm12 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
  Reservation: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
};

const MENU_ITEMS = [
  { 
    text: "Dashboard",
    to: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  },
  {
    text: "Notifications",
    to: "/notifications",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  },
  {
    text: "Settings",
    to: "/settings",
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  },
  {
    text: "Logout",
    to: "/loginpage",
    icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
  }
];

const DASHBOARD_CARDS = ['Maintenance', 'Transportation', 'Reservation'];
const SCHEDULE_ITEMS = ['Team Meeting', 'Project Deadline', 'System Maintenance'];

// Components
const Icon = memo(({ path, className }) => (
  <svg 
    className={className}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d={path} 
    />
  </svg>
));

const DashboardCard = memo(({ item, onClick }) => (
  <div
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <Icon 
        path={CARD_ICONS[item]} 
        className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors"
      />
      <h3 className="text-lg md:text-xl font-bold text-gray-800">
        {item}
      </h3>
    </div>
  </div>
));
const SidebarItem = memo(({ item, isSidebarCollapsed }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) => 
      `flex items-center p-2 rounded-lg hover:bg-gray-700 transition-all group relative ${
        isActive ? 'bg-gray-800' : ''
      }`}
  >
    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center"> 
      <Icon 
        path={item.icon} 
        className="w-full h-full transition-transform hover:scale-110" 
      />
    </div>
    <span className={`ml-3 transition-all duration-300 ${
      !isSidebarCollapsed ? 'opacity-100 max-w-40' : 'opacity-0 max-w-0 overflow-hidden'
    }`}>
      {item.text}
    </span>
    
    {isSidebarCollapsed && (
      <span className="absolute left-full ml-2 px-2 py-1 text-sm bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        {item.text}
      </span>
    )}
  </NavLink>
));

const Header = memo(({ 
  isMobileMenuOpen, 
  onToggleMobileMenu,
  onCloseMobileMenu 
}) => {
  const mobileMenuRef = useRef(null);
  
  useClickOutside(mobileMenuRef, () => {
    if (isMobileMenuOpen) onCloseMobileMenu();
  });

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center relative">
      <span className="text-xl md:text-2xl font-extrabold tracking-tight">
        ManageIT 
      </span>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg border-2 border-white transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={mobileMenuRef}
        className={`absolute md:hidden top-full right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-30 transition-all duration-300 ease-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="py-2">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.text}
              to={item.to}
              className="flex items-center px-4 py-3 text-sm hover:bg-gray-700 transition-colors"
              onClick={onCloseMobileMenu}
            >
              <Icon path={item.icon} className="w-5 h-5 mr-3" />
              {item.text}
            </NavLink>
          ))}
        </nav>
        <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-700">
          Created By Bantilan & Friends
        </div>
      </div>
    </header>
  );
});
const Sidebar = memo(({ 
  isSidebarCollapsed, 
  onToggleSidebar 
}) => (
  <aside className={`hidden md:block bg-gray-900 text-white transition-[width] duration-300 ease-in-out relative h-full z-20 ${
    isSidebarCollapsed ? 'w-16' : 'w-64'
  }`}>
    <div className="p-4 flex flex-col justify-between h-full">
      <div>
        <button
          onClick={onToggleSidebar}
          className="w-full bg-gray-900 text-white p-2 rounded-lg border-2 border-white transition-colors mb-4 text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isSidebarCollapsed ? '☰' : 'Collapse'}
        </button>

        <h2 className={`text-sm md:text-base font-bold mb-4 transition-opacity ${
          !isSidebarCollapsed ? 'opacity-100' : 'opacity-0'
        }`}>
          USER
        </h2>

        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <SidebarItem
              key={item.text}
              item={item}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          ))}
        </nav>
      </div>

      <div className={`text-center text-xs md:text-sm text-gray-400 transition-opacity ${
        !isSidebarCollapsed ? 'opacity-100' : 'opacity-0'
      }`}>
        Created By Bantilan & Friends
      </div>
    </div>
  </aside>
));


const ScheduleSidebar = memo(() => (
  <aside className="hidden lg:block lg:w-1/4 bg-white/90 p-4 border-l backdrop-blur-sm">
    <h2 className="text-xl font-bold mb-4 text-gray-800">Schedules & Reminders</h2>
    <div className="space-y-3">
      {SCHEDULE_ITEMS.map((event) => (
        <div 
          key={event} 
          className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
        >
          <div className="absolute left-3 top-3.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <p className="text-sm text-gray-700 pl-4 font-medium">{event}</p>
          <span className="text-xs text-gray-400 pl-4">Today 3:00 PM</span>
        </div>
      ))}
    </div>
  </aside>
));

const DashboardContent = memo(({ onCardClick }) => (
  <main className="flex-1 p-6 overflow-hidden bg-white/95 backdrop-blur-sm">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
      Dashboard 
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {DASHBOARD_CARDS.map((item) => (
        <DashboardCard
          key={item}
          item={item}
          onClick={() => onCardClick(item)}
        />
      ))}
    </div>
  </main>
));

// Main Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(sidebarReducer, {
    isSidebarCollapsed: true,
    isMobileMenuOpen: false
  });

  const handleNavigation = useCallback((item) => {
    if (item === 'Maintenance') navigate('/maintenance');
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        isMobileMenuOpen={state.isMobileMenuOpen}
        onToggleMobileMenu={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
        onCloseMobileMenu={() => dispatch({ type: 'CLOSE_MOBILE_MENU' })}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isSidebarCollapsed={state.isSidebarCollapsed}
          onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
        
        <DashboardContent onCardClick={handleNavigation} />
        
        <ScheduleSidebar />
      </div>
    </div>
  );
};

export default Dashboard;