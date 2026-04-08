import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // reuse login styles

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("OTP sent to your email. Please verify.");
      navigate("/verify-email", { state: { email: formData.email } });
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <img src="/images/logo.png" alt="YUVA" />
          <h2>Create your account</h2>
          <p>Join the YUVA community</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            onChange={handleChange}
          />

          <button type="submit">
            Create Account
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in</span>
        </p>

      </div>
    </div>
  );
};

export default Signup;
