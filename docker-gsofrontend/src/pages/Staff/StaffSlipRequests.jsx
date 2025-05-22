import { useState, useReducer, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Icon from "../../components/Icon";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// sidebar reducer
const sidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };
    case "TOGGLE_MOBILE_MENU":
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case "CLOSE_MOBILE_MENU":
      return { ...state, isMobileMenuOpen: false };
    default:
      return state;
  }
};

const MENU_ITEMS = [
  { text: "Dashboard", to: "/staffdashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { text: "Notifications", to: "/adminnotifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { text: "Schedules", to: "/adminschedules", icon: "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M16 2v4 M3 10h18 M8 2v4 M17 14h-6 M13 18H7 M7 14h.01 M17 18h.01" },
  { text: "User Requests", to: "/userrequests", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"},
  { text: "Requests", to: "/StaffSlipRequests", icon: "M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 1 1 1-1z M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M12 11h4 M12 16h4 M8 11h.01 M8 16h.01"},
  { text: "Reports", to: "/report", icon: "M13 17V9 M18 17V5 M3 3v16a2 2 0 0 0 2 2h16 M8 17v-3"},
  { text: "Settings", to: "/settings", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
  { text: "Logout", to: "/loginpage", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }
];

const RequestsTable = ({ onRowClick, requests, showActions }) => (
  <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white/95 backdrop-blur-sm overflow-y-auto">
    <div className="bg-white rounded-lg shadow-sm md:shadow-lg border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="p-3 text-left font-semibold">Date Requested</th>
            <th className="p-3 text-left font-semibold">Personnel Name</th>
            <th className="p-3 text-left font-semibold">Position</th>
            <th className="p-3 text-left font-semibold">Office</th>
            <th className="p-3 text-left font-semibold">Maintenance Type</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Contact Number</th>
            {showActions && <th className="p-3 text-left font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr
                key={`${request.requester_id}-${request.date_requested}-${request.details}`}
                className="hover:bg-gray-50 even:bg-gray-50 border-b border-gray-400"
              >
                <td className="p-3">{new Date(request.date_requested).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{request.personnel_fullname || "Unknown Personnel"}</td>
                <td className="p-3">{request.position_name || "Unknown Position"}</td>
                <td className="p-3">{request.office_name || "Unknown Office"}</td>
                <td className="p-3">{request.maintenance_type_name || "Unknown Type"}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    request.status_name === "Pending" || request.status_id === 1
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status_name === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {request.status_name}
                  </span>
                </td>
                <td className="p-3">{request.contact_number}</td>
                {showActions && (
                  <td className="p-3">
                    <button
                      onClick={() => onRowClick(request.id, request.status_name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      Review
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showActions ? 8 : 7} className="p-3 text-center">
                No maintenance requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </main>
);

const StaffSlipRequests = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(sidebarReducer, {
    isSidebarCollapsed: true,
    isMobileMenuOpen: false,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [statuses, setStatuses] = useState([]);
  const [offices, setOffices] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [positions, setPositions] = useState([]);

  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  // Function to format full name from API response
  const formatFullName = (userData) => {
    if (!userData) return "Unknown User";
    
    const { first_name = "", middle_name = "", last_name = "", suffix = "" } = userData;
    
    // Format the name: Last Name, First Name Middle Initial. Suffix
    let formattedName = `${last_name || ""}, ${first_name || ""}`;
    
    // Add middle initial if available
    if (middle_name) {
      formattedName += ` ${middle_name.charAt(0)}.`;
    }
    
    // Add suffix if available
    if (suffix) {
      formattedName += ` ${suffix}`;
    }
    
    return formattedName.trim() || "Unknown User";
  };

  // Function to fetch user fullname by ID
  const fetchUserFullname = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/fullname`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch user data: ${res.status}`);
      }
      
      const userData = await res.json();
      
      // Check if we received the expected format
      if (userData.message === "User retrieved successfully.") {
        return formatFullName(userData);
      } else if (userData.data) {
        // Fallback for different format
        return formatFullName(userData.data);
      } else {
        // Generic fallback
        return `User ${userId}`;
      }
    } catch (err) {
      console.error(`Error fetching fullname for user ${userId}:`, err);
      return `User ${userId}`;
    }
  };

  // Fetch reference data (statuses, offices, maintenance types, positions) from /common-datas
  useEffect(() => {
    const fetchReferenceData = async () => {
      if (!token) return;

      try {
        // Fetch all reference data in one request
        const res = await fetch(`${API_BASE_URL}/common-datas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setStatuses(Array.isArray(data.statuses) ? data.statuses : []);
        setOffices(Array.isArray(data.offices) ? data.offices : []);
        setPositions(Array.isArray(data.positions) ? data.positions : []);
        // maintenanceTypes still fetched from its own endpoint unless included in /common-datas
        // If maintenanceTypes is also in /common-datas, add:
        // setMaintenanceTypes(Array.isArray(data.maintenance_types) ? data.maintenance_types : []);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };

    fetchReferenceData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/loginpage");
      return;
    }

    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Use the new API endpoint
        const res = await fetch(`${API_BASE_URL}/maintenance-requests/list-with-details`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);

        // Enhance requests if needed (here, the API already provides names)
        const enhancedRequests = list.map((request) => ({
          ...request,
          date_requested: request.date_requested,
          personnel_fullname: request.requesting_personnel,
          position_name: request.position,
          office_name: request.requesting_office,
          maintenance_type_name: request.maintenance_type,
          status_name: request.status,
          contact_number: request.contact_number,
          verified_by: request.verified_by,
        }));

        setRequests(enhancedRequests);
      } catch (err) {
        console.error(err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, navigate]);

  const handleRowClick = useCallback(
    (id, status) => {
      // Consider both status name and status ID
      const isPending = status === "Pending" || status === 1;
      if (isPending) {
        navigate(`/staffmaintenancerequestform/${id}`);
      } else {
        navigate(`/staffviewmaintenancerequestform/${id}`);
      }
    },
    [navigate]
  );

  const filtered = requests.filter((r) => {
    // Only show requests where verified_by is null
    if (r.verified_by !== null && r.verified_by !== undefined) return false;

    // Check if selected tab is "Pending" and status is either ID 1 or name "Pending" (case insensitive)
    if (selectedTab === "Pending") {
      return r.status_id === 1 || r.status_name?.toLowerCase() === "pending";
    }
    // For other tabs, match by status name
    return r.status_name === selectedTab;
  });
  const showActions = true;

  if (loading) return <div className="p-4">Loading requests...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-black text-white p-4 flex justify-between items-center relative">
        <span className="text-xl md:text-2xl font-extrabold">ManageIT</span>
        <div className="hidden md:block text-xl font-bold">Staff</div>
        <button
          onClick={() => dispatch({ type: "TOGGLE_MOBILE_MENU" })}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg border-2 border-white"
        >
          <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" />
        </button>
        <div
          className={`absolute md:hidden top-full right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-30 transition-all duration-300 ease-out overflow-hidden ${
            state.isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-2">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.text}
                to={item.to}
                className="flex items-center px-4 py-3 text-sm hover:bg-gray-700"
                onClick={() => dispatch({ type: "CLOSE_MOBILE_MENU" })}
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

      <div className="flex flex-1 overflow-auto">
        <Sidebar
          isSidebarCollapsed={state.isSidebarCollapsed}
          onToggleSidebar={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          menuItems={MENU_ITEMS}
          title="STAFF"
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white/95 backdrop-blur-sm overflow-y-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 border-b mb-4 pb-3">
            Maintenance Requests
          </h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedTab(status.name)}
                className={`px-4 py-2 font-semibold rounded-md ${
                  (selectedTab === status.name) || 
                  (selectedTab === "Pending" && (status.id === 1 || status.name?.toLowerCase() === "pending"))
                    ? status.name === "Pending" || status.id === 1
                      ? "bg-yellow-500 text-white"
                      : status.name === "Approved"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-transparent text-gray-700"
                }`}
              >
                {status.name}
              </button>
            ))}
          </div>

          <RequestsTable
            onRowClick={handleRowClick}
            requests={filtered}
            showActions={showActions}
          />
        </main>
      </div>
    </div>
  );
};

export default StaffSlipRequests;