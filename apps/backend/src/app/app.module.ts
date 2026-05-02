import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemaGeneratorModule } from './modules/schema-generator/schema-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SchemaGeneratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
