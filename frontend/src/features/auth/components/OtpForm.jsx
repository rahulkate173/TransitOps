import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import AlertBox from "./AlertBox";

const OtpForm = ({ email }) => {
    const { verify, loading, error, successMessage, clearError } = useAuth();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (val, idx) => {
        clearError();
        if (!/^\d*$/.test(val)) return;
        const next = [...otp];
        next[idx] = val.slice(-1);
        setOtp(next);
        if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputsRef.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verify({ email, otp: otp.join("") });
    };

    return (
        <>
            <h1 className="auth-form-title">Verify your email</h1>
            <p className="auth-form-subtitle">
                Enter the 6-digit OTP sent to <strong style={{ color: "#B8860B" }}>{email}</strong>
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <AlertBox type="error" message={error} />
                <AlertBox type="success" message={successMessage} />

                <div className="auth-otp-group" onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            className="auth-otp-box"
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                        />
                    ))}
                </div>

                <button
                    id="otp-submit"
                    className="auth-btn"
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                >
                    {loading ? <span className="auth-spinner" /> : "Verify OTP"}
                </button>
            </form>
        </>
    );
};

export default OtpForm;
