import { api } from "@/lib/axios";
import {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ProfileResponse,
  UpdateProfileResponse,
  ChangePasswordResponse,
  VerifyEmailChangeData,
  VerifyEmailChangeResponse,
  mapGenderToString,
  GenderEnum,
  GenderString,
} from "@/models/user.types";

// Raw response type from backend (gender is numeric)
interface RawUserProfile {
  email: string;
  firstName: string;
  lastName: string;
  rut: string;
  gender: GenderEnum | GenderString;
  birthDate: string;
  phoneNumber?: string;
}

interface RawProfileResponse {
  message: string;
  data: RawUserProfile;
}

// Helper to transform backend response to frontend format
function transformUserProfile(raw: RawUserProfile): UserProfile {
  return {
    ...raw,
    gender: mapGenderToString(raw.gender as GenderEnum | GenderString),
  };
}

export const userService = {
  /**
   * Get the authenticated user's profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<RawProfileResponse>("/user/profile");
    return {
      message: data.message,
      data: transformUserProfile(data.data),
    };
  },

  /**
   * Update the user's profile
   * If email is included and different, a verification code will be sent
   */
  async updateProfile(profileData: UpdateProfileData): Promise<UpdateProfileResponse> {
    const { data } = await api.put<UpdateProfileResponse>("/user/profile", profileData);
    return data;
  },

  /**
   * Verify email change with the code sent to the new email
   */
  async verifyEmailChange(verifyData: VerifyEmailChangeData): Promise<VerifyEmailChangeResponse> {
    const { data } = await api.post<VerifyEmailChangeResponse>(
      "/user/verify-email-change",
      verifyData
    );
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
