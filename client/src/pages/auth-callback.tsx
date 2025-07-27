import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      toast({
        title: "Authentication failed",
        description: "There was an error logging in with Google. Please try again.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (token) {
      // Store the token and redirect to journal
      localStorage.setItem("token", token);
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Google.",
      });
      
      // Reload to trigger auth context refresh
      window.location.href = "/journal";
    } else {
      setLocation("/login");
    }
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing login...</p>
      </div>
    </div>
  );
}