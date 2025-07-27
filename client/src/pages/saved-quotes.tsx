import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SavedQuotes() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch saved quotes
  const { data: savedQuotes, isLoading } = useQuery({
    queryKey: ["/api/quotes/saved"],
    queryFn: async () => {
      const response = await fetch("/api/quotes/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch saved quotes");
      return response.json();
    },
  });

  // Unsave quote mutation
  const unsaveQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const response = await fetch(`/api/quotes/${quoteId}/save`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to remove quote");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote removed",
        description: "Quote has been removed from your saved quotes.",
      });
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

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sad': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'anxious': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suicidal': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Layout title="Saved Quotes">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Saved Quotes">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Saved Quotes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your collection of inspirational quotes
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {savedQuotes?.length || 0} quotes saved
          </div>
        </div>

        {!savedQuotes || savedQuotes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bookmark text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No saved quotes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                When you find inspiring quotes in your journal entries, save them to view here later.
              </p>
              <Button asChild>
                <a href="/journal">
                  <i className="fas fa-pen mr-2"></i>
                  Write a Journal Entry
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {savedQuotes.map((savedQuote: any) => (
              <Card key={savedQuote.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(savedQuote.quote.moodTag)}`}>
                        {savedQuote.quote.moodTag.charAt(0).toUpperCase() + savedQuote.quote.moodTag.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Saved {new Date(savedQuote.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unsaveQuoteMutation.mutate(savedQuote.quote.id)}
                      disabled={unsaveQuoteMutation.isPending}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 italic mb-3">
                    "{savedQuote.quote.text}"
                  </blockquote>
                  <p className="text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                    — {savedQuote.quote.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}