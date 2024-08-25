import { GenderType, InterestType, PreferenceType } from "./tag.enum";

export interface ProfileDto {
  username: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  preference: PreferenceType;
  age: number;
  biography: string;
  hashtags: InterestType[];
  si: string;
  gu: string;
  rate: number;
  profileImages: string[];

  // 내 프로필이 아닌 상대방 프로필일 경우
  connectedAt?: Date;
  isBlocked: boolean;
  isSendedLiked: boolean;
  isReceivedLiked: boolean;
  isOnline: boolean;
}

export interface SettingDto {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  preference: string;
  age: number;
  biography: string;

  hashtags: string[];
  si: string;
  gu: string;

  profileImages: string[];

  isGpsAllowed: boolean;
  isTwofa: boolean;
  email: string;
}

export interface SignupDto {
  username: string;
  lastName: string;
  firstName: string;
  gender: string;
  preference: string;
  biography: string;
  age: number;
  isGpsAllowed: boolean;
  hashtags: string[];
  si: string;
  gu: string;
  profileImages: string[];
}
