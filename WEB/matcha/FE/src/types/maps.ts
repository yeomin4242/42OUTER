import {
  ageType,
  AlarmType,
  GenderType,
  InterestType,
  PreferenceType,
  RateType,
  SortType,
} from "@/types/tag.enum";

export const GenderLableMap = {
  [GenderType.MALE]: "남성",
  [GenderType.FEMALE]: "여성",
};

export const PreferenceLableMap = {
  [PreferenceType.BISEXUAL]: "양성애자",
  [PreferenceType.HETEROSEXUAL]: "이성애자",
  [PreferenceType.HOMOSEXUAL]: "동성애자",
  [PreferenceType.ASEXUAL]: "취향없음",
};

export const InterestLableMap = {
  [InterestType.ANIMALS]: "동물",
  [InterestType.ART]: "미술",
  [InterestType.BOOKS]: "책",
  [InterestType.FASHION]: "패션",
  [InterestType.FITNESS]: "피트니스",
  [InterestType.FOOD]: "음식",
  [InterestType.MOVIES]: "영화",
  [InterestType.SPORTS]: "스포츠",
  [InterestType.MUSIC]: "음악",
  [InterestType.GAME]: "게임",
  [InterestType.TRAVEL]: "여행",
  [InterestType.PHOTOGRAPHY]: "사진",
  [InterestType.NATURE]: "자연",
  [InterestType.SCIENCE]: "과학",
  [InterestType.TECHNOLOGY]: "기술",
  [InterestType.POLITICS]: "정치",
  [InterestType.HEALTH]: "건강",
  [InterestType.EDUCATION]: "교육",
  [InterestType.BUSINESS]: "사업",
  [InterestType.FINANCE]: "금융",
  [InterestType.MARKETING]: "마케팅",
  [InterestType.ENTREPRENEURSHIP]: "기업가정신",
  [InterestType.SOCIAL]: "사회",
  [InterestType.CHARITY]: "자선",
  [InterestType.VOLUNTEERING]: "자원봉사",
  [InterestType.RELIGION]: "종교",
  [InterestType.SPIRITUALITY]: "영성",
  [InterestType.FAMILY]: "가족",
  [InterestType.FRIENDS]: "친구",
  [InterestType.LOVE]: "사랑",
  [InterestType.RELATIONSHIPS]: "관계",
  [InterestType.DATING]: "데이트",
  [InterestType.MARRIAGE]: "결혼",
  [InterestType.RUNNING]: "달리기",
};

export const ageLableMap = {
  [ageType.TEENS_AND_BELOW]: "10대 이하",
  [ageType.TWENTIES]: "20대",
  [ageType.THIRTIES]: "30대",
  [ageType.FORTIES]: "40대",
  [ageType.FIFTIES]: "50대",
  [ageType.SIXTIES_AND_ABOVE]: "60대 이상",
};

export const AlarmLableMap = {
  [AlarmType.LIKED]: "You received a like from",
  [AlarmType.VISITED]: "Your profile was viewed by",
  [AlarmType.MESSAGED]: "New Message Received by",
  [AlarmType.MATCHED]: "Your Like Was Matched by",
  [AlarmType.DISLIKED]: "A Connection Removed Like ",
};

export const rateLableMap = {
  [RateType.ONE]: "1",
  [RateType.TWO]: "2",
  [RateType.THREE]: "3",
  [RateType.FOUR]: "4",
  [RateType.FIVE]: "5",
};

export const sortLableMap = {
  [SortType.ascAge]: "나이 오름차순",
  [SortType.descAge]: "나이 내림차순",
  [SortType.ascRate]: "평점 오름차순",
  [SortType.descRate]: "평점 내림차순",
};

export function mapGender(gender: string): GenderType {
  if (gender === "남성") {
    return GenderType.MALE;
  } else {
    return GenderType.FEMALE;
  }
}

export function mapPreference(preference: string): PreferenceType {
  if (preference === "양성애자") {
    return PreferenceType.BISEXUAL;
  } else if (preference === "이성애자") {
    return PreferenceType.HETEROSEXUAL;
  } else if (preference === "동성애자") {
    return PreferenceType.HOMOSEXUAL;
  } else {
    return PreferenceType.ASEXUAL;
  }
}

export function mapSort(sort: string): SortType {
  if (sort === "나이 오름차순") {
    return SortType.ascAge;
  } else if (sort === "나이 내림차순") {
    return SortType.descAge;
  } else if (sort === "평점 오름차순") {
    return SortType.ascRate;
  } else return SortType.descRate;
}