import { BACKEND_KEYS } from "../common/consts";
import { TStaff } from "../common/types";
import { HttpSerivce } from "./http.service";

class StaffService extends HttpSerivce {
  constructor() {
    super();
  }

  async getAll() {
    const response = await this.get({
      url: BACKEND_KEYS.STAFF.STAFF,
    });
    return response.data.recipes as TStaff[];
  }
}

export const staffService = new StaffService();
