export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string | null;
  year: string | null;
  match_same_gender: boolean;
  location_preference: string[];
  time_preference: string[];
  day_preference: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  course_name: string;
  number_students: number;
  created_at: string;
  updated_at: string;
}

export interface UserClass {
  id: number;
  user_id: string;
  course_id: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  requester_id: string;
  receiver_id: string;
  course_id: number;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

export enum MatchStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Expired = 3,
}

export const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"] as const;
export const GENDERS = ["Male", "Female", "Other"] as const;
export const LOCATIONS = ["North Campus", "Central Campus"] as const;
export const TIMES = ["Morning", "Midday", "Night"] as const;
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
