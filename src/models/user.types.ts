export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  rut: string;
  gender: "Masculino" | "Femenino" | "Otro";
  birthDate: string;
  phoneNumber?: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  gender: "Masculino" | "Femenino" | "Otro";
  birthDate: string;
  phoneNumber?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ProfileResponse {
  message: string;
  data: UserProfile;
}

export interface UpdateProfileResponse {
  message: string;
  data: UserProfile;
}

export interface ChangePasswordResponse {
  message: string;
  data: string;
}
