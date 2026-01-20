import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InsurersController } from './insurers.controller';
import { InsurersService } from './insurers.service';
import { Insurer, InsurerSchema } from './schemas/insurer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Insurer.name, schema: InsurerSchema }]),
  ],
  controllers: [InsurersController],
  providers: [InsurersService],
  exports: [InsurersService, MongooseModule],
})
export class InsurersModule {}
