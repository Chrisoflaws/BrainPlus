import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("🚀 Attempting Supabase signup (email/password only)...");

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error("❌ Signup error", error);
        setError(error.message);
        return;
      }

      console.log("✅ Signup successful", data);

      // skip Make webhook while local
      console.log("⚠️ Skipping Make.com webhook during local dev");

      if (data?.session?.access_token) {
        navigate("/app/dashboard", { replace: true });
      } else {
        console.warn("⚠️ No session token returned, user may need to verify email");
      }
    } catch (err: any) {
      console.error("💥 Registration process failed:", err);
      setError(err.message || "An error occurred during registration");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Register;
