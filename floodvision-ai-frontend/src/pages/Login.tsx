import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Mail, Lock, ArrowRight, Shield, MapPinned, AlertTriangle, User, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left — Professional Light Brand & Purpose Panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-100/90 border-r border-slate-200 p-12 text-slate-900 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Waves size={24} />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-slate-900 tracking-tight">FloodVision AI</p>
            <p className="text-xs text-slate-500 font-medium">Disaster Response & Decision Support</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-700">
            <Shield size={14} className="text-blue-600" /> National Emergency Management Platform
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900">
            Rapid flood assessment and intelligent
            <span className="text-blue-600"> rescue planning.</span>
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 font-medium">
            Empowering disaster response officers, emergency coordinators, and analysts with
            explainable AI flood extent mapping, building damage evaluation, and prioritized rescue deployment.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-4 font-mono text-xs text-slate-700">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <MapPinned size={16} className="text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800">5 ACTIVE FLOOD CASES · 3 REGIONS MONITORED</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              <span className="font-semibold text-slate-800">KOLAR RIVERBANK SECTOR · PRIORITY SCORE 0.89</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500 font-medium">
          FloodVision AI · Disaster Response Console
        </p>
      </div>

      {/* Right — Real JWT Auth Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 bg-slate-50">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Waves size={20} />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900">FloodVision AI</p>
                <p className="text-xs text-slate-500 font-medium">Response Console</p>
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(null); }}
              className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-all ${
                !isSignUp
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(null); }}
              className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-all ${
                isSignUp
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="font-display text-xl font-bold text-slate-900">
            {isSignUp ? "Register Account" : "Welcome Back"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isSignUp
              ? "Create a new profile to access disaster intelligence"
              : "Enter your official credentials to access the response console."}
          </p>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                  <User size={16} className="text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Officer Sharma"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Official Email
              </label>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@disaster-response.gov"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                <Lock size={16} className="text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Role
                </label>
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                  <UserCheck size={16} className="text-slate-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="officer">Response Officer</option>
                    <option value="analyst">Disaster Analyst</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-60"
            >
              {isSubmitting
                ? isSignUp ? "Creating Account..." : "Signing In..."
                : isSignUp ? "Register Account" : "Sign In to Console"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-3 border border-slate-200 text-center text-xs font-medium text-slate-500">
            Connected to FloodVisionAI REST API (`http://localhost:5000/api/v1`)
          </div>
        </div>
      </div>
    </div>
  );
}
