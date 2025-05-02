import { useState, useReducer, useEffect, useCallback, memo, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Icon from '../../components/Icon';

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

const MENU_ITEMS = [
  { 
    text: "Dashboard",
    to: "/admindashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  },
  {
    text: "Notifications",
    to: "/adminnotifications",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  },
  {
    text: "Schedules",
    to: "/adminschedules",
    icon: "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M16 2v4 M3 10h18 M8 2v4 M17 14h-6 M13 18H7 M7 14h.01 M17 18h.01"
  },
  { text: "Requests", to: "/requests", icon: "M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M12 11h4 M12 16h4 M8 11h.01 M8 16h.01"},
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

// Calendar Components
const CalendarHeader = memo(({ currentDate, prevMonth, nextMonth }) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  return (
    <div className="flex justify-between items-center mb-4 px-2">
      <button 
        onClick={prevMonth} 
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
      >
        <Icon path="M15 19l-7-7 7-7" className="w-5 h-5" />
      </button>
      <h3 className="text-xl font-bold text-gray-800">{monthName} {year}</h3>
      <button 
        onClick={nextMonth} 
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
      >
        <Icon path="M9 5l7 7-7 7" className="w-5 h-5" />
      </button>
    </div>
  );
});

const EventForm = memo(({ newEvent, setNewEvent, handleAddEvent, closeForm }) => (
  <div className="p-4 border-b border-gray-200 bg-gray-50">
    <div className="flex flex-wrap gap-2">
      <input
        type="text"
        placeholder="Event title"
        className="border p-2 rounded flex-grow text-sm"
        value={newEvent.title}
        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
      />
      <input
        type="date"
        className="border p-2 rounded text-sm"
        value={newEvent.date}
        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
      />
      <input
        type="time"
        className="border p-2 rounded text-sm"
        value={newEvent.time}
        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
      />
      <select
        className="border p-2 rounded text-sm"
        value={newEvent.color}
        onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
      >
        <option value="bg-blue-200">Blue</option>
        <option value="bg-green-200">Green</option>
        <option value="bg-pink-200">Pink</option>
        <option value="bg-yellow-200">Yellow</option>
        <option value="bg-purple-200">Purple</option>
      </select>
      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm flex-grow sm:flex-grow-0"
        >
          Save
        </button>
        <button
          onClick={closeForm}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm flex-grow sm:flex-grow-0"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
));
const DashboardContent = memo(() => {
     // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: "Team Meeting", date: "2025-03-18", time: "10:00", color: "bg-blue-200" },
    { id: 2, title: "Doctor Appointment", date: "2025-03-20", time: "14:30", color: "bg-green-200" },
    { id: 3, title: "Project Deadline", date: "2025-03-25", time: "16:00", color: "bg-pink-200" }
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", color: "bg-blue-200" });
  const [showForm, setShowForm] = useState(false);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      setEvents([...events, { id: events.length + 1, ...newEvent }]);
      setNewEvent({ title: "", date: "", time: "", color: "bg-blue-200" });
      setShowForm(false);
    }
  };

  // Generate calendar grid
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Format date for event lookup
  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Generate weeks for the calendar
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="p-2 border border-gray-100 text-gray-300"></td>);
    }
    
    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(day);
      const dayEvents = events.filter(event => event.date === date);
      const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
      
      days.push(
        <td key={day} className={`p-2 border border-gray-100 align-top h-24 md:h-32 relative ${
          isToday ? 'bg-blue-50' : ''
        }`}>
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center text-gray-700">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="overflow-y-auto max-h-20">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`${event.color} p-1 mb-1 rounded text-xs overflow-hidden`}
                title={`${event.title} - ${event.time}`}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-gray-600">{event.time}</div>
              </div>
            ))}
          </div>
        </td>
      );
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weeks = [];
  let week = [];
  
  // Arrange days into weeks
  for (let i = 0; i < calendarDays.length; i++) {
    week.push(calendarDays[i]);
    
    if ((i + 1) % 7 === 0 || i === calendarDays.length - 1) {
      // Fill in remaining cells of the last week
      if (i === calendarDays.length - 1 && week.length < 7) {
        const remainingCells = 7 - week.length;
        for (let j = 0; j < remainingCells; j++) {
          week.push(<td key={`empty-end-${j}`} className="p-2 border border-gray-100 text-gray-300"></td>);
        }
      }
      
      weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
      week = [];
    }
  }

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white/95 backdrop-blur-sm overflow-y-auto">
      <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">
          Schedules
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors flex items-center gap-2"
        >
          <Icon path="M12 6v6m0 0v6m0-6h6m-6 0H6" className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {showForm && (
        <EventForm 
          newEvent={newEvent} 
          setNewEvent={setNewEvent} 
          handleAddEvent={handleAddEvent}
          closeForm={() => setShowForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm md:shadow-lg border border-gray-200 mb-4">
        <CalendarHeader 
          currentDate={currentDate}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />
        
        <div className="p-2 sm:p-4 overflow-x-auto">
          <div className="min-w-[768px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <th key={day} className="border border-gray-100 p-2 text-sm font-semibold text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Upcoming Events</h3>
        <div className="space-y-2">
          {events
            .filter(event => new Date(`${event.date}T${event.time}`) >= new Date())
            .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
            .slice(0, 3)
            .map(event => (
              <div 
                key={event.id} 
                className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
              >
                <div className={`w-4 h-4 rounded-full ${event.color.replace('bg-', 'bg-')} mr-3`}></div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
});

// Main Component
const AdminSchedules = () => {
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
          menuItems={MENU_ITEMS}
          title="ADMIN"
        />
        
        <DashboardContent />
      </div>
    </div>
  );
};

export default AdminSchedules;