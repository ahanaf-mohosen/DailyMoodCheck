import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function History() {
  const { token } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  // Fetch all journal entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/journal/entries/all"],
    queryFn: async () => {
      const response = await fetch("/api/journal/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (isLoading) {
    return (
      <Layout title="Journal History">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your journal history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Journal History">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Journal History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all your journal entries and reflect on your emotional journey
          </p>
        </div>

        {entries.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <i className="fas fa-journal-whills text-6xl mb-6"></i>
                <h3 className="text-xl font-semibold mb-2">No journal entries yet</h3>
                <p className="mb-6">Start writing your first journal entry to begin tracking your emotional journey.</p>
                <Button asChild>
                  <a href="/journal">
                    <i className="fas fa-pencil-alt mr-2"></i>
                    Write Your First Entry
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entries List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Entries ({entries.length})
              </h2>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {entries.map((entry: any) => (
                  <Card 
                    key={entry.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEntry?.id === entry.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <i className={`fas ${getMoodIcon(entry.mood)} text-lg`}></i>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(entry.createdAt)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getMoodBadgeColor(entry.mood)}`}>
                              {entry.mood}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {entry.entryText.substring(0, 120)}...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Entry Details */}
            <div className="sticky top-6">
              {selectedEntry ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Full Entry
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm px-3 py-1 rounded-full capitalize ${getMoodBadgeColor(selectedEntry.mood)}`}>
                          {selectedEntry.mood}
                        </span>
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <i className={`fas ${getMoodIcon(selectedEntry.mood)} text-sm`}></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <i className="fas fa-calendar mr-2"></i>
                        {formatDate(selectedEntry.createdAt)}
                      </p>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                          {selectedEntry.entryText}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <i className="fas fa-mouse-pointer text-4xl mb-4"></i>
                      <h3 className="text-lg font-semibold mb-2">Select an entry</h3>
                      <p>Click on any entry from the list to read the full content</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}