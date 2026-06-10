"use client";
import CalendarComponent from "./ui/calendar_update";
import Link from "next/link";
import { useState, useEffect } from "react";
import useRealtimeNotifications from "@/hooks/use-realtime-notifications";
import { supabase } from "@/lib/supabase";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
export default function Navbar({
  onCalendarToggle,
  onMenuToggle,
  onProfileToggle,
}: {
  onCalendarToggle: () => void;
  onMenuToggle: () => void;
  onProfileToggle: () => void;
}) {
  const { notifications, setNotifications } = useRealtimeNotifications();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfOpt, setShowProfOpt] = useState(false);
  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));

    return { notifications, setNotifications, markAsRead };
  };

  return (
    <nav className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between w-full">
      <div className="flex items-center gap-2 md: gap-6">
        <Button
          className="md:hidden text-gray-500 hover:text-purple-600 p-1"
          onClick={onMenuToggle}
          variant='secondary'
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Ara..."
            className="border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 w-full transition-all duration-300"
          />
        </div>

        {/* Calendar */}
        <Button
          className="text-gray-500 hover:text-purple-600 text-sm border rounded-lg p-2 sm:px-3 sm:py-1.5"
          onClick={onCalendarToggle}
          variant='secondary'
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M5 20V8h14V6v14z"></path>
            <path d="M12 13h5v5h-5z"></path>
          </svg>
        </Button>
        {/* Notification */}
        <div className="relative">
          <Button
            className="text-gray-500 hover:text-purple-600 text-sm border rounded-lg p-2 sm:px-3 sm:py-1.5"
            onClick={() => setShowNotif(!showNotif)}
            variant='secondary'
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6" />
              <path d="M13 6V4H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-8h-2v8H5V6z" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {notifications.length}
              </span>
            )}
          </Button>

          {showNotif && (
            <div className="absolute -right-12 sm:right-0 top-11 w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  Bildirimler
                </p>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400">Bildirim yok</p>
                </div>
              ) : (
                // Bildirimler varsa göster
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-xs text-gray-300 hover:text-gray-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold" variant='secondary'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m0-8c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1m6-7h4c2.76 0 5 2.24 5 5H5c0-2.76 2.24-5 5-5" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem>Hesabım</DropdownMenuItem>
            <DropdownMenuItem>Ayarlar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 cursor-pointer"
            onClick={async()=>{
              await supabase.auth.signOut()
              window.location.href='/login'
            }}
            >
              
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
