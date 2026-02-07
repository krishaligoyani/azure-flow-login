import { useState, useRef } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card w-full max-w-md px-8 py-10 sm:px-10 animate-fade-in"
      style={{ transitionProperty: "transform", transitionDuration: "0.15s" }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/60">
          Sign in to continue to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-glow w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/30 outline-none focus:border-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-glow w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-primary-foreground placeholder:text-primary-foreground/30 outline-none focus:border-primary/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-glow w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin-slow" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-xs">
        <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
          Forgot Password?
        </a>
        <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
          Create Account
        </a>
      </div>
    </div>
  );
}
