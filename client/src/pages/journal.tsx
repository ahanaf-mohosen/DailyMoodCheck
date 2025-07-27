import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { QuoteGiftBox } from "@/components/QuoteGiftBox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";

export default function Journal() {
  const [entryText, setEntryText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      const response = await fetch("/api/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });



  // Mood analysis mutation (no automatic saving)
  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entryText: text }),
      });
      if (!response.ok) throw new Error("Failed to analyze mood");
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentAnalysis(data);
      setShowQuote(true);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Manual save journal mutation
  const saveJournalMutation = useMutation({
    mutationFn: async () => {
      if (!currentAnalysis) throw new Error("Please analyze your mood first");
      setIsSaving(true);
      const response = await fetch("/api/journal/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          entryText,
          mood: currentAnalysis.mood,
        }),
      });
      if (!response.ok) throw new Error("Failed to save journal");
      return response.json();
    },
    onSuccess: () => {
      setIsSaving(false);
      toast({
        title: "Journal saved!",
        description: "Your entry has been saved and your mood has been recorded.",
      });
      setEntryText("");
      setShowQuote(false);
      setCurrentAnalysis(null);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
    onError: (error: any) => {
      setIsSaving(false);
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!entryText.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something in your journal before analyzing your mood.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate(entryText);
  };

  const handleSaveJournal = () => {
    if (!currentAnalysis) {
      toast({
        title: "Analysis required",
        description: "Please analyze your mood before saving the journal entry.",
        variant: "destructive",
      });
      return;
    }
    saveJournalMutation.mutate();
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return 'fa-smile text-green-500';
      case 'sad': return 'fa-frown text-blue-500';
      case 'anxious': return 'fa-meh-rolling-eyes text-yellow-500';
      case 'suicidal': return 'fa-sad-tear text-red-500';
      default: return 'fa-meh text-gray-500';
    }
  };

  const getMoodBadgeColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'sad': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'anxious': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'suicidal': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Layout title="Today's Journal">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Today's Date Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">How are you feeling today?</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{formatDate(new Date())}</p>
              </div>
              <div className="text-4xl">
                <i className="fas fa-calendar-day text-primary"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Writing Area */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <label htmlFor="journalEntry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What's on your mind today? Write about your thoughts, feelings, and experiences...
              </label>
              <Textarea
                id="journalEntry"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                className="w-full h-64 resize-none"
                placeholder="Dear Journal, today I feel..."
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <i className="fas fa-info-circle mr-1"></i>
                Your thoughts are private and secure
                {isSaving && (
                  <span className="ml-3 text-primary">
                    <i className="fas fa-spinner fa-spin mr-1"></i>
                    Saving...
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending || !entryText.trim()}
                  className="px-6 py-3"
                >
                  <i className="fas fa-heart mr-2"></i>
                  {analyzeMutation.isPending ? "Analyzing..." : "Analyze My Mood"}
                </Button>
                
                {currentAnalysis && (
                  <Button
                    onClick={handleSaveJournal}
                    disabled={saveJournalMutation.isPending || isSaving}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <i className="fas fa-save mr-2"></i>
                    {saveJournalMutation.isPending ? "Saving..." : "Save Journal"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Gift Box */}
        {showQuote && currentAnalysis && (
          <QuoteGiftBox
            quote={currentAnalysis.quote}
            mood={currentAnalysis.mood}
            isVisible={showQuote}
          />
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.weeklyEntries || 0}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">entries logged</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-pencil-alt text-green-600 text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.currentStreak || 0}</p>
                  <p className="text-xs text-primary">days in a row</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-fire text-primary text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Most Common</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{stats?.commonMood || 'Neutral'}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">mood this month</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <i className={`fas ${getMoodIcon(stats?.commonMood || 'neutral').split(' ')[0]} text-amber-600 text-xl`}></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </Layout>
  );
}
