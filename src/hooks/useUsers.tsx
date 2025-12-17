import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  [key: string]: any;
}

interface UseUsersReturn {
  data: User[];
  refetch: () => void;
  isLoading: boolean;
  error: any;
}

const useUsers = (): UseUsersReturn => {
  const { data, refetch, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/users`);
      return res.data;
    },
  });

  return { data: data || [], refetch, isLoading, error };
};

export default useUsers;