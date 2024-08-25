import { tagItem } from "@/pages/LoginPage";
import {
  GenderLableMap,
  InterestLableMap,
  PreferenceLableMap,
  sortLableMap,
} from "./maps";
import { AgeTagItem } from "@/pages/SignupDetailPage";
import { LocationData } from "@/components/location/LocationData";

export const SortTagList: tagItem[] = Object.entries(sortLableMap).map(
  ([value, label]) => ({ value, label })
);

export const HashTagsList: tagItem[] = Object.entries(InterestLableMap).map(
  ([value, label]) => ({ value, label })
);

export const genderTagList: tagItem[] = Object.entries(GenderLableMap).map(
  ([value, label]) => ({ value, label })
);

export const preferenceTagList: tagItem[] = Object.entries(
  PreferenceLableMap
).map(([value, label]) => ({ value, label }));

export const locationSiTagList: tagItem[] = LocationData.map((area) => ({
  value: area.name,
  label: area.name,
}));

export const ageTagList: AgeTagItem[] = Array.from(
  { length: 81 },
  (_, index) => {
    const age = index + 20;
    return {
      value: age.toString(),
      label: `${age}세`,
    };
  }
);
