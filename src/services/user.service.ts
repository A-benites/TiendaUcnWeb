import { api } from "@/lib/axios";
import {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ProfileResponse,
  UpdateProfileResponse,
  ChangePasswordResponse,
} from "@/models/user.types";

export const userService = {
  /**
   * Get the authenticated user's profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<ProfileResponse>("/user/profile");
    return data;
  },

  /**
   * Update the user's profile
   */
  async updateProfile(profileData: UpdateProfileData): Promise<UpdateProfileResponse> {
    const { data } = await api.put<UpdateProfileResponse>("/user/profile", profileData);
    return data;
  },

  /**
   * Change the user's password
   */
  async changePassword(passwordData: ChangePasswordData): Promise<ChangePasswordResponse> {
    const { data } = await api.patch<ChangePasswordResponse>(
      "/user/change-password",
      passwordData
    );
    return data;
  },
};
