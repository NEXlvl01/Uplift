import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Globe } from "lucide-react";
import { useEffect, useState } from "react";

// Enhanced Analog Clock Component using react-clock library
const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Calculate hand rotations
  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + time.getHours()) / 12;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-64 h-64 rounded-full bg-zinc-900 border border-zinc-700/50 shadow-xl flex items-center justify-center overflow-hidden"
    >
      {/* Subtle glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-zinc-800 to-zinc-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)]"></div>

      {/* Clock face */}
      <div className="absolute inset-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner"></div>

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-start justify-center"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          <div
            className={`h-6 w-1 ${
              i % 3 === 0
                ? "bg-zinc-400 rounded-full"
                : "bg-zinc-600 rounded-full"
            }`}
          ></div>
        </div>
      ))}

      {/* Hour numbers */}
      {[...Array(12)].map((_, i) => {
        const hour = i === 0 ? 12 : i;
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const radius = 90;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <div
            key={i}
            className="absolute text-zinc-300 font-medium text-sm"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              left: "50%",
              top: "50%",
            }}
          >
            {hour}
          </div>
        );
      })}

      {/* Hour hand */}
      <div
        className="absolute w-1 bg-zinc-200 rounded-full origin-bottom"
        style={{
          height: "60px",
          bottom: "50%",
          left: "calc(50% - 0.5px)",
          transform: `rotate(${hoursRatio * 360}deg)`,
          transformOrigin: "bottom",
          zIndex: 20,
        }}
      ></div>

      {/* Minute hand */}
      <div
        className="absolute w-1 bg-zinc-300 rounded-full origin-bottom"
        style={{
          height: "80px",
          bottom: "50%",
          left: "calc(50% - 0.5px)",
          transform: `rotate(${minutesRatio * 360}deg)`,
          transformOrigin: "bottom",
          zIndex: 30,
        }}
      ></div>

      {/* Second hand */}
      <div
        className="absolute w-0.5 bg-purple-500 rounded-full origin-bottom"
        style={{
          height: "95px",
          bottom: "50%",
          left: "calc(50% - 0.25px)",
          transform: `rotate(${secondsRatio * 360}deg)`,
          transformOrigin: "bottom",
          zIndex: 40,
          transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      ></div>

      {/* Center overlay */}
      <div className="absolute w-4 h-4 rounded-full bg-purple-500 z-50 shadow-lg shadow-purple-400/30"></div>

      {/* Subtle inner shadows for depth */}
      <div className="absolute inset-4 rounded-full bg-transparent shadow-inner shadow-zinc-900/70 pointer-events-none"></div>

      {/* Subtle outer glow */}
      <div className="absolute inset-0 rounded-full shadow-lg shadow-purple-500/10 pointer-events-none"></div>
    </motion.div>
  );
};

// Animated background grid component inspired by Aceternity UI
const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

// Animated gradient blob
const GradientBlob = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 0.15,
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        },
      }}
      className="absolute bottom-0 left-0 right-0 mx-auto w-3/4 h-3/4 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
    ></motion.div>
  );
};

// Animated card component
const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 flex flex-col items-center"
    >
      <div className="p-3 bg-zinc-700/50 rounded-lg mb-4">
        <Icon className="h-6 w-6 text-zinc-200" />
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 text-center">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background elements */}
      <BackgroundGrid />
      <GradientBlob />

      {/* Hero content with layout that includes clock */}
      <div className="relative z-10 max-w-6xl px-6 py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between">
          {/* Left side with original content */}
          <div className="lg:max-w-3xl">
            {/* Subtle badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-x-2 bg-zinc-800/80 border border-zinc-700/50 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-zinc-300">
                Making impact together
              </span>
            </motion.div>

            {/* Main title with character-by-character animation */}
            <div className="overflow-hidden">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-left font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300"
                initial="hidden"
                animate="visible"
              >
                {"Turn Compassion into Action".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={textVariants}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-6 text-lg lg:text-left text-zinc-400 max-w-2xl"
            >
              Join a community of changemakers. Start a campaign or donate to
              support causes that matter to you and create lasting impact.
            </motion.p>

            {/* Buttons with hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 lg:justify-start justify-center"
            >
              <Link to="/campaigns">
                <Button className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-white rounded-full px-8 py-6 text-base font-medium transition-all duration-300 ease-out">
                  <span className="relative z-10 flex items-center">
                    Start a Campaign
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                </Button>
              </Link>
              <Link to="/donate">
                <Button
                  variant="outline"
                  className="group relative border-zinc-600 bg-zinc-800/30 backdrop-blur-sm text-zinc-300 hover:text-white hover:border-indigo-400 rounded-full px-8 py-6 text-base font-medium transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    <Heart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Donate Now
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right side with analog clock */}
          <div className="mt-12 lg:mt-0 flex justify-center items-center">
            <AnalogClock />
          </div>
        </div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <FeatureCard
            icon={Heart}
            title="Support Causes"
            description="Fund initiatives that align with your values and make a difference."
            delay={1.3}
          />
          <FeatureCard
            icon={Globe}
            title="Global Community"
            description="Connect with changemakers from around the world."
            delay={1.5}
          />
          <FeatureCard
            icon={ChevronRight}
            title="Track Impact"
            description="See the real-world difference your contributions make."
            delay={1.7}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center p-1"
          >
            <motion.div className="w-1 h-1 bg-zinc-400 rounded-full"></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
