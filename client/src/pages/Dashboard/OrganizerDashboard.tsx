import React from "react";
import { motion } from "framer-motion";
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

  const organizer = {
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Campaign Organizer",
    profilePicture: "/profile.jpg",
  };

  const campaignData = [
    { name: "Jan", amount: 15000 },
    { name: "Feb", amount: 22000 },
    { name: "Mar", amount: 18500 },
    { name: "Apr", amount: 25000 },
    { name: "May", amount: 30000 },
    { name: "Jun", amount: 27000 },
  ];

  const activeCampaigns = [
    "Clean Water Initiative",
    "Education for All",
    "Community Garden Project",
  ];

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
          <Card className="border-0 overflow-hidden bg-black/40 backdrop-blur-md rounded-3xl shadow-xl border-t border-white/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-70" />
                  <Avatar className="w-24 h-24 border-2 border-black relative">
                    <AvatarImage
                      src={organizer.profilePicture}
                      alt={organizer.fullName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                      {organizer.fullName?.charAt(0) ?? "O"}
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
                    {organizer.fullName}
                  </motion.h2>
                  <motion.p
                    className="text-zinc-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {organizer.email}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge className="text-sm bg-gradient-to-r from-indigo-500/80 to-purple-600/80 border-0 px-3 py-1.5 rounded-full text-white">
                      {organizer.role}
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
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
              value="campaigns"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200"
            >
              <Target className="mr-2 h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger
              value="donors"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200"
            >
              <Users className="mr-2 h-4 w-4" />
              Donors
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white rounded-lg text-zinc-200"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
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
                          $137,500
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          all campaigns
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        Across 6 campaigns
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
                          {activeCampaigns.length}
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          running
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        2 pending approval
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
                          1,247
                        </span>
                        <span className="ml-2 text-xs text-zinc-300">
                          supporters
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm mt-2">
                        89 new this month
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
                              tickFormatter={(value) => `$${value / 1000}k`}
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
                                `$${value.toLocaleString()}`,
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
                        <ScrollArea className="h-56 pr-4">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {activeCampaigns.map((campaign, index) => (
                              <motion.li
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="bg-zinc-800/80 border border-zinc-700/50 group-hover:border-indigo-500/30 p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center justify-center mr-3 flex-shrink-0">
                                          <Target
                                            size={16}
                                            className="text-indigo-400"
                                          />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                          <h4 className="text-white font-medium truncate">
                                            {campaign}
                                          </h4>
                                          <p className="text-xs text-zinc-300">
                                            Active campaign
                                          </p>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="bg-zinc-800 text-white border-zinc-700"
                                    >
                                      View campaign details
                                    </TooltipContent>
                                  </Tooltip>
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
                            <Target size={24} className="text-indigo-400" />
                          </motion.div>
                          <p className="text-zinc-200 mb-2">
                            No active campaigns
                          </p>
                          <Button className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 mt-2">
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
          <TabsContent value="campaigns" className="mt-0">
            {activeTab === "campaigns" && (
              <motion.div
                key="campaigns"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 overflow-hidden rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Campaign Management
                    </CardTitle>
                    <CardDescription className="text-zinc-200">
                      Manage all your fundraising campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-200">
                      Detailed campaign management coming soon...
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

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
                    <CardTitle className="text-white">
                      Campaign Schedule
                    </CardTitle>
                    <CardDescription className="text-zinc-200">
                      Manage your campaign timeline and events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-200">
                      Campaign calendar view coming soon...
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
