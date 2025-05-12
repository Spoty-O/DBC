import { IStaff } from '../interfaces';

export class StaffResponseModel {
  public id: string;
  public name: string;

  constructor(staff: IStaff) {
    const staffObj = staff.toObject();
    this.id = staffObj._id;
    this.name = staffObj.name;
  }
}
