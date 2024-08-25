import { GenderType, InterestType, PreferenceType } from "@/types/tag.enum";

// username 검사 함수
export function validateUsername(username: string) {
  
  const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
  return usernameRegex.test(username);
}

// password 검사 함수
export function validatePassword(password: string) {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#.])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

// password Check 검사 함수
export function validateCheckPassword(password: string, checkPW?: string) {
  return password === checkPW;
}

// lastName, firstName 검사 함수
export function validateName(name: string) {
  const nameRegex = /^[a-zA-Z]{1,10}$/;
  return nameRegex.test(name);
}

// biography 검사 함수
export function validateBiography(biography: string) {
  const biographyRegex =
    /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.\/?' ']{1,100}$/;
  return biographyRegex.test(biography);
}

// age 검사 함수
export function validateAge(age: string) {
  const ageRegex = /^[0-9]{1,3}$/;
  return ageRegex.test(age);
}

// gender 검사 함수
export function validateGender(gender: GenderType | undefined): boolean {
  if (gender === undefined) {
    return false;
  }
  return gender === GenderType.MALE || gender === GenderType.FEMALE;
}

// preference 검사 함수
export function validatePreference(
  preference: PreferenceType | undefined
): boolean {
  if (preference === undefined) {
    return false;
  }
  return (
    preference === PreferenceType.BISEXUAL ||
    preference === PreferenceType.HETEROSEXUAL ||
    preference === PreferenceType.HOMOSEXUAL ||
    preference === PreferenceType.ASEXUAL
  );
}

// hashtags 검사 함수
export function validateHashtags(hashtags: InterestType[] | undefined) {
  if (hashtags === undefined) {
    return false;
  }
  const validInterestTypes = Object.values(InterestType);

  for (let hashtag of hashtags) {
    if (!validInterestTypes.includes(hashtag)) {
      return false;
    }
  }
  return true;
}

export function validateEmail(email: string) {
  // 이메일 형식 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 정규식을 이용하여 이메일 형식 검증
  return emailRegex.test(email);
}

export function convertToUpperCase(arr: any) {
  return arr.map((item: string) => item.toUpperCase());
}

export function convertToLowerCase(arr: any) {
  return arr.map((item: string) => item.toLowerCase());
}

export function validateMessage(message: string) {
  const messageRegex =
    /^[a-zA-Z0-9!@\s#$%^&*()_+\-=\[\]{}:"\\|,.\/?|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{1,255}$/;
  return messageRegex.test(message);
}

export const useInputValidation = (
  type: string,
  value: string,
  checkPW?: string
): string | null => {
  switch (type) {
    case "username":
      if (value === "Chatgpt") {
        return "Chatgpt는 사용할 수 없는 유저네임입니다.";
      }
      return !validateUsername(value) ? "유저네임은 4-15자여야 합니다." : null;
    case "password":
      return !validatePassword(value)
        ? "비밀번호는 최소 8글자이며, 알파벳, 숫자, 특수문자 '!@#.'를 포함해야 합니다."
        : null;
    case "firstname":
    case "lastname":
      return !validateName(value) ? "이름은 알파벳 1~10글자여야 합니다." : null;
    case "checkPassword":
      return !validateCheckPassword(value, checkPW)
        ? "비밀번호가 일치하지 않습니다."
        : null;
    case "bio":
      return !validateBiography(value)
        ? "약력은 알파벳 1-100자여야 합니다."
        : null;
    case "email":
      return !validateEmail(value) ? "올바른 이메일 주소가 아닙니다." : null;
    default:
      return null;
  }
};
export default useInputValidation;
