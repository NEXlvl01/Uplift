import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight, Loader2 } from "lucide-react";
import api from "../../axiosConfig.tsx";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100 px-4 relative overflow-hidden">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {mounted &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-500/20"
              style={{
                width: Math.random() * 150 + 50,
                height: Math.random() * 150 + 50,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, Math.random() * -400 - 100],
                opacity: [0.2, 0],
                scale: [1, 1.4],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
      </div>

      {/* Card container */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className="w-full bg-zinc-900/80 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-zinc-800/50 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Card header */}
          <div className="mb-5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "30%" }}
              transition={{ duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-zinc-400 text-sm">Sign in to your account</p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-sm bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-md"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div>
              <Label
                htmlFor="email"
                className="text-zinc-300 text-xs font-medium block mb-1"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="pl-8 bg-zinc-800/50 text-zinc-200 border-zinc-700/50 h-9 text-sm rounded-md"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full"
                  initial={{ width: 0 }}
                  whileFocus={{ width: "100%" }}
                  animate={{ width: formData.email.length > 0 ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="password"
                  className="text-zinc-300 text-xs font-medium"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pl-8 bg-zinc-800/50 text-zinc-200 border-zinc-700/50 h-9 text-sm rounded-md"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full"
                  initial={{ width: 0 }}
                  whileFocus={{ width: "100%" }}
                  animate={{ width: formData.password.length > 0 ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium rounded-md text-sm shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <span>Sign in</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </span>
              )}
            </Button>

            <div className="mt-4 pt-2 text-center flex flex-col items-center gap-1">
              <Separator className="bg-zinc-800/50 w-full mb-3" />
              <p className="text-xs text-zinc-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>

          {/* Connection methods */}
          <div className="mt-5">
            <div className="relative flex items-center justify-center">
              <Separator className="bg-zinc-800/50" />
              <span className="bg-zinc-900 px-2 text-xs text-zinc-500 absolute">
                or continue with
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="h-9 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-9 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <svg
                  className="h-4 w-4 text-[#1DA1F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-9 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1c6.074 0 11 4.925 11 11v.153a11.34 11.34 0 0 1-.181 2.04c-.041.24-.261.387-.5.33-2.064-.481-3.192-.513-4.47.431-.193.143-.456.047-.492-.197a2.555 2.555 0 0 0-2.4-1.806c-1.436 0-2.602 1.18-2.602 2.634 0 .193.022.38.063.561.028.121-.059.235-.177.271-3.36 1.024-6.324-1.394-8.07-3.998a.364.364 0 0 0-.314-.164.367.367 0 0 0-.306.192C2.033 15.671 1 18.355 1 21.1a.9.9 0 0 0 .9.9h.9z" />
                </svg>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
