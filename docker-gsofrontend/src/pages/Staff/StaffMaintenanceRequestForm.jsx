import { useState, useEffect, useReducer, useRef } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import Icon from "../../components/Icon";

// Reducer for sidebar and mobile menu state
const sidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_MOBILE_MENU":
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case "CLOSE_MOBILE_MENU":
      return { ...state, isMobileMenuOpen: false };
    default:
      return state;
  }
};

// Constants for menu items
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

const StaffMaintenanceRequestForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(sidebarReducer, {
    isMobileMenuOpen: false,
  });
  const mobileMenuRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State for reference data
  const [offices, setOffices] = useState([]);
  const [positions, setPositions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);

  // State for request details
  const [requestDetails, setRequestDetails] = useState({});
  const [enhancedRequestDetails, setEnhancedRequestDetails] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");

  // State for PUT method inputs
  const [date_received, setDateReceived] = useState("");
  const [time_received, setTimeReceived] = useState("");
  const [priority_number, setPriorityNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [verifiedByName, setVerifiedByName] = useState("");
  const [verifiedById, setVerifiedById] = useState("");

  const [currentUser, setCurrentUser] = useState({ id: "", full_name: "" });

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        dispatch({ type: "CLOSE_MOBILE_MENU" });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Retrieve token from storage
  useEffect(() => {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!authToken) {
      navigate("/loginpage");
    } else {
      setToken(authToken);
    }
  }, [navigate]);

  // Function to fetch user name parts by ID
  const fetchUserNameParts = async (userId) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/fullname`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user data: ${res.status}`);
    }

    const userData = await res.json();

    // Expecting userData to have last_name, first_name, middle_name, suffix
    if (
      userData &&
      (userData.last_name || userData.first_name)
    ) {
      return {
        last_name: userData.last_name || "",
        first_name: userData.first_name || "",
        middle_name: userData.middle_name || "",
        suffix: userData.suffix || "",
      };
    } else if (userData.data) {
      // Fallback for different format
      const d = userData.data;
      return {
        last_name: d.last_name || "",
        first_name: d.first_name || "",
        middle_name: d.middle_name || "",
        suffix: d.suffix || "",
      };
    } else {
      // Generic fallback
      return {
        last_name: "",
        first_name: `User ${userId}`,
        middle_name: "",
        suffix: "",
      };
    }
  };

  // Fetch reference data
  useEffect(() => {
    const fetchReferenceData = async () => {
      if (!token) return;

      try {
        // Fetch statuses
        const statusesRes = await fetch(`${API_BASE_URL}/statuses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statusesData = await statusesRes.json();
        console.log("Statuses API Response:", statusesData);
        setStatuses(Array.isArray(statusesData.data) ? statusesData.data : 
                   Array.isArray(statusesData) ? statusesData : []);

        // Fetch offices
        const officesRes = await fetch(`${API_BASE_URL}/offices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const officesData = await officesRes.json();
        console.log("Offices API Response:", officesData);
        setOffices(Array.isArray(officesData.data) ? officesData.data : 
                  Array.isArray(officesData) ? officesData : []);

        // Fetch maintenance types
        const maintenanceTypesRes = await fetch(`${API_BASE_URL}/maintenance-types`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const maintenanceTypesData = await maintenanceTypesRes.json();
        console.log("Maintenance Types API Response:", maintenanceTypesData);
        setMaintenanceTypes(Array.isArray(maintenanceTypesData.data) ? maintenanceTypesData.data : 
                           Array.isArray(maintenanceTypesData) ? maintenanceTypesData : []);

        // Fetch positions
        const positionsRes = await fetch(`${API_BASE_URL}/positions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const positionsData = await positionsRes.json();
        console.log("Positions API Response:", positionsData);
        setPositions(Array.isArray(positionsData.data) ? positionsData.data : 
                    Array.isArray(positionsData) ? positionsData : []);
      } catch (err) {
        console.error("Error fetching reference data:", err);
        setError("Failed to load reference data. Please refresh the page.");
      }
    };

    fetchReferenceData();
  }, [token, API_BASE_URL]);

  // Fetch the user's full name and ID
  const fetchUserInfo = async (authToken) => {
    try {
      console.log("Fetching current user info from:", `${API_BASE_URL}/users/idfullname`);
      const response = await fetch(`${API_BASE_URL}/users/idfullname`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json",
        },
      });
      const data = await response.json();
      console.log("Fetched user info response:", data);
      if (!response.ok) throw new Error(data.message || "Failed to fetch user details");
      // Return all name parts and user_id
      return {
        id: data.user_id || null,
        last_name: data.last_name || "",
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        suffix: data.suffix || "",
      };
    } catch (err) {
      console.error("Error fetching user details:", err);
      return { id: null, last_name: "", first_name: "", middle_name: "", suffix: "" };
    }
  };

  // Enhanced function to find reference data by ID
  const findReferenceData = (dataArray, id, fallbackName = "Unknown") => {
    if (!Array.isArray(dataArray) || !id) return fallbackName;
    
    const item = dataArray.find(item => {
      // Handle different possible ID field names
      return item.id === id || item.status_id === id || item.type_id === id || 
             item.office_id === id || item.position_id === id;
    });
    
    if (!item) return `${fallbackName} (ID: ${id})`;
    
    // Handle different possible name field names
    return item.name || item.type_name || item.status_name || 
           item.office_name || item.position_name || `${fallbackName} (ID: ${id})`;
  };

  // Enhance request details with reference data
  const enhanceRequestDetails = async (request) => {
    try {
      console.log("Request to enhance:", request);
      console.log("Available statuses:", statuses);
      console.log("Available maintenance types:", maintenanceTypes);
      console.log("Available offices:", offices);
      console.log("Available positions:", positions);

      // Find office name
      const office_name = findReferenceData(offices, request.requesting_office, "Unknown Office");
      
      // Find maintenance type name
      const maintenance_type_name = findReferenceData(maintenanceTypes, request.maintenance_type_id, "Unknown Type");
      
      // Find status name
      const status_name = findReferenceData(statuses, request.status_id, "Unknown Status");
      
      // Find position name
      const position_name = findReferenceData(positions, request.position_id, "Unknown Position");
      
      // Fetch personnel name parts
      const personnelNameParts = await fetchUserNameParts(request.requesting_personnel);

      // Create enhanced request object
      const enhanced = {
        ...request,
        office_name,
        maintenance_type_name,
        status_name,
        position_name,
        personnel_last_name: personnelNameParts.last_name,
        personnel_first_name: personnelNameParts.first_name,
        personnel_middle_name: personnelNameParts.middle_name,
        personnel_suffix: personnelNameParts.suffix,
      };
      
      console.log("Enhanced request:", enhanced);
      return enhanced;
    } catch (err) {
      console.error("Error enhancing request details:", err);
      return {
        ...request,
        office_name: "Error loading office",
        maintenance_type_name: "Error loading type",
        status_name: "Error loading status",
        position_name: "Error loading position",
        personnel_fullname: "Error loading personnel"
      };
    }
  };

  // Fetch request details when component mounts
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id || !token) {
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/staffpov/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch request details");
        
        const requestData = data.data || data;
        setRequestDetails(requestData);
        
        // Set form values immediately
        setDateReceived(requestData.date_received || new Date().toISOString().split("T")[0]);
        setTimeReceived(requestData.time_received || new Date().toTimeString().slice(0, 5));
        setPriorityNumber(requestData.priority_number || "");
        setRemarks(requestData.remarks || "");

        // Fetch user info (gets user_id from token)
        const userInfo = await fetchUserInfo(token);
        setVerifiedById(userInfo.id);

        if (userInfo.id) {
          // Format: Last Name, First Name M. Suffix
          let formattedName = `${userInfo.last_name}, ${userInfo.first_name}`;
          if (userInfo.middle_name) {
            formattedName += ` ${userInfo.middle_name.charAt(0)}.`;
          }
          if (userInfo.suffix) {
            formattedName += ` ${userInfo.suffix}`;
          }
          setVerifiedByName(formattedName.trim());
        } else {
          setVerifiedByName("Unknown User");
        }

        setCurrentUser(userInfo);
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequestDetails();
  }, [id, token, API_BASE_URL]);

  // Enhance request details when reference data is loaded
  useEffect(() => {
    const enhanceWhenReady = async () => {
      if (requestDetails && Object.keys(requestDetails).length > 0 && 
          statuses.length > 0 && maintenanceTypes.length > 0 && 
          offices.length > 0 && positions.length > 0) {
        try {
          const enhanced = await enhanceRequestDetails(requestDetails);
          setEnhancedRequestDetails(enhanced);
        } catch (err) {
          console.error("Error enhancing request details:", err);
        }
      }
    };

    enhanceWhenReady();
  }, [requestDetails, statuses, maintenanceTypes, offices, positions, token]);

  const formatTimeTo24Hour = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
  };

  const handleapprove = async (e, action) => {
    e.preventDefault();
    if (action === "deny" && !remarks.trim()) {
      setError("Remarks are required to deny the request.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const formattedTime = formatTimeTo24Hour(time_received);
      const endpoint =
        action === "deny"
          ? `${API_BASE_URL}/maintenance-requests/${id}/deny`
          : `${API_BASE_URL}/maintenance-requests/${id}/verify`;
      const payload = {
        date_received,
        time_received: formattedTime,
        priority_number,
        remarks,
        verified_by: verifiedById,
        ...(action === "deny" && { status: "denied" }),
      };
      // Log what is being sent to the backend
      console.log("Submitting payload to backend:", payload);

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request submission failed");
      navigate("/staffmaintenance");
    } catch (err) {
      setError(err.message || "An error occurred during request submission");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get the details to display
  const getDisplayDetails = () => {
    return Object.keys(enhancedRequestDetails).length > 0 ? enhancedRequestDetails : requestDetails;
  };

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
          ref={mobileMenuRef}
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
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-center mb-4">
                Maintenance Request Slip
              </h2>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Request Details Section */}
              {!isLoading && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Request Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Request Date:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={getDisplayDetails().date_requested ? 
                          new Date(getDisplayDetails().date_requested).toLocaleDateString() : "N/A"}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Personnel Name:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={
                          getDisplayDetails().personnel_last_name
                            ? `${getDisplayDetails().personnel_last_name}, ${getDisplayDetails().personnel_first_name}${getDisplayDetails().personnel_middle_name ? " " + getDisplayDetails().personnel_middle_name.charAt(0) + "." : ""}${getDisplayDetails().personnel_suffix ? " " + getDisplayDetails().personnel_suffix : ""}`
                            : (getDisplayDetails().requesting_personnel ? `User ID: ${getDisplayDetails().requesting_personnel}` : "N/A")
                        }
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Position:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={getDisplayDetails().position_name || 
                               (getDisplayDetails().position_id ? `Position ID: ${getDisplayDetails().position_id}` : "N/A")}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Office:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={getDisplayDetails().office_name || 
                               (getDisplayDetails().requesting_office ? `Office ID: ${getDisplayDetails().requesting_office}` : "N/A")}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Maintenance Type:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={getDisplayDetails().maintenance_type_name || 
                               (getDisplayDetails().maintenance_type_id ? `Type ID: ${getDisplayDetails().maintenance_type_id}` : "N/A")}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Status:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={getDisplayDetails().status_name || 
                               (getDisplayDetails().status_id ? `Status ID: ${getDisplayDetails().status_id}` : "N/A")}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Contact Number:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={getDisplayDetails().contact_number || "N/A"}
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description:
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                      rows="4"
                      value={getDisplayDetails().details || "N/A"}
                      disabled
                    />
                  </div>
                </div>
              )}

              {/* Form Section */}
              {!isLoading && (
                <form className="space-y-4" onSubmit={(e) => handleapprove(e, "approve")}>
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Action Required</h3>
                  
                  <div>
                    <label className="block font-semibold text-gray-700">Date Received:</label>
                    <input
                      type="date"
                      className="w-full border rounded-lg px-4 py-2"
                      value={date_received}
                      onChange={(e) => setDateReceived(e.target.value)}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700">Time Received:</label>
                    <input
                      type="time"
                      className="w-full border rounded-lg px-4 py-2"
                      value={time_received}
                      onChange={(e) => setTimeReceived(e.target.value)}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700">Priority Number:</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-4 py-2"
                      value={priority_number}
                      onChange={(e) => setPriorityNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700">Remarks:</label>
                    <textarea
                      className="w-full border rounded-lg px-4 py-2"
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700">Verified By:</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2"
                      value={verifiedByName}
                      disabled
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    onClick={(e) => handleapprove(e, "deny")}
                  >
                    Deny
                  </button>
                </form>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className="text-center text-gray-500">
                  <p>Loading request details...</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffMaintenanceRequestForm;