import { GenderType, InterestType, PreferenceType } from "./tag.enum";

export interface SignupDto {
  email: string;
  username: string;
  password: string;
  lastName: string;
  firstName: string;
  gender: GenderType;
  preference: PreferenceType;
  biography: string;
  age: number;
  isGpsAllowed: boolean;
  hashtags: InterestType[];
  si: string;
  gu: string;
  profileImages: string[];
}

export interface settingUserDto {
  // User Profile
  firstName: string;
  lastName: string;
  password: string;

  //   User Photos
  profileImages: string[];

  //   UserToggle
  isGpsAllowed: boolean;
  isTwoFactor: boolean;

  //   UserDetail
  username: string;
  gender: GenderType;
  preference: PreferenceType;
  biography: string;
  age: number;
  hashtags: InterestType[];
  si: string;
  gu: string;
}
