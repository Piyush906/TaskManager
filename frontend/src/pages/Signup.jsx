import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { Fingerprint, AtSign, KeyRound, ArrowRight } from "lucide-react";

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", formData);
      const loginRes = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      setUser(loginRes.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-cyber-grid items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900 neon-border rounded-xl p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 neon-border">
            <Fingerprint className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2 tracking-tight">System Access</h2>
          <p className="text-gray-400 text-sm">Initialize your new credentials</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-950/50 p-3 text-sm text-red-400 border border-red-900/50 text-center">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
              <input
                type="text"
                required
                className="neon-input block w-full rounded-lg py-2.5 pl-10 pr-4 text-gray-100 placeholder-gray-600 text-sm"
                placeholder="John Doe"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
              <input
                type="email"
                required
                className="neon-input block w-full rounded-lg py-2.5 pl-10 pr-4 text-gray-100 placeholder-gray-600 text-sm"
                placeholder="user@system.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />
              <input
                type="password"
                required
                className="neon-input block w-full rounded-lg py-2.5 pl-10 pr-4 text-gray-100 placeholder-gray-600 text-sm"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Role</label>
            <select
              className="neon-input block w-full rounded-lg py-2.5 px-4 text-gray-100 appearance-none text-sm"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg neon-button px-4 py-3 font-semibold text-sm tracking-wide"
          >
            <span>INITIALIZE</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Authenticate
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
