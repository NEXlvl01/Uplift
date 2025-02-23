import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import api from "../../axiosConfig.tsx";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Donor",
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/user/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
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
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-zinc-400 text-sm">Join our community today</p>
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

          <form onSubmit={handleSignup} className="space-y-3">
            {/* Two column layout for name and email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-zinc-300 text-xs font-medium block mb-1"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="pl-8 bg-zinc-800/50 text-zinc-200 border-zinc-700/50 h-9 text-sm rounded-md"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-zinc-300 text-xs font-medium block mb-1"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email"
                    className="pl-8 bg-zinc-800/50 text-zinc-200 border-zinc-700/50 h-9 text-sm rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Two column layout for passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="password"
                  className="text-zinc-300 text-xs font-medium block mb-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="pl-8 pr-8 bg-zinc-800/50 text-zinc-200 border-zinc-700/50 h-9 text-sm rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-zinc-300 text-xs font-medium block mb-1"
                >
                  Confirm
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    className="pl-8 bg-zinc-800/50 text-zinc-200 border-zinc-700/50 h-9 text-sm rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* User Role */}
            <div>
              <Label className="text-zinc-300 text-xs font-medium block mb-1">
                I want to join as
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-md border cursor-pointer transition-all flex items-center justify-center ${
                    formData.role === "Donor"
                      ? "bg-indigo-600/20 border-indigo-500/50"
                      : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "Donor" }))
                  }
                >
                  <User
                    className={`h-4 w-4 mr-2 ${
                      formData.role === "Donor"
                        ? "text-indigo-300"
                        : "text-zinc-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      formData.role === "Donor"
                        ? "text-indigo-300"
                        : "text-zinc-300"
                    }`}
                  >
                    Donor
                  </span>
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-md border cursor-pointer transition-all flex items-center justify-center ${
                    formData.role === "Campaign Organizer"
                      ? "bg-indigo-600/20 border-indigo-500/50"
                      : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "Campaign Organizer",
                    }))
                  }
                >
                  <UserPlus
                    className={`h-4 w-4 mr-2 ${
                      formData.role === "Campaign Organizer"
                        ? "text-indigo-300"
                        : "text-zinc-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      formData.role === "Campaign Organizer"
                        ? "text-indigo-300"
                        : "text-zinc-300"
                    }`}
                  >
                    Organizer
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Signup button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium rounded-md text-sm shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="mt-4 pt-2 text-center flex flex-col items-center gap-1">
              <Separator className="bg-zinc-800/50 w-full mb-3" />
              <p className="text-xs text-zinc-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
