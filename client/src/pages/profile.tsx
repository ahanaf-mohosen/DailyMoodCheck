import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch full profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

  const profileForm = useForm({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      trustedEmail: profile?.trustedEmail || "",
      trustedPhone: profile?.trustedPhone || "",
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: data.newPassword }),
      });
      if (!response.ok) throw new Error("Failed to update password");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      passwordForm.reset();
      setShowPasswordForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const handlePasswordUpdate = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    updatePasswordMutation.mutate(data);
  };

  // Update form default values when profile data loads
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        email: profile.email || "",
        trustedEmail: profile.trustedEmail || "",
        trustedPhone: profile.trustedPhone || "",
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <Layout title="Profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profile?.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt={`${profile.name}'s profile`}
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold ${profile?.photoUrl ? 'hidden' : ''}`}>
                  {profile?.name?.split(' ')?.map((n: string) => n[0])?.join('').toUpperCase() || 'U'}
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Please select an image smaller than 5MB",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const photoUrl = e.target?.result as string;
                          // Update profile with new photo URL
                          updateProfileMutation.mutate({ photoUrl });
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                >
                  📷
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    <i className="fas fa-calendar mr-1"></i>
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...profileForm.register("name")}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                    placeholder="Enter your email"
                    disabled
                    className="bg-gray-50 dark:bg-slate-700"
                  />
                </div>
              </div>



              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                className="w-full md:w-auto"
              >
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Emergency Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This contact will be notified if our system detects concerning content in your journal entries.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="trustedEmail">Trusted Contact Email</Label>
                <Input
                  id="trustedEmail"
                  type="email"
                  {...profileForm.register("trustedEmail")}
                  placeholder="Enter emergency contact email"
                />
              </div>
              <div>
                <Label htmlFor="trustedPhone">Trusted Contact Phone</Label>
                <Input
                  id="trustedPhone"
                  type="tel"
                  {...profileForm.register("trustedPhone")}
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordForm ? (
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
                className="w-full md:w-auto"
              >
                <i className="fas fa-key mr-2"></i>
                Change Password
              </Button>
            ) : (
              <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      {...passwordForm.register("newPassword")}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-gray-400`}></i>
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={updatePasswordMutation.isPending}
                  >
                    {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      passwordForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
