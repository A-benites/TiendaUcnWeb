import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { UpdateProfileData, ChangePasswordData, UserProfile } from "@/models/user.types";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

/**
 * Hook to fetch the user's profile
 */
export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: async () => {
      const response = await userService.getProfile();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to update the user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (response) => {
      // Update the query cache
      queryClient.setQueryData<UserProfile>(profileKeys.detail(), response.data);
      // Update the auth store
      updateUser(response.data);
      toast.success("Profile updated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
}

/**
 * Hook to change the user's password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });
}
