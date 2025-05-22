import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CampusDirectorSidebar } from "../../components/CampusDirectorSidebar";

const CampusDirectorMaintenanceRequestForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const DIRECTOR_ID = 10;

  const [currentUser, setCurrentUser] = useState({
    id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix: "",
    role: "",
  });
  const [requestDetails, setRequestDetails] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  const [date_received, setDateReceived] = useState("");
  const [time_received, setTimeReceived] = useState("");
  const [priority_number, setPriorityNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [approvedByName, setApprovedByName] = useState("");
  const [approvedById, setApprovedById] = useState("");
  const [directorInput, setDirectorInput] = useState("");
  const [approvedBy1, setApprovedBy1] = useState(null);
  const [userNames, setUserNames] = useState({});

  const [offices, setOffices] = useState([]);
  const [positions, setPositions] = useState([]);
  const [personnelName, setPersonnelName] = useState("");
  const [verifiedByName, setVerifiedByName] = useState("");
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const fetchCurrentUser = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/idfullname`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch current user");

      setCurrentUser({
        id: data.user_id || "",
        last_name: data.last_name || "",
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        suffix: data.suffix || "",
        role: data.role_id || "",
      });
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const getCurrentUserDisplayName = () => {
    if (!currentUser.last_name && !currentUser.first_name) return "Unknown User";
    let name = `${currentUser.last_name}, ${currentUser.first_name}`;
    if (currentUser.middle_name) name += ` ${currentUser.middle_name.charAt(0)}.`;
    if (currentUser.suffix) name += ` ${currentUser.suffix}`;
    return name.trim();
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!authToken) {
      navigate("/loginpage");
    } else {
      setToken(authToken);
      fetchCurrentUser(authToken);
    }
  }, [navigate]);

  const fetchUserInfo = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/idfullname`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user details");

      return {
        id: data.user_id || null,
        full_name: data.full_name || "Unknown User",
      };
    } catch (err) {
      console.error("Error fetching user details:", err);
      return { id: null, full_name: "Unknown User" };
    }
  };

  const fetchUserInfoById = async (userId, authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/fullname`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user details");
      return data.full_name || "Unknown User";
    } catch (err) {
      console.error("Error fetching user details:", err);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) {
        setError("Invalid request ID");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/directorpov/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch request details");

        const responseData = data.data || data;
        setRequestDetails(responseData);

        setDateReceived((prev) => prev || responseData.date_received || new Date().toISOString().split("T")[0]);
        setTimeReceived((prev) => prev || responseData.time_received || new Date().toTimeString().slice(0, 5));
        setPriorityNumber(responseData.priority_number || "");
        setRemarks(responseData.remarks || "");
        setApprovedBy1(responseData.approved_by_1 || null);

        const userInfo = await fetchUserInfo(token);
        setApprovedByName(userInfo.full_name);
        setApprovedById(userInfo.id);
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchRequestDetails();
  }, [id, token, API_BASE_URL]);

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!token || !requestDetails) return;

      const fieldsToFetch = ["verified_by", "approved_by_1"];
      const namesMap = {};

      await Promise.all(
        fieldsToFetch.map(async (field) => {
          const userId = requestDetails[field];
          if (userId) {
            const name = await fetchUserInfoById(userId, token);
            namesMap[field] = name;
          }
        })
      );

      setUserNames(namesMap);
    };

    fetchUserNames();
  }, [token, requestDetails]);

  useEffect(() => {
    if (!token) return;
    const fetchReferenceData = async () => {
      try {
        const officesRes = await fetch(`${API_BASE_URL}/offices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const officesData = await officesRes.json();
        setOffices(Array.isArray(officesData.data) ? officesData.data : officesData);

        const positionsRes = await fetch(`${API_BASE_URL}/positions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const positionsData = await positionsRes.json();
        setPositions(Array.isArray(positionsData.data) ? positionsData.data : positionsData);

        const maintenanceTypesRes = await fetch(`${API_BASE_URL}/maintenance-types`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const maintenanceTypesData = await maintenanceTypesRes.json();
        setMaintenanceTypes(Array.isArray(maintenanceTypesData.data) ? maintenanceTypesData.data : maintenanceTypesData);

        const statusesRes = await fetch(`${API_BASE_URL}/statuses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statusesData = await statusesRes.json();
        setStatuses(Array.isArray(statusesData.data) ? statusesData.data : statusesData);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchReferenceData();
  }, [token, API_BASE_URL]);

  useEffect(() => {
    if (!token || !requestDetails) return;
    const fetchName = async (userId) => {
      if (!userId) return "N/A";
      try {
        const res = await fetch(`${API_BASE_URL}/users/${userId}/fullname`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.last_name || data.first_name) {
          let name = `${data.last_name || ""}, ${data.first_name || ""}`;
          if (data.middle_name) name += ` ${data.middle_name.charAt(0)}.`;
          if (data.suffix) name += ` ${data.suffix}`;
          return name.trim();
        }
        if (data.full_name) return data.full_name;
        return "N/A";
      } catch {
        return "N/A";
      }
    };
    // Requesting personnel
    fetchName(requestDetails.requesting_personnel).then(setPersonnelName);
    // Verified by
    fetchName(requestDetails.verified_by).then(setVerifiedByName);
  }, [requestDetails, token, API_BASE_URL]);

  const getOfficeName = () => {
    if (!requestDetails.requesting_office) return "N/A";
    const office = offices.find((o) => o.id === requestDetails.requesting_office);
    return office ? office.name : `Office ID: ${requestDetails.requesting_office}`;
  };
  const getPositionName = () => {
    if (!requestDetails.position_id) return "N/A";
    const position = positions.find((p) => p.id === requestDetails.position_id);
    return position ? position.name : `Position ID: ${requestDetails.position_id}`;
  };

  const getMaintenanceTypeName = () => {
    if (!requestDetails.maintenance_type_id || maintenanceTypes.length === 0) return "N/A";
    const type = maintenanceTypes.find(
      (t) => String(t.id) === String(requestDetails.maintenance_type_id)
    );
    return type ? type.type_name : `Type ID: ${requestDetails.maintenance_type_id}`;
  };

  const getStatusName = () => {
    if (!requestDetails.status_id || statuses.length === 0) return "N/A";
    const status = statuses.find(
      (s) => String(s.id) === String(requestDetails.status_id)
    );
    return status ? status.name : `Status ID: ${requestDetails.status_id}`;
  };

  const formatTimeTo24Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes}:00`;
  };

  const handleDecision = async (e, action) => {
    e.preventDefault();

    if (action === "deny" && !remarks.trim()) {
      setError("Remarks are required to deny the request.");
      return;
    }

    if (!approvedBy1) {
      setError("You cannot approve this request until Head 1 has approved it.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const formattedTime = formatTimeTo24Hour(time_received);

      const endpoint =
        action === "deny"
          ? `${API_BASE_URL}/maintenance-requests/${id}/disapprove`
          : `${API_BASE_URL}/maintenance-requests/${id}/approve-director`;

      const payload = {
        id,
        date_received,
        time_received: formattedTime,
        priority_number,
        remarks,
        approved_by: approvedById,
        ...(action === "deny" && { status: "denied" }),
      };

      if (approvedById === DIRECTOR_ID && approvedBy1) {
        payload.verified_by_director = approvedById;
      }

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

      navigate("/campusdirectorrequests");
    } catch (err) {
      setError(err.message || "An error occurred during request submission");
    } finally {
      setIsLoading(false);
    }
  };

  const isDirectorVerified = Boolean(requestDetails.verified_by_director);
  const alreadyApproved = approvedById === DIRECTOR_ID && isDirectorVerified;

  const buttonText = alreadyApproved
    ? "Already Approved"
    : "Approve";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-black text-white p-4 flex justify-between items-center relative">
        <span className="text-xl md:text-2xl font-extrabold tracking-tight">
          ManageIT
        </span>
        <div className="hidden md:block text-right text-white text-sm">
          <div className="font-semibold capitalize">
            <div className="hidden md:block text-xl font-bold">Campus Director</div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 md:p-8 lg:p-10 shadow-lg rounded-lg w-full max-w-md md:max-w-xl lg:max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-gray-800">
              User Request Slip (Campus Director Approval) 
            </h2>      

            {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <div className="space-y-4 md:space-y-6">
              {isLoading ? (
                <p className="text-center text-gray-500">Loading request details...</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Request Date:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={
                          requestDetails.date_requested
                            ? new Date(requestDetails.date_requested).toLocaleDateString()
                            : "N/A"
                        }
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
                        value={personnelName || (requestDetails.requesting_personnel ? `User ID: ${requestDetails.requesting_personnel}` : "N/A")}
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
                        value={getPositionName()}
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
                        value={getOfficeName()}
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
                        value={getMaintenanceTypeName()}
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
                        value={getStatusName()}
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
                        value={requestDetails.contact_number || "N/A"}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Verified By:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={verifiedByName || "N/A"}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Date Received:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={requestDetails.date_received || "N/A"}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Time Received:
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        value={requestDetails.time_received || "N/A"}
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
                      value={requestDetails.details || "N/A"}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Remarks:
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                      rows="2"
                      value={requestDetails.remarks || "N/A"}
                      disabled
                    />
                  </div>               
                </>               
              )}
            </div>
            

            {!isLoading && (
              <form className="space-y-4 md:space-y-6 mt-6" onSubmit={(e) => handleDecision(e, "approve")}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Approved by:
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                    value={getCurrentUserDisplayName()}
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full text-white py-2 rounded-lg ${
                    alreadyApproved || !approvedBy1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={alreadyApproved || !approvedBy1}
                >
                  {buttonText}
                </button>

                <button
                  type="button"
                  className="w-full bg-red-500 text-white py-2 rounded-lg mt-2"
                  onClick={(e) => handleDecision(e, "deny")}
                >
                  Deny
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampusDirectorMaintenanceRequestForm;