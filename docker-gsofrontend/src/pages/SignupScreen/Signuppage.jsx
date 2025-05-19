import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State for form inputs
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [positionId, setPositionId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  // State for API data
  const [roles, setRoles] = useState([]);
  const [offices, setOffices] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch dropdown data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        
        // Fetch roles
        const rolesResponse = await fetch(`${API_BASE_URL}/roles`);
        const rolesData = await rolesResponse.json();
        
        // Fetch positions
        const positionsResponse = await fetch(`${API_BASE_URL}/positions`);
        const positionsData = await positionsResponse.json();
        
        // Fetch offices
        const officesResponse = await fetch(`${API_BASE_URL}/offices`);
        const officesData = await officesResponse.json();

        console.log("Roles data:", rolesData);
console.log("Positions data:", positionsData);
console.log("Offices data:", officesData);
        
        // Format the data for select dropdowns
        setRoles([
          { label: "Select Role", value: "", disabled: true },
          ...rolesData.map(role => ({ label: role.role_name, value: role.id }))
        ]);
        setPositions([
          { label: "Select Position", value: "", disabled: true },
          ...positionsData.map(position => ({ label: position.name, value: position.id }))
        ]);
        
        setOffices([
          { label: "Select Office", value: "", disabled: true },
          ...officesData.map(office => ({ label: office.name, value: office.id }))
        ]);
        
      } catch (err) {
        setError("Failed to load form data. Please refresh the page.");
        console.error("Error fetching data:", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const suffixOptions = [
    { label: "Suffix (Optional)", value: "", disabled: true },
    { label: "Jr.", value: "Jr." },
    { label: "Sr.", value: "Sr." },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
    { label: "V", value: "V" },
  ];


  // State for handling errors and loading
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!lastName || !firstName || !username || !positionId || !officeId || !contactNumber || !password || !passwordConfirmation || !roleId) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // API request
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          last_name: lastName,
          first_name: firstName,
          middle_name: middleName,
          suffix,
          username,
          email,
          position_id: positionId,
          office_id: officeId,
          contact_number: contactNumber,
          password,
          password_confirmation: passwordConfirmation,
          role_id: roleId
        }),
        mode: 'cors'
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from the backend
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join('\n'));
        }
        throw new Error(data.message || "Signup failed");
      }

      navigate('/loginpage');

    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mb-20">
        JOSE RIZAL MEMORIAL STATE UNIVERSITY
        <br />
        GENERAL SERVICE OFFICE MANAGEMENT SYSTEM
      </h1>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10 
                    border border-gray-200 transition-all duration-300">
        
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-6">
          SIGNUP ACCOUNT
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 sm:space-y-6">
            {/* Last Name */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 transition-colors duration-200">
              <input
                type="text"
                placeholder="Last Name*"
                className="w-full outline-none text-sm sm:text-base"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* First Name */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 transition-colors duration-200">
              <input
                type="text"
                placeholder="First Name*"
                className="w-full outline-none text-sm sm:text-base"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Middle Name */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 transition-colors duration-200">
              <input
                type="text"
                placeholder="Middle Name (Optional)"
                className="w-full outline-none text-sm sm:text-base"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                maxLength="1"
              />
            </div>

            {/* Suffix Dropdown */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 transition-colors duration-200 relative group">
              <select
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className="w-full outline-none text-sm sm:text-base bg-transparent appearance-none pr-8"
              >
                {suffixOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400" : ""}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg 
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200">
              <input
                type="text"
                placeholder="Username*"
                className="w-full outline-none text-sm sm:text-base"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200">
              <input
                type="email"
                placeholder="Email (Optional)"
                className="w-full outline-none text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Office */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200 relative group">
              <select
                value={officeId}
                onChange={(e) => setOfficeId(e.target.value)}
                className="w-full outline-none text-sm sm:text-base bg-transparent appearance-none pr-8"
              >
                {offices.map((office) => (
                  <option 
                    key={office.value} 
                    value={office.value}
                    disabled={office.disabled}
                    className={office.disabled ? "text-gray-400" : ""}
                  >
                    {office.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg 
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            </div>

            {/* Position */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200 relative group">
              <select
                value={positionId}
                onChange={(e) => setPositionId(e.target.value)}
                className="w-full outline-none text-sm sm:text-base bg-transparent appearance-none pr-8"
              >
                {positions.map((pos) => (
                  <option 
                    key={pos.value} 
                    value={pos.value}
                    disabled={pos.disabled}
                    className={pos.disabled ? "text-gray-400" : ""}
                  >
                    {pos.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg 
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200">
              <input
                type="text"
                placeholder="Contact Number*"
                className="w-full outline-none text-sm sm:text-base"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password* (min. 6 characters)"
                className="w-full outline-none text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="focus:outline-none text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password*"
                className="w-full outline-none text-sm sm:text-base"
                value={passwordConfirmation}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Role ID */}
             <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 sm:p-3.5 hover:border-blue-300 
                          transition-colors duration-200 relative group">
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full outline-none text-sm sm:text-base bg-transparent appearance-none pr-8"
              >
                {roles.map((role) => (
                  <option 
                    key={role.value} 
                    value={role.value}
                    disabled={role.disabled}
                    className={role.disabled ? "text-gray-400" : ""}
                  >
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg 
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 sm:mt-7 bg-green-500 hover:bg-green-600 text-white 
                    py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors duration-300
                    disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "LOADING..." : "SIGNUP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;