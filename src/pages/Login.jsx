import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import { loginAdmin } from "../firebase/auth";
import "./../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [captchaToken, setCaptchaToken] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setError("");
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!captchaToken) {
      setError("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(email, password);

      navigate("/admin");
    } catch (error) {
      console.error(error);

      setError("Invalid email or password.");

      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form onSubmit={handleSubmit} className="login-card glass">
        <div className="login-label">
          PORTFOLIO CMS
        </div>

        <h1 className="login-title">
          Admin Login
        </h1>

        <p className="login-description">
          Manage your portfolio content.
        </p>

        <div className="login-fields">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Admin email"
            required
            autoComplete="email"
            className="login-input"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            className="login-input"
          />
        </div>

        {/* Google reCAPTCHA */}
        <div className="recaptcha-wrapper">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
            onErrored={handleCaptchaExpired}
            theme="dark"
          />
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !captchaToken}
          className="login-button"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </main>
  );
}