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



  // Mood analysis mutation (using advanced analysis)
  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/journal/analyze-advanced", {
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

  // Fallback analysis mutation (basic analysis)
  const fallbackAnalyzeMutation = useMutation({
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
          mood: currentAnalysis.mood || currentAnalysis.primaryMood,
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
    
    // Try advanced analysis first, fallback to basic if it fails
    analyzeMutation.mutate(entryText, {
      onError: () => {
        console.log("Advanced analysis failed, trying basic analysis...");
        fallbackAnalyzeMutation.mutate(entryText);
      }
    });
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
      case 'angry': return 'fa-angry text-orange-500';
      case 'severely_depressed': return 'fa-sad-cry text-red-600';
      case 'suicidal': return 'fa-sad-tear text-red-500';
      case 'content': return 'fa-smile-beam text-green-400';
      default: return 'fa-meh text-gray-500';
    }
  };

  const getMoodBadgeColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'sad': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'anxious': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'angry': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'severely_depressed': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'suicidal': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'content': return 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200';
      case 'high': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200';
      default: return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200';
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
            mood={currentAnalysis.mood || currentAnalysis.primaryMood}
            isVisible={showQuote}
          />
        )}

        {/* Advanced Analysis Results */}
        {currentAnalysis && currentAnalysis.primaryMood && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <i className="fas fa-brain mr-2 text-primary"></i>
                Mood Analysis Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Mood */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Mood</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodBadgeColor(currentAnalysis.primaryMood)}`}>
                      {currentAnalysis.primaryMood}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(currentAnalysis.confidence * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(currentAnalysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Intensity</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      currentAnalysis.intensity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      currentAnalysis.intensity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {currentAnalysis.intensity}
                    </span>
                  </div>
                  
                  {currentAnalysis.riskLevel && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(currentAnalysis.riskLevel)}`}>
                        {currentAnalysis.riskLevel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Secondary Information */}
                <div className="space-y-3">
                  {currentAnalysis.secondaryMoods && currentAnalysis.secondaryMoods.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Secondary Moods</span>
                      <div className="space-y-1">
                        {currentAnalysis.secondaryMoods.slice(0, 2).map((secondary: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{secondary.mood}</span>
                            <span className="text-gray-500 dark:text-gray-500">{Math.round(secondary.confidence * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentAnalysis.triggers && currentAnalysis.triggers.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Potential Triggers</span>
                      <div className="flex flex-wrap gap-1">
                        {currentAnalysis.triggers.slice(0, 3).map((trigger: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded text-xs">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentAnalysis.sentimentScore !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sentiment Score</span>
                      <span className={`text-sm font-medium ${
                        currentAnalysis.sentimentScore > 0 ? 'text-green-600 dark:text-green-400' :
                        currentAnalysis.sentimentScore < 0 ? 'text-red-600 dark:text-red-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {currentAnalysis.sentimentScore > 0 ? '+' : ''}{currentAnalysis.sentimentScore}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {currentAnalysis.recommendations && currentAnalysis.recommendations.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <i className="fas fa-lightbulb mr-2 text-amber-500"></i>
                    Recommendations for You
                  </h4>
                  <div className="space-y-2">
                    {currentAnalysis.recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {currentAnalysis.analysis?.aiInsights && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <i className="fas fa-robot mr-2 text-primary"></i>
                    AI Insights
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    {currentAnalysis.analysis.aiInsights}
                  </p>
                </div>
              )}
              
              {/* Critical Risk Warning */}
              {currentAnalysis.riskLevel === 'critical' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-exclamation-triangle text-red-600 mt-0.5"></i>
                    <div>
                      <h4 className="text-sm font-bold text-red-800 dark:text-red-200">Crisis Support Available</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        If you're having thoughts of self-harm, please reach out for help immediately:
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                        <div>📞 Crisis Helpline: 988 (US)</div>
                        <div>💬 Crisis Text Line: Text HOME to 741741</div>
                        <div>🚨 Emergency: 911</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
