import { SettingDto, SignupDto } from "@/types/tag.dto";
import axios, { AxiosRequestConfig } from "axios";
import { getCookie } from "./cookie";

const instance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
  // 이미지 용량
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

instance.interceptors.request.use(async (config: any) => {
  const token = getCookie("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});
instance.defaults.maxRedirects = 5;

/**
 * AI 챗봇
 */
interface ClaudeResponse {
  reply: string;
}
const axiosClaudeURL = "/claude";
export const sendMessageToClaude = async (message: string): Promise<string> => {
  try {
    const response = await instance.post<ClaudeResponse>(axiosClaudeURL, {
      message,
    });
    return response.data.reply;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

/**
 * 일반 로그인
 */
const axiosUserLoginURL = "/auth/login";
export const axiosUserLogin = async (
  username: string,
  password: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosUserLoginURL, {
      username: username,
      password: password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * jst access check -> 웹소켓 연결만 하는 라우터 이용시 jwt체크용
 */
const axiosCheckJWTURL = "/auth/check/access";
export const axiosCheckJWT = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosCheckJWTURL);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * OAUTH 로그인
 */
const axiosLoginOauthURL = "/auth/callback";
export const axiosLoginOauth = async (code: string): Promise<any> => {
  try {
    const response = await instance.post(axiosLoginOauthURL, { code: code });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 로그아웃
 */
const axiosLogoutURL = "/auth/logout";
export const axiosLogout = async (): Promise<any> => {
  try {
    const response = await instance.delete(axiosLogoutURL);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 회원가입
 */
const axiosRegisterURL = "/auth/register";
export const axiosRegister = async (
  eamil: string,
  password: string,
  confirmedPassword: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosRegisterURL, {
      email: eamil,
      password: password,
      confirmedPassword: confirmedPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUserCreateURL = "/user/create/";
export const axiosUserCreate = async (data: SignupDto): Promise<any> => {
  try {
    const response = await instance.post(axiosUserCreateURL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 회원가입시 이메일 인증
const axiosEmailSendURL = "/auth/register/email/send";
export const axiosEmailSend = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosEmailSendURL);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 비밀번호 찾기 요청
 */
const axiosResetCreateURL = "/auth/reset/email/create";
export const axiosResetCreate = async (email: string): Promise<any> => {
  try {
    const response = await instance.post(axiosResetCreateURL, { email: email });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosChangePasswordURL = "/user/change/password";
export const axiosChangePassword = async (
  password: string,
  confirmedPassword: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosChangePasswordURL, {
      password: password,
      confirmedPassword: confirmedPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * twofactor 인증 과정
 */
const axiosVerifyTwoFactorURL = "/auth/twofactor/verify";
export const axiosVerifyTwoFactor = async (code: string): Promise<any> => {
  try {
    const response = await instance.post(axiosVerifyTwoFactorURL, {
      code: code,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCreateTwoFactorURL = "/auth/twofactor/create";
export const axiosCreateTwoFactor = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosCreateTwoFactorURL);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Search 쿼리 검색
 */
const axiosFindUserURL = "/user/find";
export const axiosFindUser = async (
  si?: string | undefined,
  gu?: string | undefined,
  minAge?: number,
  maxAge?: number,
  minRate?: number,
  maxRate?: number,
  hashtags?: string[],
  page?: number,
  sort?: string
): Promise<any> => {
  try {
    const params: Record<string, string> = {};
    if (minAge !== undefined) params.minAge = minAge.toString();
    if (maxAge !== undefined) params.maxAge = maxAge.toString();
    if (minRate !== undefined) params.minRate = minRate.toString();
    if (maxRate !== undefined) params.maxRate = maxRate.toString();
    if (si) params.si = si;
    if (gu) params.gu = gu;
    if (page) params.page = page.toString();
    if (sort) params.sortInfo = sort;

    // hashtags 처리: undefined나 빈 배열일 경우 빈 문자열 할당
    if (hashtags)
      params.hashtags =
        hashtags && hashtags.length > 0 ? hashtags.join(",") : "";

    const queryString = new URLSearchParams(params).toString();
    const url = queryString
      ? `${axiosFindUserURL}?${queryString}`
      : axiosFindUserURL;

    const response = await instance.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * PROFILE 유저 페이지
 */
const axiosProfileMeURL = "/user/profile/me";
export const axiosProfileMe = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosProfileMeURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosProfileURL = "/user/profile";
export const axiosProfile = async (username: string): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosProfileURL}?username=${username}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUserBlockURL = "/user/block";
export const axiosUserBlock = async (username: string): Promise<any> => {
  try {
    const response = await instance.post(`${axiosUserBlockURL}`, {
      blockUsername: username,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUserRateURL = "/user/rate";
export const axiosUserRate = async (
  rate: number,
  username: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosUserRateURL, {
      rateScore: rate,
      ratedUsername: username,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUserReportURL = "/user/report";
export const axiosUserReport = async (
  reportedUsername: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosUserReportURL, {
      reportedUsername: reportedUsername,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Setting 페이지
 */
const axiosSettingCreateURL = "/user/profile/settings";
export const axiosSettingCreate = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosSettingCreateURL);
    // "Content-Type": "multipart/form-data", // 이미지 업로드를 위해 변경
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSettingModifyURL = "/user/profile/update";
export const axiosSettingModify = async (data: SettingDto): Promise<any> => {
  try {
    const response = await instance.post(axiosSettingModifyURL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 웹소켓인지 확인하기 -> 아직 안정해짐
 */
