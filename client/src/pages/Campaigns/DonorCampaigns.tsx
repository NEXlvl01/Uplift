import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../axiosConfig.tsx";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MapPin,
  Calendar,
  Heart,
  TrendingUp,
  Users,
  BookmarkIcon,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.4, 0.2, 0.4],
        transition: { duration: 5, repeat: Infinity },
      }}
      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 backdrop-blur-3xl"
    />
  </div>
);

const StatsCard = ({ icon: Icon, title, value }) => (
  <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
    <CardContent className="flex items-center p-6">
      <div className="p-2 bg-zinc-700/50 rounded-lg mr-4">
        <Icon className="h-6 w-6 text-zinc-100" />
      </div>
      <div>
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="text-2xl font-bold text-zinc-100">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const CampaignCard = ({ campaign, isSaved, onToggleSave }) => {
  const navigate = useNavigate();

  const calculateProgress = (raised, target) => {
    const percentage = (raised / target) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const getProgressColor = (amount, target) => {
    const percentage = (amount / target) * 100;
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      High: "bg-red-500/20 text-red-400 border-red-500/50",
      Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      Low: "bg-green-500/20 text-green-400 border-green-500/50",
    };
    return styles[urgency] || styles.Medium;
  };

  const getCategoryBadge = (category) => {
    const styles = {
      Medical: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      Education: "bg-green-500/20 text-green-400 border-green-500/50",
      "Disaster Relief": "bg-red-500/20 text-red-400 border-red-500/50",
      "Community Support":
        "bg-purple-500/20 text-purple-400 border-purple-500/50",
      "Animal Welfare": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      Other: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    };
    return styles[category] || styles.Other;
  };

  const progress = calculateProgress(
    campaign.fundsRaised || 0,
    campaign.targetAmount
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm overflow-hidden h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-zinc-100">
                {campaign.title}
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                {campaign.category}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getUrgencyBadge(campaign.urgency)}>
                {campaign.urgency} Priority
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-300 line-clamp-3">
            {campaign.description || "Support this important cause"}
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Progress</span>
                <span className="text-zinc-100">
                  {formatCurrency(campaign.fundsRaised || 0)} of{" "}
                  {formatCurrency(campaign.targetAmount)}
                </span>
              </div>
              <div className="relative w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out rounded-full ${getProgressColor(
                    campaign.fundsRaised || 0,
                    campaign.targetAmount
                  )}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                onClick={() => navigate(`/campaigns/details/${campaign._id}`)}
              >
                View Details
              </Button>
              <Button
                className={`w-full ${
                  isSaved
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                }`}
                onClick={() => onToggleSave(campaign._id)}
              >
                {isSaved ? "Unsave" : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DonorCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [savedCampaigns, setSavedCampaigns] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    savedCampaigns: 0,
    highPriorityCampaigns: 0,
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const userRole = storedUser?.role;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (userId && userRole === "Donor") {
      fetchSavedCampaigns();
    }
  }, [userId, userRole]);

  useEffect(() => {
    applyFilters();
  }, [
    campaigns,
    selectedUrgency,
    selectedCategory,
    searchQuery,
    activeTab,
    savedCampaigns,
  ]);

  useEffect(() => {
    if (campaigns.length > 0) {
      setStats({
        totalCampaigns: campaigns.length,
        savedCampaigns: savedCampaigns.size,
        highPriorityCampaigns: campaigns.filter(
          (camp) => camp.urgency === "High"
        ).length,
      });
    }
  }, [campaigns, savedCampaigns]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/campaign/getAll");
      setCampaigns(response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedCampaigns = async () => {
    try {
      if (userId) {
        const response = await axios.get(`/user/${userId}/saved-campaigns`);
        setSavedCampaigns(new Set(response.data));
      }
    } catch (error) {
      console.error("Error fetching saved campaigns:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    if (activeTab === "saved") {
      filtered = filtered.filter((campaign) =>
        savedCampaigns.has(campaign._id)
      );
    }

    if (selectedUrgency && selectedUrgency !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.urgency === selectedUrgency
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(query) ||
          (campaign.description &&
            campaign.description.toLowerCase().includes(query))
      );
    }

    setFilteredCampaigns(filtered);
  };

  const toggleSaveCampaign = async (campaignId) => {
    if (!userId) {
      alert("Please log in to save campaigns.");
      return;
    }

    try {
      const isSaved = savedCampaigns.has(campaignId);
      const newSavedCampaigns = new Set(savedCampaigns);

      if (isSaved) {
        await axios.post(`/user/${userId}/unsave-campaign`, { campaignId });
        newSavedCampaigns.delete(campaignId);
      } else {
        await axios.post(`/user/${userId}/save-campaign`, { campaignId });
        newSavedCampaigns.add(campaignId);
      }

      setSavedCampaigns(newSavedCampaigns);
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const resetFilters = () => {
    setSelectedUrgency("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-x-2 bg-zinc-800/80 border border-zinc-700/50 rounded-full px-4 py-1.5 mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium text-zinc-300">
              Discover Campaigns
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
          >
            Fundraising Campaigns
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            Browse and support causes that matter to you
          </motion.p>
        </div>

        {/* Stats Section */}
        {userRole === "Donor" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={TrendingUp}
              title="Total Campaigns"
              value={stats.totalCampaigns}
            />
            <StatsCard
              icon={BookmarkIcon}
              title="Saved Campaigns"
              value={stats.savedCampaigns}
            />
            <StatsCard
              icon={Heart}
              title="High Priority Causes"
              value={stats.highPriorityCampaigns}
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-700/50 border-zinc-600/50 placeholder-zinc-400 text-zinc-100 w-full"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-zinc-700/50 border-zinc-600/50 text-zinc-100">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-zinc-100">
                  All Categories
                </SelectItem>
                <SelectItem value="Medical" className="text-zinc-100">
                  Medical
                </SelectItem>
                <SelectItem value="Education" className="text-zinc-100">
                  Education
                </SelectItem>
                <SelectItem value="Disaster Relief" className="text-zinc-100">
                  Disaster Relief
                </SelectItem>
                <SelectItem value="Community Support" className="text-zinc-100">
                  Community Support
                </SelectItem>
                <SelectItem value="Animal Welfare" className="text-zinc-100">
                  Animal Welfare
                </SelectItem>
                <SelectItem value="Other" className="text-zinc-100">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger className="w-full md:w-[180px] bg-zinc-700/50 border-zinc-600/50 text-zinc-100">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-zinc-100">
                  All Priorities
                </SelectItem>
                <SelectItem value="High" className="text-zinc-100">
                  High
                </SelectItem>
                <SelectItem value="Medium" className="text-zinc-100">
                  Medium
                </SelectItem>
                <SelectItem value="Low" className="text-zinc-100">
                  Low
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
              onClick={resetFilters}
            >
              <Filter className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </div>

        {/* Tabs for All/Saved */}
        {userRole === "Donor" && (
          <Tabs
            defaultValue="all"
            className="mb-8"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="bg-zinc-800/50 border-zinc-700/50">
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="saved">Saved Campaigns</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Campaigns Grid */}
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="flex justify-center mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-purple-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-zinc-400 text-lg">Loading campaigns...</p>
            </motion.div>
          ) : filteredCampaigns.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  isSaved={savedCampaigns.has(campaign._id)}
                  onToggleSave={toggleSaveCampaign}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-zinc-800/30 rounded-lg border border-zinc-700/50"
            >
              <div className="bg-zinc-700/30 p-4 inline-flex rounded-full mb-4">
                <Search className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                No campaigns found
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                {activeTab === "saved"
                  ? "You haven't saved any campaigns yet. Browse all campaigns to find causes you care about."
                  : "No campaigns match your current filters. Try adjusting your search criteria or check back later."}
              </p>
              {activeTab === "saved" && (
                <Button
                  className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => setActiveTab("all")}
                >
                  Browse All Campaigns
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DonorCampaigns;
