import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchRoomMessages = (roomId: string) => {
	// Return the promise so React Query can handle it
	return axios
		.get(`${import.meta.env.VITE_BACKEND_URL}/room/${roomId}`)
		.then((res) => res.data);
};

const useRoomMessages = (roomId: string) => {
	const {
		isPending,
		data: messages,
		isError,
		error,
	} = useQuery({
		queryKey: ["messages", roomId], // Include roomId in the query key for proper caching
		queryFn: () => fetchRoomMessages(roomId),
		enabled: !!roomId, // Only run the query if roomId exists
		refetchOnWindowFocus: false, // Don't refetch when window gets focus (we'll use sockets)
	});

	return { isPending, messages, isError, error };
};

export default useRoomMessages;
