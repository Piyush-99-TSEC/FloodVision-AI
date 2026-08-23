import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Mail, Lock, ArrowRight, Radio, MapPinned, BarChart3 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full bg-ink-950">
      {/* Left — brand / signature telemetry panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between p-12">
        <div className="absolute inset-0 bg-grid bg-grid opacity-60" />
        <div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(23,182,196,0.25), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(240,70,90,0.15), transparent 70%)" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flood-500/15 text-flood-400">
            <Waves size={22} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-slate-100">FloodVision AI</p>
            <p className="text-xs text-slate-500">Disaster Response Console</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight text-slate-100">
            Decisions in the first hour
            <span className="text-flood-400"> save the most lives.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Centralized flood assessment, damage mapping and rescue prioritization —
            built for response teams operating under pressure.
          </p>

          <div className="mt-10 space-y-4 font-mono text-xs text-slate-500">
            <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3">
              <Radio size={14} className="text-flood-400" />
              <span>5 ACTIVE CASES · 3 REGIONS MONITORED</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3">
              <MapPinned size={14} className="text-amber-400" />
              <span>LAT 13.1362° N · LNG 78.1298° E · ZONE A</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3">
              <BarChart3 size={14} className="text-crimson-400" />
              <span>PRIORITY SCORE 0.89 · LEVEL HIGH</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600">
          ROSP Project · Web Application Phase 1
        </p>
      </div>

      {/* Right — form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-800/70 p-8 shadow-panel backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-flood-500/15 text-flood-400">
              <Waves size={18} />
            </div>
            <p className="font-display text-base font-semibold text-slate-100">FloodVision AI</p>
          </div>

          <h2 className="font-display text-2xl font-semibold text-slate-100">Sign in</h2>
          <p className="mt-1 text-sm text-slate-400">Access your response dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </label>
              <div className="flex items-center gap-2.5 rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 focus-within:border-flood-500 focus-within:ring-1 focus-within:ring-flood-500/40">
                <Mail size={16} className="text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@floodvision.ai"
                  className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Password
              </label>
              <div className="flex items-center gap-2.5 rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-2.5 focus-within:border-flood-500 focus-within:ring-1 focus-within:ring-flood-500/40">
                <Lock size={16} className="text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-ink-600 bg-ink-900 accent-flood-500" />
                Keep me signed in
              </label>
              <a href="#" className="text-flood-400 hover:text-flood-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-flood-500 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-flood-400"
            >
              Sign in to Console
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Access is provisioned by your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
