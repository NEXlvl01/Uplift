import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Users,
  Heart,
  ChevronRight,
  Clock,
  Shield,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

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
      className="absolute -bottom-20 left-0 right-0 mx-auto w-3/4 h-3/4 bg-gradient-radial from-indigo-500/20 via-violet-500/10 to-transparent rounded-full blur-3xl"
    ></motion.div>
  );
};

const SlideInSection = ({
  title,
  content,
  imageSrc,
  isReversed = false,
  children,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const xLeftInitial = isReversed ? 100 : -100;
  const xRightInitial = isReversed ? -100 : 100;

  const xLeft = useTransform(scrollYProgress, [0, 0.5], [xLeftInitial, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], [xRightInitial, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.3],
    [isReversed ? 2 : -2, 0]
  );

  return (
    <div ref={ref} className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          style={{ x: xLeft, opacity, scale }}
          className={isReversed ? "md:order-2" : ""}
        >
          {/* Title with animated underline */}
          <div className="relative mb-6 inline-block">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>

          <p className="text-zinc-400 mb-6 leading-relaxed">{content}</p>
          {children}
        </motion.div>

        <motion.div
          style={{ x: xRight, opacity, scale, rotate }}
          className={`flex justify-center items-center ${
            isReversed ? "md:order-1" : ""
          }`}
        >
          {/* Enhanced visual component with animated gradient border and glow */}
          <div className="relative w-full h-64 md:h-80 group">
            {/* Main content container */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/70 via-zinc-800/40 to-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden flex items-center justify-center">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {isReversed ? (
                    <BarChart className="w-16 h-16 text-indigo-400 opacity-60" />
                  ) : (
                    <Shield className="w-16 h-16 text-violet-400 opacity-60" />
                  )}
                </div>
              )}
            </div>

            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-50"
              animate={{
                boxShadow: [
                  "0 0 0 1px rgba(139, 92, 246, 0.1)",
                  "0 0 0 2px rgba(139, 92, 246, 0.3)",
                  "0 0 0 1px rgba(139, 92, 246, 0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-60"
                initial={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: 0.4,
                }}
                animate={{
                  x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  left: `${30 + i * 5}%`,
                  top: `${20 + i * 7}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function About() {
  const containerRef = useRef(null);

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Improved mouse scroll indicator animation
  const scrollIndicatorVariants = {
    animate: {
      y: [0, 10, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Top section - fits in one view without scrolling */}
      <div className="h-screen relative overflow-hidden flex flex-col justify-center">
        {/* Background elements */}
        <BackgroundGrid />
        <GradientBlob />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Subtle badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-x-2 bg-zinc-800/80 border border-zinc-700/50 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-300">
              Our story & mission
            </span>
          </motion.div>

          {/* Main title with character-by-character animation */}
          <div className="overflow-hidden">
            <motion.h1
              className="text-4xl sm:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300"
              initial="hidden"
              animate="visible"
            >
              {"About Uplift".split(" ").map((word, i) => (
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
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Empowering generosity through a seamless, community-driven donation
            platform where every contribution creates meaningful impact.
          </motion.p>

          {/* Feature cards - enhanced with staggered animation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.8,
                },
              },
              hidden: {},
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 30 },
                }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 flex flex-col items-center group hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="p-3 bg-zinc-700/50 rounded-lg mb-4 group-hover:bg-gradient-to-br group-hover:from-indigo-600/20 group-hover:to-violet-600/20 transition-colors duration-300">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Improved mouse scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center"
          >
            <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center p-1">
              <motion.div
                variants={scrollIndicatorVariants}
                animate="animate"
                className="w-1 h-1 bg-indigo-400 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content that slides in from sides as you scroll - enhanced with advanced animations */}
      <SlideInSection
        title="Our Mission"
        content="Uplift was founded with a simple yet powerful vision: to create a world where generosity flows freely and barriers to giving are eliminated. We believe that everyone has the capacity to make a difference, regardless of their resources. Our platform connects passionate individuals with meaningful causes, empowering collective action to address pressing social challenges."
      >
        <div className="flex flex-wrap gap-4 mt-4">
          {missionPoints.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 bg-zinc-800/40 px-4 py-2 rounded-lg border border-zinc-700/50 group hover:border-indigo-500/30 transition-all duration-300"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{
                x: 5,
                backgroundColor: "rgba(79, 70, 229, 0.05)",
              }}
            >
              <point.icon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300" />
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors duration-300">
                {point.text}
              </span>
            </motion.div>
          ))}
        </div>
      </SlideInSection>

      <SlideInSection
        title="Our Impact"
        content="Since our founding, Uplift has facilitated over $2.3 million in donations across 1,200+ campaigns worldwide. Our community of changemakers spans 37 countries, united by the common goal of creating positive change. Every donation on our platform is tracked transparently, allowing donors to see the direct impact of their contributions."
        isReversed={true}
      >
        <div className="grid grid-cols-3 gap-4 mt-6">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
              <div className="text-center relative z-10 py-3 px-2 rounded-lg border border-transparent hover:border-indigo-500/20 transition-all duration-300">
                <motion.p
                  className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 * index,
                    duration: 0.5,
                    type: "spring",
                  }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SlideInSection>

      <SlideInSection
        title="Our Commitment"
        content="At Uplift, transparency isn't just a buzzword—it's the foundation of everything we do. We maintain industry-leading standards for security and accountability, ensuring every dollar reaches its intended destination. Our platform fee of just 3% covers operational costs, with 97% of all donations going directly to campaigns."
      ></SlideInSection>

      <div className="py-24 relative">
        <BackgroundGrid />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300"
          >
            Ready to Make a Difference?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of changemakers who are using Uplift to turn
            compassion into action. Whether you're starting a campaign or
            looking to donate, your journey begins here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            <Link to="/campaigns" className="block">
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.2)",
                }}
                className="bg-gradient-to-br from-indigo-600/90 to-violet-600/90 hover:from-indigo-500 hover:to-violet-500 rounded-xl p-6 text-left transition-all duration-300 h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center text-white/70 hover:text-white"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start a Campaign
                </h3>
                <p className="text-white/70 text-sm">
                  Create your own fundraising campaign and mobilize your
                  community for a cause you care about.
                </p>
              </motion.div>
            </Link>

            <Link to="/donations" className="block">
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(30, 41, 59, 0.2)",
                }}
                className="bg-zinc-800/80 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-700/50 hover:border-indigo-500/30 rounded-xl p-6 text-left transition-all duration-300 h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <Heart className="h-6 w-6 text-indigo-400" />
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center text-zinc-400 hover:text-zinc-200"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                  Donate Now
                </h3>
                <p className="text-zinc-400 text-sm">
                  Support existing campaigns and contribute directly to causes
                  making a difference.
                </p>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Community Driven",
    description:
      "Built by and for changemakers who believe in the power of collective action.",
    icon: <Users className="h-6 w-6 text-indigo-400" />,
  },
  {
    title: "Secure Donations",
    description:
      "Bank-level encryption and transparent fund management for complete peace of mind.",
    icon: <Heart className="h-6 w-6 text-violet-400" />,
  },
  {
    title: "Impact Focused",
    description:
      "Real-time tracking and impact reporting to see your contributions in action.",
    icon: <Sparkles className="h-6 w-6 text-purple-400" />,
  },
];

const missionPoints = [
  { icon: Heart, text: "Democratize giving" },
  { icon: Users, text: "Build global community" },
  { icon: Shield, text: "Ensure transparency" },
  { icon: Clock, text: "Enable rapid response" },
];

const impactStats = [
  { value: "$2.3M+", label: "DONATIONS FACILITATED" },
  { value: "1,200+", label: "CAMPAIGNS FUNDED" },
  { value: "37", label: "COUNTRIES REACHED" },
];
