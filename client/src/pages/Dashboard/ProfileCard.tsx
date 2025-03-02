import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../axiosConfig.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenLine, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      role: user?.role || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user, form]);

  const handleEditClick = () => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
    setIsEditing(true);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/user/update/${user._id}`, data);

      const userData = {
        id: response.data._id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
      };

      setUser(response.data);

      localStorage.setItem("user", JSON.stringify(userData));

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCampaign = () => {
    navigate("/create-campaign");
  };

  return (
    <>
      <Card className="border-0 overflow-hidden bg-black/40 backdrop-blur-md rounded-3xl shadow-xl border-t border-white/5">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-70" />
              <Avatar className="w-24 h-24 border-2 border-black relative">
                <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                  {user?.fullName?.charAt(0) ?? "O"}
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
                {user?.fullName}
              </motion.h2>
              <motion.p
                className="text-zinc-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {user?.email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Badge className="text-sm bg-gradient-to-r from-indigo-500/80 to-purple-600/80 border-0 px-3 py-1.5 rounded-full text-white">
                  {user?.role}
                </Badge>
              </motion.div>
            </div>

            <div className="md:ml-auto flex flex-col md:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-white group transition-all duration-300"
                onClick={handleEditClick}
              >
                <PenLine className="mr-2 h-4 w-4 group-hover:text-indigo-400 transition-colors" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isEditing && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-800 shadow-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Edit Your Profile
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-zinc-800 border-zinc-700 focus:border-indigo-500 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-zinc-800 border-zinc-700 focus:border-indigo-500 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Role</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:border-indigo-500 text-white">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectItem
                                  value="Donor"
                                  className="focus:bg-zinc-700 focus:text-white"
                                >
                                  Donor
                                </SelectItem>
                                <SelectItem
                                  value="Campaign Organizer"
                                  className="focus:bg-zinc-700 focus:text-white"
                                >
                                  Campaign Organizer
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;
