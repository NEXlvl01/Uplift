import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../axiosConfig.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  BarChart as BarChartIcon,
  PenLine,
  Activity,
  Calendar,
  Users,
  Target,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard.tsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const navigate = useNavigate("");
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/user/${storedUser.id}`);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get("/campaign/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchCampaignData = async () => {
      try {
        const response = await axios.get("/campaign/fundsbycategory"); // Update with your actual backend API endpoint
        const { activeCampaigns, fundraisingData } = response.data;

        setActiveCampaigns(activeCampaigns);
        console.log(activeCampaigns);

        setCampaignData(
          fundraisingData.map((item, index) => ({
            name: item._id,
            amount: item.totalFunds,
            color: gradientColorsForBars[index % gradientColorsForBars.length],
          }))
        );
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchCampaignData();
    fetchStats();
    fetchUserData();
  }, []);

  const gradientColorsForBars = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
  ];

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
              value="donors"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200"
            >
              <Users className="mr-2 h-4 w-4" />
              Donors
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
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
                        Total Raised
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          ₹{stats.totalRaised.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          all campaigns
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        Across {stats.activeCampaigns} campaigns
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">
                        Active Campaigns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          {stats.activeCampaigns}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          running
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        Ongoing campaigns
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">
                        Total Donors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          {stats.totalDonors.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          supporters
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        Unique donors
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Fundraising Chart */}
                <motion.div variants={itemVariants} className="col-span-full">
                  <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white flex items-center">
                        <BarChartIcon className="mr-2 h-5 w-5 text-indigo-400" />
                        Fundraising Progress
                      </CardTitle>
                      <CardDescription className="text-zinc-200">
                        Total funds raised across all campaigns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent rounded-xl" />
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart
                            data={campaignData}
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
                            // [Previous code remains the same until Fundraising
                            Chart...]
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
                              {campaignData.map((entry, index) => (
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
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Active Campaigns */}
                <motion.div variants={itemVariants} className="col-span-full">
                  <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white flex items-center">
                        <Target className="mr-2 h-5 w-5 text-indigo-400" />
                        Active Campaigns
                      </CardTitle>
                      <CardDescription className="text-zinc-200">
                        Currently running fundraising campaigns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activeCampaigns.length > 0 ? (
                        <div className="h-64 overflow-auto pr-4 w-full custom-scrollbar">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pb-3">
                            {activeCampaigns.map((campaign, index) => (
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
                                    <Target
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
                            <Target size={24} className="text-indigo-400" />
                          </div>
                          <p className="text-zinc-200 mb-2">
                            No active campaigns
                          </p>
                          <Button className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 mt-2">
                            Create Campaign
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          {/* Other tab contents with placeholder content */}
          <TabsContent value="donors" className="mt-0">
            {activeTab === "donors" && (
              <motion.div
                key="donors"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Donor Management
                    </CardTitle>
                    <CardDescription className="text-zinc-200">
                      Track and manage your donor relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-200">
                      Donor management features coming soon...
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
}
