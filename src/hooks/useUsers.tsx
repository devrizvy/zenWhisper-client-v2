import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";

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
      const response = await api.get('/auth/users');
      return response.data;
    },
  });

  return { data: data || [], refetch, isLoading, error };
};

export default useUsers;