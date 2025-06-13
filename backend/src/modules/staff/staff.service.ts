// import { Inject, Injectable } from '@nestjs/common';

// import { cacheConsts } from '../../shared/constants/cache.const';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';

// import { ErrorService } from '../error/error.service';
// import { StaffResponseModel } from '../../shared/entities/staff.model';
// import { CreateDto } from './dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { IStaff } from '../../shared/interfaces';

// @Injectable()
// export class StaffService {
//   constructor(
//     private readonly errorService: ErrorService,
//     @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
//     @InjectModel('Staff') private staffModel: Model<IStaff>,
//   ) {}

//   //#region Staff

//   public async getAll(): Promise<StaffResponseModel[]> {
//     const staff = await this.cacheService.get<StaffResponseModel[]>(
//       cacheConsts.allStaff,
//     );
//     if (staff) {
//       return staff;
//     } else {
//       const staffMongo = await this.staffModel.find();
//       if (!staffMongo || staffMongo.length === 0) {
//         throw await this.errorService.notFound([
//           { key: 'errors.staffNotFound' },
//         ]);
//       }
//       const refactoredStaff = staffMongo.map((staff) => {
//         return new StaffResponseModel(staff);
//       });
//       await this.cacheService.set(cacheConsts.allStaff, refactoredStaff);
//       return refactoredStaff;
//     }
//   }

//   public async getById(id: string): Promise<StaffResponseModel> {
//     const staff = await this.cacheService.get<StaffResponseModel>(
//       cacheConsts.staffById + id,
//     );
//     if (staff) {
//       return staff;
//     } else {
//       const staffMongo = await this.staffModel.findById(id);
//       if (!staffMongo) {
//         throw await this.errorService.notFound([
//           { key: 'errors.staffNotFound' },
//         ]);
//       }
//       const refactoredStaff = new StaffResponseModel(staffMongo);
//       await this.cacheService.set(cacheConsts.staffById + id, refactoredStaff);
//       return refactoredStaff;
//     }
//   }

//   public async create(body: CreateDto): Promise<StaffResponseModel> {
//     const staffMongo = new this.staffModel(body);
//     const staff = await staffMongo.save();
//     await this.cacheService.del(cacheConsts.allStaff);
//     return new StaffResponseModel(staff);
//   }

//   public async update(
//     id: string,
//     body: CreateDto,
//   ): Promise<StaffResponseModel> {
//     const staffMongo = await this.staffModel.findById(id);
//     if (!staffMongo) {
//       throw await this.errorService.notFound([{ key: 'errors.staffNotFound' }]);
//     }
//     staffMongo.set(body);
//     const staff = await staffMongo.save();
//     await this.cacheService.del(cacheConsts.allStaff);
//     await this.cacheService.del(cacheConsts.staffById + id);
//     return new StaffResponseModel(staff);
//   }

//   public async delete(id: string): Promise<StaffResponseModel> {
//     const staffMongo = await this.staffModel.findById(id);
//     if (!staffMongo) {
//       throw await this.errorService.notFound([{ key: 'errors.staffNotFound' }]);
//     }
//     await staffMongo.deleteOne({ _id: id });
//     await this.cacheService.del(cacheConsts.allStaff);
//     await this.cacheService.del(cacheConsts.staffById + id);
//     return new StaffResponseModel(staffMongo);
//   }

//   //#endregion Staff
// }
