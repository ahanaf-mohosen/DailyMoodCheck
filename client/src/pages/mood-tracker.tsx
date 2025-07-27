import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function MoodTracker() {
  const { token } = useAuth();

  // Fetch weekly mood data
  const { data: weeklyData = {} } = useQuery({
    queryKey: ["/api/mood/weekly"],
    queryFn: async () => {
      const response = await fetch("/api/mood/weekly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

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

  // Fetch all entries for historical data
  const { data: allEntries = [] } = useQuery({
    queryKey: ["/api/journal/entries"],
    queryFn: async () => {
      const response = await fetch("/api/journal/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  });

  // Transform weekly data for chart
  const chartData = Object.keys(weeklyData).map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    happy: weeklyData[date].happy || 0,
    sad: weeklyData[date].sad || 0,
    anxious: weeklyData[date].anxious || 0,
    neutral: weeklyData[date].neutral || 0,
    suicidal: weeklyData[date].suicidal || 0,
  })).reverse().slice(-7); // Last 7 days

  // Calculate mood distribution
  const moodCounts = allEntries.reduce((acc: any, entry: any) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const moodDistribution = Object.keys(moodCounts).map(mood => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    count: moodCounts[mood],
    color: getMoodColor(mood),
  }));

  function getMoodColor(mood: string) {
    switch (mood) {
      case 'happy': return '#10b981';
      case 'sad': return '#3b82f6';
      case 'anxious': return '#f59e0b';
      case 'suicidal': return '#ef4444';
      default: return '#6b7280';
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Mood Tracker">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{allEntries.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-journal-whills text-blue-600 text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.weeklyEntries || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-week text-green-600 text-xl"></i>
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
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-fire text-orange-600 text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consistency</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(((stats?.weeklyEntries || 0) / 7) * 100)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-purple-600 text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Mood Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weekly Mood Trends</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Week</Button>
                <Button variant="ghost" size="sm">Month</Button>
                <Button variant="ghost" size="sm">Year</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                  <XAxis 
                    dataKey="date" 
                    className="text-sm text-gray-600 dark:text-gray-400"
                  />
                  <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="happy" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="sad" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="anxious" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="suicidal" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <i className="fas fa-chart-line text-4xl mb-4"></i>
                <p>No mood data available yet. Start journaling to see your mood trends!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {moodDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={moodDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
                    <XAxis 
                      dataKey="mood" 
                      className="text-sm text-gray-600 dark:text-gray-400"
                    />
                    <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <i className="fas fa-chart-bar text-4xl mb-4"></i>
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allEntries.slice(0, 5).map((entry: any) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getMoodColor(entry.mood) }}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {entry.mood}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {allEntries.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No entries yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
