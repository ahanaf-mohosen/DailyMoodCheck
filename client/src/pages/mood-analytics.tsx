import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface MoodPatternsData {
  moodDistribution: Record<string, number>;
  trend: 'improving' | 'declining' | 'stable';
  riskDays: Array<{ date: string; riskLevel: string; entry: string }>;
  totalEntries: number;
  averageEntriesPerDay: number;
  insights: string[];
}

export default function MoodAnalytics() {
  const [timeRange, setTimeRange] = useState("30");
  const { token } = useAuth();

  // Fetch mood patterns
  const { data: patterns, isLoading } = useQuery<MoodPatternsData>({
    queryKey: ["/api/journal/mood-patterns", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/journal/mood-patterns?days=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch mood patterns");
      return response.json();
    },
  });

  // Fetch weekly mood data
  const { data: weeklyData } = useQuery({
    queryKey: ["/api/mood/weekly"],
    queryFn: async () => {
      const response = await fetch("/api/mood/weekly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch weekly data");
      return response.json();
    },
  });

  const moodColors = {
    happy: '#22c55e',
    content: '#84cc16',
    neutral: '#6b7280',
    anxious: '#f59e0b',
    sad: '#3b82f6',
    angry: '#f97316',
    severely_depressed: '#dc2626',
    suicidal: '#991b1b',
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return { icon: 'fa-arrow-trend-up', color: 'text-green-500', text: 'Improving' };
      case 'declining': return { icon: 'fa-arrow-trend-down', color: 'text-red-500', text: 'Needs Attention' };
      default: return { icon: 'fa-arrow-right', color: 'text-gray-500', text: 'Stable' };
    }
  };

  const formatMoodData = (moodDistribution: Record<string, number>) => {
    return Object.entries(moodDistribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: moodColors[mood as keyof typeof moodColors] || '#6b7280'
    }));
  };

  const formatWeeklyData = (weeklyData: any) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      // Find the date that matches this day of the week
      let dayData = null;
      for (const [dateString, moods] of Object.entries(weeklyData || {})) {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (dayOfWeek === day) {
          dayData = moods;
          break;
        }
      }
      
      return {
        day,
        happy: (dayData as any)?.happy || 0,
        sad: (dayData as any)?.sad || 0,
        anxious: (dayData as any)?.anxious || 0,
        neutral: (dayData as any)?.neutral || 0,
      };
    });
  };

  if (isLoading) {
    return (
      <Layout title="Mood Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your mood patterns...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const trendInfo = getTrendIcon(patterns?.trend || 'stable');

  return (
    <Layout title="Mood Analytics">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Time Range Selector */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mood Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Insights into your emotional patterns and well-being trends
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{patterns?.totalEntries || 0}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-pencil-alt text-primary text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {patterns?.averageEntriesPerDay.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-green-600 text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mood Trend</p>
                  <p className={`text-2xl font-bold ${trendInfo.color}`}>
                    <i className={`fas ${trendInfo.icon} mr-2`}></i>
                    {trendInfo.text}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  patterns?.trend === 'improving' ? 'bg-green-100 dark:bg-green-900' :
                  patterns?.trend === 'declining' ? 'bg-red-100 dark:bg-red-900' :
                  'bg-gray-100 dark:bg-gray-900'
                }`}>
                  <i className={`fas ${trendInfo.icon} ${trendInfo.color} text-xl`}></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Risk Days</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {patterns?.riskDays.length || 0}
                  </p>
                  {patterns?.riskDays && patterns.riskDays.length > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400">needs attention</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  (patterns?.riskDays.length || 0) > 0 ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
                }`}>
                  <i className={`fas fa-shield-alt text-xl ${
                    (patterns?.riskDays.length || 0) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Mood Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-pie mr-2 text-primary"></i>
                Mood Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patterns?.moodDistribution && Object.keys(patterns.moodDistribution).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formatMoodData(patterns.moodDistribution)}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatMoodData(patterns.moodDistribution).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <i className="fas fa-chart-pie text-4xl mb-4 opacity-50"></i>
                    <p>No mood data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Mood Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-line mr-2 text-primary"></i>
                Weekly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyData && Object.keys(weeklyData).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatWeeklyData(weeklyData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="happy" stackId="a" fill="#22c55e" />
                    <Bar dataKey="neutral" stackId="a" fill="#6b7280" />
                    <Bar dataKey="anxious" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="sad" stackId="a" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <i className="fas fa-chart-line text-4xl mb-4 opacity-50"></i>
                    <p>No weekly data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights and Risk Days */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-lightbulb mr-2 text-amber-500"></i>
                Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patterns?.insights && patterns.insights.length > 0 ? (
                <div className="space-y-3">
                  {patterns.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <i className="fas fa-brain text-primary mt-1"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <i className="fas fa-lightbulb text-4xl mb-4 opacity-50"></i>
                  <p>Keep journaling to unlock insights!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Days */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-shield-alt mr-2 text-red-500"></i>
                Mental Health Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patterns?.riskDays && patterns.riskDays.length > 0 ? (
                <div className="space-y-3">
                  {patterns.riskDays.slice(0, 5).map((risk, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      risk.riskLevel === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                      'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              risk.riskLevel === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            }`}>
                              {risk.riskLevel}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(risk.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{risk.entry}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {patterns.riskDays.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium">Remember:</p>
                          <p>It's okay to have difficult days. If you're struggling, consider reaching out to a mental health professional.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <i className="fas fa-shield-alt text-4xl mb-4 text-green-500 opacity-75"></i>
                  <p className="text-green-600 dark:text-green-400 font-medium">Great mental health indicators!</p>
                  <p className="text-sm mt-1">No concerning patterns detected in your recent entries.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
