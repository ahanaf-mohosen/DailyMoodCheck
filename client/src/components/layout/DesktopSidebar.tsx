import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, User, ChevronLeft, ChevronRight, FileText, Bookmark, History } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "Mood Tracker", href: "/mood-tracker", icon: TrendingUp },
    { name: "History", href: "/history", icon: History },
    { name: "Saved Quotes", href: "/saved-quotes", icon: Bookmark },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div
      className={cn(
        "hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Daily Journal</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}