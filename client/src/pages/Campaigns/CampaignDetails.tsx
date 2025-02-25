import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { 
  HeartHandshake, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Target, 
  Users,
  MessageCircle
} from "lucide-react";
import axios from "../../axiosConfig.tsx";

// Animated gradient background component
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

// Campaign Comment Component
const CommentItem = ({ comment }) => {
  const date = new Date(comment.createdAt);
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-4"
    >
      <Avatar className="h-10 w-10 border border-zinc-700/50">
        {comment.userId.profilePicture ? (
          <AvatarImage src={comment.userId.profilePicture} alt={comment.userId.fullName} />
        ) : (
          <AvatarFallback className="bg-zinc-700 text-zinc-100">
            {comment.userId.fullName.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-100">{comment.userId.fullName}</p>
          <span className="text-xs text-zinc-500">{formattedDate} at {formattedTime}</span>
        </div>
        <p className="text-sm text-zinc-300">{comment.text}</p>
      </div>
    </motion.div>
  );
};

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/campaign/details/${id}`);
        setCampaign(response.data);
      } catch (err) {
        setError("Failed to fetch campaign details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/campaign/${id}/comments`);
        setComments(response.data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    fetchCampaign();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`/campaign/${id}/comments`, {
        text: newComment,
        userId: user?.id,
      });
      setComments([...comments, response.data]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      toast.error("Enter a valid donation amount");
      return;
    }
    try {
      const response = await axios.post("/payment/create-order", {
        amount: donationAmount,
        campaignId: id,
      });

      const { order } = response.data;
      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Uplift Donations",
        description: "Support a Campaign",
        order_id: order.id,
        handler: async function (response) {
          await axios.post("/payment/verify-payment", {
            ...response,
            amount: donationAmount,
            userId: user?.id,
            campaignId: id,
          });
          toast.success("Donation Successful");
          setCampaign({ ...campaign, fundsRaised: campaign.fundsRaised + Number(donationAmount) });
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#6366F1",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Error initiating donation");
      console.error(error);
    }
  };

  const getProgressColor = (amount, target) => {
    const percentage = (amount / target) * 100;
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

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
      "Community Support": "bg-purple-500/20 text-purple-400 border-purple-500/50",
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="inline-block h-12 w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent animate-spin"></div>
          <p className="mt-4 text-zinc-400">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-500/20 text-red-400 mb-6">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <p className="text-xl text-red-400">{error}</p>
          <Button
            onClick={() => window.history.back()}
            className="mt-6 bg-zinc-800 hover:bg-zinc-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(campaign.fundsRaised || 0, campaign.targetAmount);
  const isExpired = new Date(campaign.endDate) < new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Campaign Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              {campaign.title}
            </h1>
            <p className="text-zinc-400">
              Created on {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="lg:col-span-2 bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-zinc-100">
                  About This Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-zinc-300 leading-relaxed"
                >
                  {campaign.description}
                </motion.p>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-zinc-100">
                      {formatCurrency(campaign.fundsRaised || 0)} of{" "}
                      {formatCurrency(campaign.targetAmount)}
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-full rounded-full ${getProgressColor(
                        campaign.fundsRaised || 0,
                        campaign.targetAmount
                      )}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-400 mt-2">
                    <span>{progress}% funded</span>
                    {campaign.status === "Completed" ? (
                      <span className="text-blue-400">
                        {campaign.fundsRaised >= campaign.targetAmount
                          ? "Target achieved!"
                          : "Campaign ended"}
                      </span>
                    ) : (
                      <span className={isExpired ? "text-red-400" : "text-zinc-300"}>
                        {isExpired ? "Campaign ended" : `${daysLeft} days left`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Target Amount</p>
                      <p className="text-lg font-bold text-zinc-100">
                        {formatCurrency(campaign.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <HeartHandshake className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Raised So Far</p>
                      <p className="text-lg font-bold text-zinc-100">
                        {formatCurrency(campaign.fundsRaised || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Calendar className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">End Date</p>
                      <p className="text-lg font-bold text-zinc-100">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Location</p>
                      <p className="text-lg font-bold text-zinc-100">
                        {campaign.location}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation Section */}
            <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm self-start">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-zinc-100">
                  Support This Campaign
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your contribution makes a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.role === "Donor" ? (
                  <>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Enter donation amount"
                          className="bg-zinc-700 text-zinc-300 pl-8 py-6 text-lg"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleDonate}
                          className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          disabled={campaign.status !== "Active"}
                        >
                          {campaign.status === "Active" ? "Make Donation" : "Campaign Ended"}
                        </Button>
                      </motion.div>
                    </div>
                    <div className="text-center text-zinc-400 text-sm">
                      Secure payment powered by RazorPay
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 bg-blue-500/20 rounded-full inline-flex mb-4">
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-zinc-300 mb-4">
                      Only donors can contribute to this campaign.
                    </p>
                    {!user ? (
                      <Button className="bg-zinc-700 hover:bg-zinc-600">
                        Login to Donate
                      </Button>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comments Section */}
          <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm mb-12">
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle className="text-xl font-bold text-zinc-100">
                  Comments
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Join the conversation
                </CardDescription>
              </div>
              <Badge className="ml-auto">
                <MessageCircle className="h-3 w-3 mr-1" />
                {comments.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === "Donor" && (
                <div className="flex gap-4 mb-6">
                  <Avatar className="h-10 w-10 border border-zinc-700/50">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.fullName} />
                    ) : (
                      <AvatarFallback className="bg-zinc-700 text-zinc-100">
                        {user.fullName ? user.fullName.charAt(0) : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Add a comment..."
                      className="bg-zinc-700 border-zinc-600 resize-none text-zinc-100 min-h-24"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleAddComment}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          disabled={!newComment.trim()}
                        >
                          Post Comment
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-zinc-700/50" />

              <AnimatePresence>
                {comments.length > 0 ? (
                  <div className="space-y-1">
                    {comments.map((comment, index) => (
                      <div key={comment._id || index}>
                        <CommentItem comment={comment} />
                        {index < comments.length - 1 && (
                          <Separator className="bg-zinc-700/20" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-zinc-400">
                      No comments yet. Be the first to comment!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}