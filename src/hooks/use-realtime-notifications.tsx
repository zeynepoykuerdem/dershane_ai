'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    let channel: any;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } =  await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      if (data) setNotifications(data);

      channel = supabase
        .channel('notif-channel')
        .on('postgres_changes', { 
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`}, 
            (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
        
        })
        .subscribe();

    }
    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    }
    }, [])

    return {notifications,setNotifications};
}