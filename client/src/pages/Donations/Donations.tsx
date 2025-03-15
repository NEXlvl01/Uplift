import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../axiosConfig.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, AlertCircle } from "lucide-react";

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

const DonationCard = ({ donation }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="w-full"
    >
      <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold text-white">
                {donation.donorName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-zinc-100">
                    {donation.donorName}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {donation.formatTimeAgo}
                  </p>
                </div>
                <Badge className={getCategoryBadge(donation.campaignCategory)}>
                  {donation.campaignCategory}
                </Badge>
              </div>

              <div className="mt-2">
                <p className="text-zinc-300">
                  donated{" "}
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    {donation.formattedAmount}
                  </span>{" "}
                  for
                </p>
                <p className="font-medium text-zinc-100 mt-1">
                  {donation.campaignTitle}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NewDonationAlert = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 mb-4 backdrop-blur-sm"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Heart className="text-pink-500 h-6 w-6" />
          <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-pink-500 animate-ping"></span>
        </div>
        <p className="text-zinc-100 font-medium">New donation received!</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
      >
        Dismiss
      </Button>
    </div>
  </motion.div>
);

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDonationAlert, setNewDonationAlert] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    avgDonation: 0,
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/donation/recent-donations");
        if (response.data.success) {
          const donationsData = response.data.donations;
          setDonations(donationsData);

          if (donationsData.length > 0) {
            const total = donationsData.reduce(
              (sum, donation) => sum + donation.amount,
              0
            );
            setStats({
              totalDonations: donationsData.length,
              totalAmount: total,
              avgDonation: total / donationsData.length,
            });
          }
        } else {
          setError("Failed to load donations");
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donations. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Format currency - Changed from USD to INR (Rupees)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format time
  const formatTimeAgo = (date) => {
    const now = new Date();
    const donationDate = new Date(date);
    const seconds = Math.floor((now - donationDate) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

    return donationDate.toLocaleDateString();
  };

  // Enhanced donations with formatted values
  const enhancedDonations = donations.map((donation) => ({
    ...donation,
    formatTimeAgo: formatTimeAgo(donation.donatedAt),
    formattedAmount: formatCurrency(donation.amount),
  }));

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <svg
              className="animate-spin h-12 w-12 text-purple-500 mb-4"
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
            <p className="text-xl text-zinc-400">Loading donation feed...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
            <CardContent className="p-8 flex flex-col items-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Error Loading Donations
              </h3>
              <p className="text-zinc-400">{error}</p>
              <Button
                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              Recent Activity
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
          >
            Live Donation Feed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            Watch in real-time as people support causes that matter
          </motion.p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            icon={TrendingUp}
            title="Total Donations"
            value={stats.totalDonations}
          />
          <StatsCard
            icon={Heart}
            title="Total Amount"
            value={formatCurrency(stats.totalAmount)}
          />
          <StatsCard
            icon={TrendingUp}
            title="Average Donation"
            value={formatCurrency(stats.avgDonation)}
          />
        </div>

        {/* Donation Feed */}
        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-100">
              Recent Donations
            </CardTitle>
            <CardDescription className="text-zinc-400">
              See who's making a difference right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {newDonationAlert && (
                <NewDonationAlert onClose={() => setNewDonationAlert(false)} />
              )}
            </AnimatePresence>

            {enhancedDonations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-zinc-800/30 rounded-lg border border-zinc-700/50"
              >
                <div className="bg-zinc-700/30 p-4 inline-flex rounded-full mb-4">
                  <Heart className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                  No donations yet
                </h3>
                <p className="text-zinc-400 max-w-md mx-auto">
                  Be the first to donate and make a difference!
                </p>
                <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600">
                  Donate Now
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {enhancedDonations.map((donation) => (
                    <DonationCard key={donation._id} donation={donation} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donations;
