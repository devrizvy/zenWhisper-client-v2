import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Hook for fetching private messages for a specific chat
const fetchPrivateMessages = (chatId: string) => {
  return axios.get(`${import.meta.env.VITE_BACKEND_URL}/private-chat/${chatId}`)
    .then(res => res.data);
};

export const usePrivateMessages = (chatId: string) => {
  const { isPending, data: messages, isError, error, refetch } = useQuery({
    queryKey: ["privateMessages", chatId],
    queryFn: () => fetchPrivateMessages(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });

  return { isPending, messages: messages || [], isError, error, refetch };
};

// Hook for fetching all chats for a user
const fetchUserChats = (userEmail: string) => {
  return axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-chats/${userEmail}`)
    .then(res => res.data);
};

export const useUserChats = (userEmail: string) => {
  const { isPending, data: chats, isError, error, refetch } = useQuery({
    queryKey: ["userChats", userEmail],
    queryFn: () => fetchUserChats(userEmail),
    enabled: !!userEmail,
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Refetch every 30 seconds to get new chats
  });

  return { isPending, chats: chats || [], isError, error, refetch };
};