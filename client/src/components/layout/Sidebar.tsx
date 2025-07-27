import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { href: "/profile", icon: "fas fa-user-circle", label: "Profile" },
    { href: "/mood-tracker", icon: "fas fa-chart-line", label: "Mood Tracker" },
    { href: "/journal", icon: "fas fa-edit", label: "Journal" },
    { href: "/history", icon: "fas fa-history", label: "History" },
    { href: "/saved-quotes", icon: "fas fa-bookmark", label: "Saved Quotes" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 min-h-screen z-30",
        "fixed lg:fixed lg:transform-none",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "",
        "w-64 top-0 left-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-journal-whills text-white text-lg"></i>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Daily Journal</span>
            </div>
            {isMobile && (
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a 
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-primary"
                      )}
                      onClick={() => isMobile && onClose()}
                    >
                      <i className={`${item.icon} text-xl w-6 text-center`}></i>
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
