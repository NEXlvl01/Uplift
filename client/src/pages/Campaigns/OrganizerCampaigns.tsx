import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Target,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Users,
  HeartHandshake,
} from "lucide-react";
import axios from "../../axiosConfig.tsx";
import { useNavigate } from "react-router-dom";

// Animated gradient background
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

// Stats Card Component
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

// Campaign Form Component
const CampaignForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    location: "",
    urgency: "Medium",
    endDate: "",
    category: "Other",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-zinc-900 border-zinc-800">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-200">
              Campaign Title
            </Label>
            <Input
              id="title"
              placeholder="Enter campaign title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-200">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 min-h-[120px] focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="targetAmount" className="text-zinc-200">
                Target Amount
              </Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="Enter amount in $"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-zinc-200">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-200">Category</Label>
              <Select
                defaultValue="Other"
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-purple-500">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Medical" className="text-zinc-100">
                    Medical
                  </SelectItem>
                  <SelectItem value="Education" className="text-zinc-100">
                    Education
                  </SelectItem>
                  <SelectItem value="Disaster Relief" className="text-zinc-100">
                    Disaster Relief
                  </SelectItem>
                  <SelectItem
                    value="Community Support"
                    className="text-zinc-100"
                  >
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
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-200">Urgency Level</Label>
              <Select
                defaultValue="Medium"
                onValueChange={(value) =>
                  setFormData({ ...formData, urgency: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-purple-500">
                  <SelectValue placeholder="Select Urgency" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Low" className="text-zinc-100">
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className="text-zinc-100">
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className="text-zinc-100">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-zinc-200">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-zinc-200 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Create Campaign
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

//Campaign Card
const CampaignCard = ({ campaign }) => {
  const getProgressColor = (amount, target) => {
    const percentage = (amount / target) * 100;
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const navigate = useNavigate();

  const calculateProgress = (raised, target) => {
    const percentage = (raised / target) * 100;
    return Math.min(Math.round(percentage), 100);
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

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-500/20 text-green-400 border-green-500/50",
      Completed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      Paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    };
    return styles[status] || styles.Active;
  };

  const progress = calculateProgress(
    campaign.fundsRaised || 0,
    campaign.targetAmount
  );

  const isExpired = new Date(campaign.endDate) < new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))
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
      <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-zinc-100">
                {campaign.title}
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                Created on {new Date(campaign.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getStatusBadge(campaign.status)}>
                {campaign.status}
              </Badge>
              <Badge className={getUrgencyBadge(campaign.urgency)}>
                {campaign.urgency} Priority
              </Badge>
              <Badge className={getCategoryBadge(campaign.category)}>
                {campaign.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-300">{campaign.description}</p>

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

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="h-4 w-4" />
                <span>{campaign.location}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Calendar className="h-4 w-4" />
                <span className={isExpired ? "text-red-400" : "text-zinc-300"}>
                  {isExpired ? "Campaign ended" : `${daysLeft} days left`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>{progress}% funded</span>
              {campaign.status === "Completed" && (
                <span className="text-blue-400">
                  {campaign.fundsRaised >= campaign.targetAmount
                    ? "Target achieved!"
                    : "Campaign ended"}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button variant="outline" className="w-full" onClick={() => {
              navigate(`/campaigns/details/${campaign._id}`)
            }}>
              View Details
            </Button>
            <Button
              className={`w-full ${
                campaign.status === "Completed"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gradient-to-r from-purple-600 to-pink-600"
              }`}
            >
              {campaign.status === "Completed"
                ? "View Results"
                : "Manage Campaign"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function OrganizerCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCampaigns(activeTab);
  }, [campaigns, activeTab]);

  const filterCampaigns = (status) => {
    switch (status) {
      case "active":
        setFilteredCampaigns(
          campaigns.filter((campaign) => campaign.status === "Active")
        );
        break;
      case "completed":
        setFilteredCampaigns(
          campaigns.filter((campaign) => campaign.status === "Completed")
        );
        break;
      default:
        setFilteredCampaigns(campaigns);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, statsRes] = await Promise.all([
        axios.get("/campaign/my-campaigns"),
        axios.get("/campaign/stats"),
      ]);

      setCampaigns(campaignsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (formData) => {
    try {
      const response = await axios.post("/campaign/add", formData);
      setCampaigns([...campaigns, response.data]);
      const statsRes = await axios.get("/campaign/stats");
      setStats(statsRes.data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating campaign", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              Campaign Dashboard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
          >
            My Campaigns
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            Manage your fundraising campaigns and track their progress all in
            one place
          </motion.p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 rounded-full px-8">
                <Plus className="mr-2 h-4 w-4" /> Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Create New Campaign
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Fill in the details below to start your new fundraising
                  campaign
                </DialogDescription>
              </DialogHeader>
              <CampaignForm
                onSubmit={handleCreateCampaign}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            icon={TrendingUp}
            title="Total Raised"
            value={stats ? formatCurrency(stats.totalRaised) : "₹0"}
            loading={loading}
          />
          <StatsCard
            icon={Users}
            title="Total Donors"
            value={stats ? stats.totalDonors.toLocaleString("en-IN") : "0"}
            loading={loading}
          />
          <StatsCard
            icon={HeartHandshake}
            title="Active Campaigns"
            value={stats ? stats.activeCampaigns.toLocaleString("en-IN") : "0"}
            loading={loading}
          />
        </div>

        {/* Campaigns Section */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-800/50 border-zinc-700/50">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["all", "active", "completed"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <p className="text-zinc-400 text-lg">
                      Loading campaigns...
                    </p>
                  </motion.div>
                ) : filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <CampaignCard key={campaign._id} campaign={campaign} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <p className="text-zinc-400 text-lg">
                      {tabValue === "all"
                        ? "No campaigns yet. Start by creating your first campaign!"
                        : `No ${tabValue} campaigns found.`}
                    </p>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
