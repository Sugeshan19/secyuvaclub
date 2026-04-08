import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Verification failed");
        return;
      }

      alert("Email verified successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h3>Verify Email</h3>

        <form onSubmit={handleVerify}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <br></br>

          <label>OTP</label>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
