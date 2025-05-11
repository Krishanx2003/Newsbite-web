// src/types/profile.ts

/**
 * Base profile type that matches the database structure
 */
// src/types/profile.ts
export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  is_new?: boolean;  // Make this optional since it's not in the database
};

/**
 * Extended profile type that includes the API response specific fields
 */
export type ProfileResponse = Profile & {
  is_new: boolean;
};

/**
 * Type for the profile update payload
 */
export type ProfileUpdatePayload = {
  display_name: string;
};

/**
 * Type for the API response when updating a profile
 */
export type ProfileUpdateResponse = {
  message: string;
  error?: string;
};

/**
 * Type for the API error response
 */
export type ProfileErrorResponse = {
  error: string;
};

/**
 * Type guard to check if an object is a ProfileResponse
 */
export function isProfileResponse(obj: any): obj is ProfileResponse {
  return (
    obj &&
    typeof obj.id === 'string' &&
    (typeof obj.display_name === 'string' || obj.display_name === null) &&
    (typeof obj.avatar_url === 'string' || obj.avatar_url === null) &&
    (typeof obj.updated_at === 'string' || obj.updated_at === null) &&
    typeof obj.is_new === 'boolean'
  );
}

/**
 * Type guard to check if an object is a ProfileErrorResponse
 */
export function isProfileErrorResponse(obj: any): obj is ProfileErrorResponse {
  return obj && typeof obj.error === 'string';
}

/**
 * User metadata from Supabase auth
 */
export type UserMetadata = {
  avatar_url?: string;
  [key: string]: any;
};

/**
 * Type for the user object from Supabase auth
 */
export type AuthUser = {
  id: string;
  user_metadata?: UserMetadata;
};