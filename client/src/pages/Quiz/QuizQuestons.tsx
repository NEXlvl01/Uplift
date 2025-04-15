import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig.tsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Brain,
  ChevronRight,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trophy,
  Send,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
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

const QuizQuestions = () => {
  const { quizTopic } = useParams();
  const navigate = useNavigate();
  // Use ref to track pending timeouts so we can clear them
  const autoAdvanceTimeoutRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/quiz/questions/${quizTopic}`);
        setQuestions(res.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizTopic]);

  useEffect(() => {
    if (questions.length === 0 || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isAnswered) {
            handleOptionSelect(null, true);
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions, isAnswered, quizFinished]);

  const handleOptionSelect = (option, timeout = false) => {
    if (isAnswered) return;
    
    // Clear any pending auto-advance timeouts
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentQuestion = questions[currentIndex];
    const correct = option === currentQuestion?.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      // Calculate time bonus: more time left = more points
      const timeBonus = Math.floor(timeLeft / 6); // Up to 10 bonus points
      const questionPoints = 100 + timeBonus;
      setScore((prev) => prev + questionPoints);
      
      // Save answer
      setAnswers((prevAnswers) => [...prevAnswers, { 
        question: currentQuestion.questionText,
        selected: option,
        correct: true,
        points: questionPoints
      }]);
      
      toast.success(`Correct! +${questionPoints} points`);
    } else {
      // Save incorrect answer with 0 points
      setAnswers((prevAnswers) => [...prevAnswers, { 
        question: currentQuestion.questionText,
        selected: option || "Time's up",
        correct: false,
        points: 0
      }]);
      
      if (timeout) {
        toast.error("Time's up!");
      } else {
        toast.error("Incorrect answer");
      }
    }
    
    // Check if it's the last question
    if (currentIndex === questions.length - 1) {
      setQuizFinished(true);
    } else if (!timeout) {
      // Set auto-advance timer for user-selected answers (not timeouts)
      // Store the timeout ID so we can cancel it if user clicks "Next" manually
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        handleNext();
      }, 2000);
    }
  };

  const handleNext = () => {
    // Clear any pending auto-advance timeouts before proceeding
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    
    // If question hasn't been answered yet, mark it as skipped
    if (!isAnswered && !quizFinished) {
      const currentQuestion = questions[currentIndex];
      setAnswers((prevAnswers) => [...prevAnswers, { 
        question: currentQuestion.questionText,
        selected: "Skipped",
        correct: false,
        points: 0
      }]);
    }
    
    // Reset states for the next question
    setIsAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setTimeLeft(60);
    
    // Advance to next question if not at the end
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (!quizFinished) {
      // If this was the last question, mark the quiz as finished
      setQuizFinished(true);
    }
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      await axios.post("/quiz/submit", {
        quizTopic,
        score,
        answers
      });
      
      navigate("/quiz/result", { 
        state: { 
          score, 
          totalQuestions: questions.length,
          topic: quizTopic,
          answers
        } 
      });
    } catch (error) {
      toast.error("Failed to submit quiz");
      console.error(error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="p-4 bg-zinc-800/80 backdrop-blur-md rounded-xl border border-zinc-700/50 mb-4">
            <Brain className="h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-zinc-300">Loading questions...</p>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 p-8 bg-zinc-800/80 backdrop-blur-md rounded-xl border border-zinc-700/50 max-w-md">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-center mb-4">No Questions Found</h2>
          <p className="text-zinc-300 text-center mb-6">
            We couldn't find any questions for this topic. Please try another topic.
          </p>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => navigate("/quizzes")}
          >
            Return to Topics
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  // Quiz completion view
  if (quizFinished) {
    return (
      <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
        <AnimatedBackground />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-zinc-700/50 text-center">
                  <Badge className="inline-flex mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 border-none">
                    {quizTopic} Quiz
                  </Badge>
                  <CardTitle className="text-zinc-100 text-2xl">
                    Quiz Complete!
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 text-center">
                  <div className="mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 inline-flex rounded-full mb-4">
                      <Trophy className="h-12 w-12 text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Your Score: <span className="text-purple-400">{score}</span>
                    </h3>
                    <p className="text-zinc-400">
                      You answered {answers.filter(a => a.correct).length} out of {questions.length} questions correctly
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-zinc-100 mb-1">
                        {Math.round((answers.filter(a => a.correct).length / questions.length) * 100)}%
                      </div>
                      <div className="text-sm text-zinc-400">Accuracy</div>
                    </div>
                    
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-zinc-100 mb-1">
                        {score} pts
                      </div>
                      <div className="text-sm text-zinc-400">Total Score</div>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 font-medium py-6"
                    onClick={submitQuiz}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Clock className="h-5 w-5" />
                        </motion.div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Quiz
                      </>
                    )}
                  </Button>
                </CardContent>
                
                <CardFooter className="p-4 bg-zinc-800/50 border-t border-zinc-700/50 justify-center">
                  <p className="text-zinc-400 text-sm">
                    After submission, you'll be able to see your certificate and ranking
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-900 text-zinc-100">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 border-none mb-4">
              {quizTopic} Quiz
            </Badge>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Question {currentIndex + 1} <span className="text-zinc-500">of {questions.length}</span>
                </h1>
                <p className="text-zinc-400">
                  Current score: <span className="text-purple-400 font-medium">{score} points</span>
                </p>
              </div>
              <div className="flex items-center bg-zinc-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-700/50">
                <Clock className="h-5 w-5 text-amber-400 mr-2" />
                <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-zinc-100"}`}>
                  {timeLeft}s
                </span>
              </div>  
            </div>
          </motion.div>
          
          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-zinc-700">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
            </Progress>
          </div>
          
          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-zinc-700/50">
                  <CardTitle className="text-zinc-100 text-xl">
                    {currentQuestion.questionText}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const isCorrectAnswer = option === currentQuestion.correctAnswer;
                    
                    let optionClass = "border-zinc-700/50 hover:border-purple-500/50 hover:bg-zinc-700/30";
                    
                    if (isAnswered) {
                      if (isCorrectAnswer) {
                        optionClass = "border-green-500/50 bg-green-500/10";
                      } else if (isSelected) {
                        optionClass = "border-red-500/50 bg-red-500/10";
                      }
                    } else if (isSelected) {
                      optionClass = "border-purple-500/50 bg-purple-500/10";
                    }
                    
                    return (
                      <motion.div
                        key={index}
                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      >
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left p-4 h-auto text-base font-normal ${optionClass}`}
                          onClick={() => !isAnswered && handleOptionSelect(option)}
                          disabled={isAnswered}
                        >
                          <div className="flex items-center w-full">
                            <div className="mr-3 flex-shrink-0 h-6 w-6 rounded-full bg-zinc-700/50 flex items-center justify-center text-sm">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                            {isAnswered && isCorrectAnswer && (
                              <CheckCircle className="ml-auto text-green-400 h-5 w-5" />
                            )}
                            {isAnswered && isSelected && !isCorrectAnswer && (
                              <XCircle className="ml-auto text-red-400 h-5 w-5" />
                            )}
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </CardContent>
                
                <CardFooter className="border-t border-zinc-700/50 p-4 bg-zinc-800/50">
                  <div className="flex items-center justify-between w-full">
                    {isAnswered ? (
                      <div className="flex items-center">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                            <span className="text-green-400">Correct answer!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-400">
                              {selectedOption === null ? "Time's up!" : "Incorrect answer"}
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-zinc-400">
                        <Trophy className="h-4 w-4 mr-2 text-amber-400" />
                        Answer quickly for more points!
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      className="text-zinc-400 hover:text-purple-400"
                      onClick={handleNext}
                      disabled={currentIndex === questions.length - 1 && isAnswered}
                    >
                      {isAnswered ? "Next" : "Skip"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
          
          {/* Quiz stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-800/30 border-zinc-700/50">
              <CardContent className="p-4 flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Current Score</p>
                  <p className="text-lg font-bold text-zinc-100">{score} pts</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-800/30 border-zinc-700/50">
              <CardContent className="p-4 flex items-center">
                <div className="p-2 bg-amber-500/20 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Average Time</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {Math.floor((60 * currentIndex - timeLeft) / Math.max(1, currentIndex))}s
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-800/30 border-zinc-700/50">
              <CardContent className="p-4 flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Correct Answers</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {answers.filter(a => a.correct).length}/{currentIndex}
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

export default QuizQuestions;