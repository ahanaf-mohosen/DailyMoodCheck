import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface QuoteGiftBoxProps {
  quote: {
    id: string;
    text: string;
    author: string;
    moodTag: string;
  };
  mood: string;
  isVisible: boolean;
}

export function QuoteGiftBox({ quote, mood, isVisible }: QuoteGiftBoxProps) {
  const [isUnboxed, setIsUnboxed] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!isVisible) return null;

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'text-green-600 dark:text-green-400';
      case 'sad': return 'text-blue-600 dark:text-blue-400';
      case 'anxious': return 'text-yellow-600 dark:text-yellow-400';
      case 'suicidal': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Check if quote is saved
  const { data: isSaved } = useQuery({
    queryKey: ["/api/quotes", quote.id, "saved"],
    queryFn: async () => {
      const response = await fetch(`/api/quotes/${quote.id}/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to check save status");
      const data = await response.json();
      return data.isSaved;
    },
    enabled: isUnboxed && !!quote.id,
  });

  // Save quote mutation
  const saveQuoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/quotes/${quote.id}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to save quote");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote saved!",
        description: "You can view this quote in your saved quotes history.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes", quote.id, "saved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/saved"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save quote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unsave quote mutation
  const unsaveQuoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/quotes/${quote.id}/save`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to unsave quote");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote removed",
        description: "Quote has been removed from your saved quotes.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes", quote.id, "saved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/saved"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove quote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUnbox = () => {
    setIsUnboxed(true);
  };

  const handleSaveQuote = () => {
    if (isSaved) {
      unsaveQuoteMutation.mutate();
    } else {
      saveQuoteMutation.mutate();
    }
  };



  if (!isUnboxed) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-lg border-2 border-dashed border-amber-300 dark:border-amber-600 p-8 text-center">
        <div className="space-y-6">
          {/* Gift Box Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-amber-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-3">
                <i className="fas fa-gift text-white text-3xl"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <i className="fas fa-heart text-white text-xs"></i>
              </div>
            </div>
          </div>
          
          {/* Quote Content Preview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              A special message for you ✨
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Click below to unbox your inspirational quote
            </p>
          </div>
          
          {/* Unbox Button */}
          <Button 
            onClick={handleUnbox}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <i className="fas fa-box-open mr-2"></i>
            Unbox Quote
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-lg border-2 border-solid border-amber-300 dark:border-amber-600 p-8 text-center">
      <div className="space-y-6">
        {/* Opened Gift Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-xl shadow-lg flex items-center justify-center">
            <i className="fas fa-quote-left text-white text-3xl"></i>
          </div>
        </div>
        
        {/* Quote Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your inspirational quote ✨
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-amber-200 dark:border-slate-600">
            <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 italic mb-4">
              "{quote.text}"
            </blockquote>
            <p className="text-right text-sm font-medium text-gray-600 dark:text-gray-400">
              — {quote.author}
            </p>
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-slate-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detected mood: <span className={`font-medium ${getMoodColor(mood)}`}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Only Quote Save/Unsave */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSaveQuote}
            variant={isSaved ? "outline" : "default"}
            disabled={saveQuoteMutation.isPending || unsaveQuoteMutation.isPending}
            className="px-6 py-2"
          >
            <i className={`fas ${isSaved ? "fa-bookmark-slash" : "fa-bookmark"} mr-2`}></i>
            {saveQuoteMutation.isPending || unsaveQuoteMutation.isPending 
              ? "..." 
              : isSaved 
                ? "Unsave Quote" 
                : "Save Quote"}
          </Button>
        </div>
        
        {/* Auto-save indicator */}
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          <i className="fas fa-check-circle text-green-500 mr-1"></i>
          Your journal entry was automatically saved
        </div>
      </div>
    </div>
  );
}
