import React, { useState } from "react";
import { supabase } from "./supabaseClient";

const PhoneLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    const formattedPhone = `+${phone.replace(/\D/g, "")}`;
    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
      setError("Invalid phone number format.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error("Error sending OTP:", error);
        setError(error.message);
      } else {
        console.log("OTP sent:", data);
        setError("OTP sent sucessfully");
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    const formattedPhone = `+${phone.replace(/\D/g, "")}`;
    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
      setError("Invalid phone number format.");
      return;
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) {
        console.error("Error verifying OTP:", error);
        setError(error.message);
      } else {
        console.log("User logged in:", data);
        setError("logged sucessfully");
        // Handle successful login (e.g., store session/token)
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "28rem",
        margin: "40px auto",
        padding: "1.5rem",
        backgroundColor: "#ffff",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {otpSent ? (
        <div className="input-container">
          <input
            className="input-field"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="btn-primary" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>
      ) : (
        <div className="input-container">
          <input
            className="input-field"
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>
      )}
      {error && (
        <p className="error-text">
          {error}
        </p>
      )}
    </div>
  );
  
};

export default PhoneLogin;
