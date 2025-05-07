import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { TStaff } from "../common/types";

interface IStaffState {
  staff: TStaff[];
  setStaff: (value: TStaff[]) => void;
}

export const useStaffStore = createWithEqualityFn<IStaffState>((set) => {
  return {
    staff: [],
    setStaff: (value: TStaff[]): void => {
      set(() => {
        return {
          staff: value,
        };
      });
    },
  };
}, shallow);
