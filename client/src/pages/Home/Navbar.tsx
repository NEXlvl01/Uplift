import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, LogOut, 
  LayoutDashboard, ChevronDown 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Fetch user details on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Campaigns", path: "/campaigns" },
    { name: "Donations", path: "/donations" },
    { name: "Quiz For Cause", path: "/quizzes" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "backdrop-blur-md sticky top-0 z-50 h-[80px] flex justify-center items-center transition-all duration-300",
        scrolled 
          ? "bg-zinc-950/95 shadow-lg shadow-black/30" 
          : "bg-zinc-950/85"
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Enhanced Logo */}
        <Link
          to="/"
          className="group flex items-center space-x-2 text-2xl font-bold"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center justify-center"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10">
              <motion.circle 
                cx="20" 
                cy="20" 
                r="15" 
                fill="url(#gradient-fill)" 
                className="drop-shadow-lg"
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ 
                  scale: [0.9, 1.02, 0.9],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
              <motion.path 
                d="M20 8v17M13 18l7-7 7 7" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              <defs>
                <radialGradient id="gradient-fill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 16) rotate(90) scale(20)">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4338ca" />
                </radialGradient>
              </defs>
            </svg>
            <motion.div
              className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"
              animate={{ 
                scale: [0.8, 1.15, 0.8],
                opacity: [0.3, 0.15, 0.3],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <div className="overflow-hidden">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-indigo-200 via-indigo-100 to-zinc-200 bg-clip-text text-transparent inline-block font-extrabold tracking-tight"
            >
              Uplift
              <motion.div 
                className="h-[3px] w-full bg-gradient-to-r from-indigo-500 to-indigo-300 mt-0.5"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </motion.span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link to={item.path} legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none",
                        location.pathname === item.path
                          ? "bg-zinc-900 text-white" 
                          : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-50"
                      )}
                    >
                      <span className="relative">
                        {item.name}
                        {location.pathname === item.path && (
                          <motion.span
                            layoutId="navbar-indicator"
                            className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-500 to-indigo-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Profile or Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-zinc-900/80 text-zinc-200 hover:text-white hover:bg-zinc-800/90 transition-all duration-200 flex items-center gap-2 py-2 px-4 rounded-md cursor-pointer shadow-md border border-zinc-800/80"
                >
                  <Avatar className="w-7 h-7 ring-1 ring-indigo-500/30">
                    <AvatarImage
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${user.fullName[0]}&background=6366f1&color=ffffff`
                      }
                      alt={user.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-indigo-700 text-zinc-100 text-xs font-medium">
                      {user.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.fullName}</span>
                  <ChevronDown size={16} className="text-zinc-400" />
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-zinc-900 text-zinc-100 border border-zinc-800 mt-2 rounded-lg shadow-xl overflow-hidden"
                sideOffset={8}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem
                    className="px-4 py-3 cursor-pointer flex items-center gap-2.5 hover:bg-zinc-800/70 focus:bg-zinc-800 transition-colors duration-150"
                    onClick={() => navigate("/dashboard")}
                  >
                    <LayoutDashboard size={16} className="text-indigo-400" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-3 cursor-pointer flex items-center gap-2.5 hover:bg-zinc-800/70 focus:bg-zinc-800 transition-colors duration-150 text-red-400 hover:text-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    className="border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/90 transition-all duration-200 py-1.5 px-4 rounded-md"
                  >
                    Log In
                  </Button>
                </motion.div>
              </Link>
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-md py-1.5 px-4 rounded-md transition-all duration-300">
                    Sign Up
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-zinc-300 hover:text-white p-2 rounded-md hover:bg-zinc-800 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation - Slide In */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-[80px] left-0 right-0 bg-zinc-950/98 backdrop-blur-lg border-t border-zinc-900 shadow-xl overflow-hidden"
          >
            <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center py-3 px-4 rounded-md transition-all",
                        location.pathname === item.path
                          ? "bg-zinc-900 text-white" 
                          : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-100"
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-zinc-900">
                {user ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 rounded-md">
                      <Avatar className="w-8 h-8 ring-1 ring-indigo-500/30">
                        <AvatarImage
                          src={
                            user.profilePicture ||
                            `https://ui-avatars.com/api/?name=${user.fullName[0]}&background=6366f1&color=ffffff`
                          }
                          alt={user.fullName}
                        />
                        <AvatarFallback className="bg-indigo-700 text-zinc-100">
                          {user.fullName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{user.fullName}</span>
                        <span className="text-xs text-zinc-500">Signed in</span>
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-2">
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-zinc-800 text-red-400 hover:text-red-300 hover:bg-zinc-900 hover:border-zinc-700"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}