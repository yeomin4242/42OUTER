import { IAlarmProps } from "@/components/Alarm";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "alarm",
  storage: localStorage,
});

export const userAlarm = atom({
  key: "alarm",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userAlarmContent = atom({
  key: "alarmContent",
  default: <IAlarmProps[]>[],
});

export const userSocketLogin = atom({
  key: "socketLogin",
  default: <boolean>false,
});
