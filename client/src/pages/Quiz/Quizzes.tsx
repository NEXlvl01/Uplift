import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Heart,
  Trophy,
  Award,
  Brain,
  Crown,
  Timer,
  Users,
  Sparkles,
  Gift,
  Clock,
  Certificate,
} from "lucide-react";
import axios from "../../axiosConfig.tsx";
import { toast } from "react-hot-toast";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Different pattern - diagonal lines instead of grid */}
    <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(135deg,#80808012_1px,transparent_1px)] bg-[size:30px_30px]" />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.3, 0.15, 0.3],
        transition: { duration: 6, repeat: Infinity },
      }}
      className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-blue-600/5 to-pink-600/10 backdrop-blur-3xl"
    />
  </div>
);

// New component: Leaderboard preview
const LeaderboardPreview = () => {
  const topParticipants = [
    { name: "Alex S.", score: 950, avatar: "A" },
    { name: "Jamie T.", score: 820, avatar: "J" },
    { name: "Taylor M.", score: 795, avatar: "T" },
  ];

  return (
    <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Top Players
        </h3>
        <Button variant="link" className="text-purple-400 p-0">
          Full Leaderboard
        </Button>
      </div>
      <div className="space-y-3">
        {topParticipants.map((player, index) => (
          <div
            key={player.name}
            className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-lg"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium mr-3">
                {player.avatar}
              </div>
              <div>
                <p className="text-zinc-200 font-medium">{player.name}</p>
                <div className="flex items-center text-xs text-zinc-400">
                  <Clock className="h-3 w-3 mr-1" /> Last played 2h ago
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-amber-400 font-bold">{player.score}</span>
              <span className="text-zinc-400 ml-2 text-sm">pts</span>
              {index === 0 && (
                <Crown className="h-4 w-4 ml-2 text-yellow-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// New component: Quiz category selection as hexagonal grid
const HexagonalQuizTopic = ({ topic, icon: Icon, isSelected, onSelect }) => {
  const colorSchemes = {
    Medical: "from-blue-600 to-purple-600",
    Education: "from-purple-600 to-fuchsia-600",
    "Disaster Relief": "from-red-600 to-amber-600",
    "Community Support": "from-emerald-600 to-blue-600",
    "Animal Welfare": "from-amber-600 to-lime-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={() => onSelect(topic)}
    >
      <div className="relative mb-2">
        <svg height="100" width="100" viewBox="0 0 100 100">
          <defs>
            <linearGradient
              id={`gradient-${topic}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                className={`stop-${
                  colorSchemes[topic]?.split(" ")[0] || "from-purple-600"
                }`}
              />
              <stop
                offset="100%"
                className={`stop-${
                  colorSchemes[topic]?.split(" ")[1] || "to-pink-600"
                }`}
              />
            </linearGradient>
          </defs>
          <polygon
            points="50 5, 95 30, 95 70, 50 95, 5 70, 5 30"
            fill={
              isSelected ? `url(#gradient-${topic})` : "rgba(39, 39, 42, 0.5)"
            }
            stroke={
              isSelected ? "rgba(139, 92, 246, 0.8)" : "rgba(63, 63, 70, 0.5)"
            }
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className={`h-10 w-10 ${
              isSelected ? "text-white" : "text-zinc-400"
            }`}
          />
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1"
          >
            <Sparkles className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </div>
      <p
        className={`text-center text-sm font-medium ${
          isSelected ? "text-purple-400" : "text-zinc-400"
        }`}
      >
        {topic}
      </p>
    </motion.div>
  );
};

// Certificate component
const CertificatePreview = () => {
  return (
    <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-4 backdrop-blur-md">
      <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-purple-400" /> Your Certificates
      </h3>
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 rounded-lg border border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
            <Award className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h4 className="font-medium text-zinc-200">
              Certificate of Participation
            </h4>
            <p className="text-xs text-zinc-400">Medical Quiz</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-zinc-300"
        >
          View
        </Button>
      </div>
    </div>
  );
};

const getTopicIcon = (topic) => {
  const icons = {
    Medical: Heart,
    Education: BookOpen,
    "Disaster Relief": Timer,
    "Community Support": Users,
    "Animal Welfare": Heart,
  };
  return icons[topic] || Brain;
};

const Quizzes = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const campaignTopics = [
    "Medical",
    "Education",
    "Disaster Relief",
    "Community Support",
    "Animal Welfare",
  ];

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleStartQuiz = async () => {
    try {
      // console.log("HII");
      const response = await axios.post("/payment/quiz-order", {
        topic: selectedTopic,
        userId: user?.id,
      });

      const { order, campaignId } = response.data;

      const options = {
        key: "rzp_test_LGadjdPLKQ4dGt",
        amount: order.amount,
        currency: "INR",
        name: "Uplift Quizzes",
        description: `Donation to ${selectedTopic} campaign`,
        order_id: order.id,
        handler: async function (response) {
          await axios.post("/payment/verify-quiz", {
            ...response,
            amount: 100,
            userId: user?.id,
            campaignId,
          });
          toast.success("Donation Successful! Quiz will start now.");
          navigate(`quiz/${selectedTopic}`);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#D946EF",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate donation");
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-10 right-0 md:right-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="inline-block p-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mb-6">
              <div className="bg-zinc-900 rounded-lg px-4 py-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-medium">
                  Knowledge for Charity
                </span>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-4">
              Quiz{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Arena
              </span>
            </h1>

            <p className="text-zinc-400 max-w-lg">
              Challenge yourself with our interactive quizzes. Earn certificates
              while supporting causes that matter. Each ₹100 entry fee is
              donated directly to your chosen campaign category.
            </p>
          </motion.div>
        </div>

        {/* Layout - Two column for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Quiz selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Topic selection - Hexagonal design */}
            <Card className="bg-zinc-800/30 border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-zinc-100">
                  Choose Your Topic
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Select a topic to challenge your knowledge and support a cause
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 justify-items-center">
                  {campaignTopics.map((topic) => (
                    <HexagonalQuizTopic
                      key={topic}
                      topic={topic}
                      icon={getTopicIcon(topic)}
                      isSelected={selectedTopic === topic}
                      onSelect={handleTopicSelect}
                    />
                  ))}
                </div>

                {selectedTopic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 space-y-6"
                  >
                    <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-100">
                            {selectedTopic} Quiz
                          </h3>
                          <p className="text-sm text-zinc-400">
                            Support {selectedTopic.toLowerCase()} campaigns
                          </p>
                        </div>
                        <Badge className="bg-purple-500">₹100 Donation</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center">
                          <div className="p-1 bg-zinc-700/50 rounded-lg mr-3">
                            <Clock className="h-4 w-4 text-zinc-300" />
                          </div>
                          <span className="text-zinc-300">
                            10 questions • 15 minutes
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="p-1 bg-zinc-700/50 rounded-lg mr-3">
                            <Award className="h-4 w-4 text-zinc-300" />
                          </div>
                          <span className="text-zinc-300">
                            Earn a participation certificate
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="p-1 bg-zinc-700/50 rounded-lg mr-3">
                            <Trophy className="h-4 w-4 text-zinc-300" />
                          </div>
                          <span className="text-zinc-300">
                            Top score: 950 points
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                        onClick={handleStartQuiz}
                      >
                        Start Quiz (₹100 Donation)
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Player stats card */}
            <Card className="bg-zinc-800/50 border-zinc-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-100">Your Stats</CardTitle>
                <CardDescription className="text-zinc-400">
                  Quiz performance overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                  <span className="text-zinc-400">Quizzes Taken</span>
                  <span className="text-zinc-100 font-medium">7</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                  <span className="text-zinc-400">Average Score</span>
                  <span className="text-zinc-100 font-medium">745 pts</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-700/50">
                  <span className="text-zinc-400">Total Donated</span>
                  <span className="text-zinc-100 font-medium">₹700</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-400">Rankings Position</span>
                  <span className="text-zinc-100 font-medium">#42</span>
                </div>
              </CardContent>
            </Card>

            {/* Certificate preview */}
            <CertificatePreview />

            {/* Leaderboard preview */}
            <LeaderboardPreview />

            {/* Info panel */}
            <Card className="bg-gradient-to-br from-zinc-800/30 to-zinc-800/50 border-zinc-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-100 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-400" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold mr-3">
                    1
                  </div>
                  <p className="text-sm text-zinc-300">
                    Choose a topic that interests you
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold mr-3">
                    2
                  </div>
                  <p className="text-sm text-zinc-300">
                    Pay ₹100 entry fee (100% donated to related campaigns)
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold mr-3">
                    3
                  </div>
                  <p className="text-sm text-zinc-300">
                    Answer questions within the time limit
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold mr-3">
                    4
                  </div>
                  <p className="text-sm text-zinc-300">
                    Receive a certificate and climb the leaderboard
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
