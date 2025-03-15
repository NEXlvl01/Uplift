import { useEffect, useState } from "react";
import axios from "../../axiosConfig.tsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PenLine,
  Heart,
  BarChart as BarChartIcon,
  Calendar,
  Activity,
} from "lucide-react";
import ProfileCard from "./ProfileCard.tsx";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationHistory, setDonationHistory] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [donationSummary, setDonationSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/user/${storedUser.id}/stats`);
        setUser(storedUser);
        setTotalDonated(data.totalDonated);
        setDonationHistory(data.donationHistory);
        setSavedCampaigns(data.savedCampaigns);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDonationSummary = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser.id;
        const response = await axios.get(`/user/donation-summary/${userId}`);
        setDonationSummary(response.data);
      } catch (error) {
        console.error("Error fetching donation summary:", error);
      }
    };

    fetchUserStats();
    fetchDonationSummary();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const gradientColorsForBars = [
    "#4ADE80",
    "#22D3EE",
    "#818CF8",
    "#F472B6",
    "#FB923C",
  ];

  if (loading)
    return (
      <div className="container mx-auto p-6 space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full rounded-2xl bg-zinc-800/40" />
          <Skeleton className="h-40 w-full rounded-2xl bg-zinc-800/40" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl bg-zinc-800/40" />
        <Skeleton className="h-60 w-full rounded-2xl bg-zinc-800/40" />
      </div>
    );

  if (!user)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-[60vh] text-center p-6 w-full"
      >
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={48} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
        <p className="text-zinc-400 max-w-md">
          We couldn't locate your user profile. Please try logging in again or
          contact support for assistance.
        </p>
        <Button variant="outline" className="mt-6">
          Return to Home
        </Button>
      </motion.div>
    );

  // Main animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-full px-4 py-8 space-y-8 mx-auto"
      >
        {/* Profile Header */}
        <motion.div variants={cardVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-3xl blur-xl opacity-30" />
          <ProfileCard user={user} setUser={setUser} />
        </motion.div>

        {/* Dashboard Tabs */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-1 rounded-xl mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200"
            >
              <BarChartIcon className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200"
            >
              <Heart className="mr-2 h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          
          <TabsContent value="overview" className="mt-0">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Stats Cards */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">
                        Total Donations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          ₹{totalDonated.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          lifetime
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        {donationHistory.length} contributions made
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Saved Campaigns */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">
                        Saved Campaigns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          {savedCampaigns.length}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          campaigns
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        {savedCampaigns.length > 0
                          ? "Ready to contribute"
                          : "Find campaigns to support"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Last Activity */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">
                        Last Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          {donationHistory.length > 0
                            ? new Date(
                                donationHistory[
                                  donationHistory.length - 1
                                ]?.date
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        {donationHistory.length > 0
                          ? `₹${
                              donationHistory[donationHistory.length - 1]
                                ?.amount
                            } donation`
                          : "No recent activity"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Donation Chart */}
                <motion.div variants={itemVariants} className="col-span-full">
                  <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white flex items-center">
                        <BarChartIcon className="mr-2 h-5 w-5 text-indigo-400" />
                        Donation Categories
                      </CardTitle>
                      <CardDescription className="text-zinc-200">
                        Breakdown of your donations by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {donationSummary.length > 0 ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent rounded-xl" />
                          <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                              data={donationSummary}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                              }}
                            >
                              <defs>
                                {gradientColorsForBars.map((color, index) => (
                                  <linearGradient
                                    key={`gradient-${index}`}
                                    id={`gradient-${index}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={color}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={color}
                                      stopOpacity={0.4}
                                    />
                                  </linearGradient>
                                ))}
                              </defs>
                              <XAxis
                                dataKey="name"
                                stroke="#AAA"
                                tick={{ fill: "#EEE" }}
                                axisLine={{ stroke: "#666" }}
                                tickLine={{ stroke: "#666" }}
                              />
                              <YAxis
                                stroke="#AAA"
                                tick={{ fill: "#EEE" }}
                                axisLine={{ stroke: "#666" }}
                                tickLine={{ stroke: "#666" }}
                                tickFormatter={(value) => `₹${value / 1000}k`}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(23, 23, 23, 0.9)",
                                  borderColor: "#555",
                                  color: "#FFF",
                                  borderRadius: "8px",
                                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                                }}
                                labelStyle={{
                                  color: "#FFF",
                                  marginBottom: "5px",
                                }}
                                formatter={(value) => [
                                  `₹ ${value.toLocaleString()}`,
                                  "Amount",
                                ]}
                              />
                              <Bar
                                dataKey="amount"
                                radius={[8, 8, 0, 0]}
                                animationDuration={1500}
                              >
                                {donationSummary.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#gradient-${
                                      index % gradientColorsForBars.length
                                    })`}
                                    stroke="rgba(255, 255, 255, 0.3)"
                                    strokeWidth={1}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-4"
                          >
                            <BarChartIcon
                              size={24}
                              className="text-indigo-400"
                            />
                          </motion.div>
                          <p className="text-zinc-200 mb-2">
                            No donations recorded yet
                          </p>
                          <Button
                            variant="outline"
                            className="text-sm border-zinc-700 text-zinc-200 mt-2"
                          >
                            Explore Campaigns
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Saved Campaigns */}
                <motion.div variants={itemVariants} className="col-span-full">
                  <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white flex items-center">
                        <Heart className="mr-2 h-5 w-5 text-indigo-400" />
                        Saved Campaigns
                      </CardTitle>
                      <CardDescription className="text-zinc-200">
                        Campaigns you're interested in supporting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {savedCampaigns.length > 0 ? (
                        <div className="h-64 overflow-auto pr-4 w-full custom-scrollbar">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pb-3">
                            {savedCampaigns.map((campaign, index) => (
                              <li
                                key={campaign._id || index}
                                className="bg-zinc-800/90 border border-zinc-700/50 hover:border-indigo-500/40 p-5 rounded-xl w-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group"
                                onClick={() => {
                                  navigate(
                                    `/campaigns/details/${campaign._id}`
                                  );
                                }}
                              >
                                <div className="flex items-center w-full">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center justify-center mr-4 flex-shrink-0 group-hover:from-indigo-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                                    <Heart
                                      size={20}
                                      className="text-indigo-400 group-hover:text-indigo-300"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium truncate max-w-full text-base mb-1 group-hover:text-indigo-100">
                                      {campaign.title || "Untitled Campaign"}
                                    </h4>
                                    <div className="flex items-center">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                                        {campaign.category || "Uncategorized"}
                                      </span>
                                      <span className="text-xs text-zinc-400 ml-2">
                                        ID: {campaign._id.substring(0, 6)}...
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-zinc-500 group-hover:text-indigo-400 ml-2 transition-colors duration-300">
                                    →
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-56 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
                          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                            <Heart size={24} className="text-indigo-400" />
                          </div>
                          <p className="text-zinc-200 mb-2">
                            No saved campaigns yet
                          </p>
                          <Button
                            className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 mt-2"
                            onClick={() => {
                              navigate("/campaigns");
                            }}
                          >
                            Browse Campaigns
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {activeTab === "saved" && (
              <motion.div
                key="saved"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Saved Campaigns
                    </CardTitle>
                    <CardDescription className="text-zinc-200">
                      Campaigns you're interested in supporting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Saved campaigns content would go here */}
                    <p className="text-zinc-200">
                      Expanded saved campaigns view coming soon...
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default DonorDashboard;
