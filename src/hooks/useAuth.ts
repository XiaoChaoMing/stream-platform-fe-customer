import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
  role_id?: number;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setLoading, setError } = useStore();

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: LoginCredentials) =>
      authService.login(username, password),
    onSuccess: (user) => {
      setUser(user);
      navigate("/");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, password, email, role_id }: RegisterCredentials) =>
      authService.register(username, password, email, role_id),
    onSuccess: (user) => {
      setUser(user);
      navigate("/");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const googleLoginMutation = useMutation({
    mutationFn: () => authService.loginWithGoogle(),
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null);
      navigate("/login");
    }
  });

  return {
    currentUser,
    isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    loginWithGoogle: googleLoginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending
  };
};
