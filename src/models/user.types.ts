// Enum values as they come from the backend (numeric)
export type GenderEnum = 0 | 1 | 2;

// String representation of gender
export type GenderString = "Masculino" | "Femenino" | "Otro";

// Map from numeric enum to string
export const genderMap: Record<GenderEnum, GenderString> = {
  0: "Masculino",
  1: "Femenino",
  2: "Otro",
};

// Map from string to numeric enum
export const genderToEnumMap: Record<GenderString, GenderEnum> = {
  Masculino: 0,
  Femenino: 1,
  Otro: 2,
};

// Helper function to convert gender from backend (number) to frontend (string)
export function mapGenderToString(gender: GenderEnum | GenderString): GenderString {
  if (typeof gender === "number") {
    return genderMap[gender] || "Otro";
  }
  return gender;
}

// Helper function to convert gender from frontend (string) to backend format
export function mapGenderToEnum(gender: GenderString): GenderEnum {
  return genderToEnumMap[gender];
}

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  rut: string;
  gender: GenderString;
  birthDate: string;
  phoneNumber?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  gender?: GenderString;
  birthDate?: string;
  phoneNumber?: string;
  email?: string;
  rut?: string;
}

export interface VerifyEmailChangeData {
  newEmail: string;
  code: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ProfileResponse {
  message: string;
  data: UserProfile;
}

export interface UpdateProfileResponse {
  message: string;
  data: string;
}

export interface VerifyEmailChangeResponse {
  message: string;
  data: string;
}

export interface ChangePasswordResponse {
  message: string;
  data: string;
}
