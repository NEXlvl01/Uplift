import { useEffect, useState } from "react";
import axios from "../../axiosConfig.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip as UITooltip } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenLine, Heart, BarChart as BarChartIcon, Calendar, Activity } from "lucide-react";

const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

    fetchUserData();
  }, []);

  // Card shimmer effect
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Content slide-in effect
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
    "#4ADE80", "#22D3EE", "#818CF8", "#F472B6", "#FB923C"
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

  if (!user) return (
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
      <p className="text-zinc-400 max-w-md">We couldn't locate your user profile. Please try logging in again or contact support for assistance.</p>
      <Button variant="outline" className="mt-6">Return to Home</Button>
    </motion.div>
  );

  const donationHistory = user.donationHistory ?? [];
  const savedCampaigns = user.savedCampaigns ?? [];

  const donationData = donationHistory.length
    ? donationHistory.map((donation) => ({
        name: new Date(donation.date).toLocaleDateString(),
        amount: donation.amount,
      }))
    : [
        { name: "Jan", amount: 0 },
        { name: "Feb", amount: 0 },
        { name: "Mar", amount: 0 },
      ];

  const totalDonated = donationHistory.reduce((sum, donation) => sum + donation.amount, 0);

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
          <Card className="border-0 overflow-hidden bg-black/40 backdrop-blur-md rounded-3xl shadow-xl border-t border-white/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-70" />
                  <Avatar className="w-24 h-24 border-2 border-black relative">
                    <AvatarImage src={user.profilePicture} alt={user.fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                      {user.fullName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-2">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {user.fullName ?? "Unknown User"}
                  </motion.h2>
                  <motion.p 
                    className="text-zinc-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user.email ?? "No email available"}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge className="text-sm bg-gradient-to-r from-indigo-500/80 to-purple-600/80 border-0 px-3 py-1.5 rounded-full text-white">
                      {user.role ?? "No role assigned"}
                    </Badge>
                  </motion.div>
                </div>
                
                <div className="md:ml-auto flex flex-col md:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
                  <Button 
                    variant="outline" 
                    className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-white group transition-all duration-300"
                  >
                    <PenLine className="mr-2 h-4 w-4 group-hover:text-indigo-400 transition-colors" />
                    Edit Profile
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
                  >
                    View Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="donations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200">
              <Activity className="mr-2 h-4 w-4" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200">
              <Heart className="mr-2 h-4 w-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        
          {/* Fixed Tab Contents - Each tab content has its own AnimatePresence */}
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
                      <CardTitle className="text-white text-lg font-medium">Total Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          ${totalDonated.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">lifetime</span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        {donationHistory.length} contributions made
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">Saved Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          {savedCampaigns.length}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">campaigns</span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        {savedCampaigns.length > 0 ? "Ready to contribute" : "Find campaigns to support"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-zinc-900/50 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl relative group hover:border-indigo-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg font-medium">Last Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-400">
                          {donationHistory.length > 0 
                            ? new Date(donationHistory[donationHistory.length - 1]?.date).toLocaleDateString() 
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        {donationHistory.length > 0 
                          ? `$${donationHistory[donationHistory.length - 1]?.amount} donation` 
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
                        Donation History
                      </CardTitle>
                      <CardDescription className="text-zinc-200">
                        Your contribution journey over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {donationData.length > 0 ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent rounded-xl" />
                          <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={donationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                              <defs>
                                {gradientColorsForBars.map((color, index) => (
                                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                                  </linearGradient>
                                ))}
                              </defs>
                              <XAxis 
                                dataKey="name" 
                                stroke="#AAA" 
                                tick={{ fill: '#EEE' }}
                                axisLine={{ stroke: '#666' }}
                                tickLine={{ stroke: '#666' }}
                              />
                              <YAxis 
                                stroke="#AAA" 
                                tick={{ fill: '#EEE' }}
                                axisLine={{ stroke: '#666' }}
                                tickLine={{ stroke: '#666' }}
                                tickFormatter={(value) => `$${value}`}
                              />
                              <Tooltip
                                contentStyle={{ 
                                  backgroundColor: 'rgba(23, 23, 23, 0.9)',
                                  borderColor: '#555',
                                  color: '#FFF',
                                  borderRadius: '8px',
                                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                                }}
                                labelStyle={{ color: '#FFF', marginBottom: '5px' }}
                                formatter={(value) => [`$${value}`, 'Amount']}
                              />
                              <Bar 
                                dataKey="amount" 
                                radius={[8, 8, 0, 0]}
                                animationDuration={1500}
                              >
                                {donationData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={`url(#gradient-${index % gradientColorsForBars.length})`}
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
                            <BarChartIcon size={24} className="text-indigo-400" />
                          </motion.div>
                          <p className="text-zinc-200 mb-2">No donations recorded yet</p>
                          <Button variant="outline" className="text-sm border-zinc-700 text-zinc-200 mt-2">
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
                        <ScrollArea className="h-56 pr-4">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {savedCampaigns.map((campaign, index) => (
                              <motion.li 
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                                <TooltipProvider>
                                  <TooltipTrigger asChild>
                                    <div className="bg-zinc-800/80 border border-zinc-700/50 group-hover:border-indigo-500/30 p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center justify-center mr-3 flex-shrink-0">
                                        <Heart size={16} className="text-indigo-400" />
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                        <h4 className="text-white font-medium truncate">{campaign}</h4>
                                        <p className="text-xs text-zinc-300">Saved campaign</p>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-zinc-800 text-white border-zinc-700">
                                    {campaign}
                                  </TooltipContent>
                                </TooltipProvider>
                              </motion.li>
                            ))}
                          </ul>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-56 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
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
                            <Heart size={24} className="text-indigo-400" />
                          </motion.div>
                          <p className="text-zinc-200 mb-2">No saved campaigns yet</p>
                          <Button variant="outline" className="text-sm border-zinc-700 text-zinc-200 mt-2">
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

          <TabsContent value="donations" className="mt-0">
            {activeTab === "donations" && (
              <motion.div
                key="donations"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Your Donation History</CardTitle>
                    <CardDescription className="text-zinc-200">Track all your contributions over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Donations tab content would go here */}
                    <p className="text-zinc-200">Detailed donation history coming soon...</p>
                  </CardContent>
                </Card>
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
                    <CardTitle className="text-white">Saved Campaigns</CardTitle>
                    <CardDescription className="text-zinc-200">Campaigns you're interested in supporting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Saved campaigns content would go here */}
                    <p className="text-zinc-200">Expanded saved campaigns view coming soon...</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            {activeTab === "calendar" && (
              <motion.div
                key="calendar"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Donation Calendar</CardTitle>
                    <CardDescription className="text-zinc-200">View your donation schedule and upcoming events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar content would go here */}
                    <p className="text-zinc-200">Calendar view coming soon...</p>
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