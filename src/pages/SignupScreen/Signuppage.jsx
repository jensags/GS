import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Form input states
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    position: "",
    office: "",
    contact_number: "",
    password: "",
    password_confirmation: "",
    role_id: "",
  });

  // Other states
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { label: "Select Role", value: "", disabled: true },
    { label: "Admin", value: 1 },
    { label: "Head", value: 2 },
    { label: "Staff", value: 3 },
    { label: "Requester", value: 4 },
  ];

  const offices = [
    { label: "Select Office", value: "", disabled: true },
    { label: "College of Engineering", value: "College of Engineering" },
    { label: "College of Business Administration", value: "College of Business Administration" },
    { label: "College of Nursing", value: "College of Nursing" },
    { label: "College of Arts and Sciences", value: "College of Arts and Sciences" },
    { label: "College of Maritime Education", value: "College of Maritime Education" },
    { label: "College of Computer Studies", value: "College of Computer Studies" },
    { label: "College of Criminal Justice Education", value: "College of Criminal Justice Education" },
    { label: "College of Teacher Education", value: "College of Teacher Education" },
    { label: "General Service Office", value: "General Service Office" },
  ];

  const positions = [
    { label: "Select Position", value: "", disabled: true },
    { label: "Faculty", value: "Faculty" },
    { label: "Staff", value: "Staff" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isNumeric = (val) => /^[0-9]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const {
      full_name,
      username,
      email,
      position,
      office,
      contact_number,
      password,
      password_confirmation,
      role_id,
    } = form;

    // Simple form validation
    if (Object.values(form).some((field) => !field)) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!isNumeric(contact_number)) {
      setError("Contact number should only contain digits.");
      return;
    }

    if (password !== password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
        mode: "cors",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      setSuccessMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/loginpage"), 2000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <h1 className="text-center text-2xl font-bold text-gray-700 mb-10">
        JOSE RIZAL MEMORIAL STATE UNIVERSITY
        <br />
        GENERAL SERVICE OFFICE MANAGEMENT SYSTEM
      </h1>

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-center text-xl font-bold text-gray-800 mb-6">SIGNUP ACCOUNT</h2>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "full_name", placeholder: "Full Name" },
            { name: "username", placeholder: "Username" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "contact_number", placeholder: "Contact Number" },
          ].map(({ name, placeholder, type = "text" }) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              type={type}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none text-sm"
            />
          ))}

          {/* Dropdowns */}
          {[{ name: "office", options: offices }, { name: "position", options: positions }, { name: "role_id", options: roles }].map(
            ({ name, options }) => (
              <select
                key={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg outline-none text-sm bg-white"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )
          )}

          {/* Password */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 outline-none text-sm"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="pr-3 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-200 rounded-lg outline-none text-sm"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-sm transition-colors duration-300 disabled:bg-green-300"
          >
            {isLoading ? "Processing..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
 