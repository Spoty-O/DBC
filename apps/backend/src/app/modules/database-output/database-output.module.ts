import { Module } from '@nestjs/common';
import { DatabaseOutputService } from './database-output.service';
import { DatabaseDescriptionService } from './services/database-description.service';
import { PrismaRendererService } from './services/prisma-renderer.service';
import { SqlDdlRendererService } from './services/sql-ddl-renderer.service';
import { TypeOrmRendererService } from './services/typeorm-renderer.service';

@Module({
  providers: [
    DatabaseOutputService,
    SqlDdlRendererService,
    TypeOrmRendererService,
    PrismaRendererService,
    DatabaseDescriptionService,
  ],
  exports: [DatabaseOutputService],
})
export class DatabaseOutputModule {}
