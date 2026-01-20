import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InsurersService } from './insurers.service';

@Controller('insurers')
export class InsurersController {
  constructor(private readonly insurersService: InsurersService) {}

  @Get()
  findAll() {
    return this.insurersService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.insurersService.findByName(name);
  }

  @Get(':name/plans')
  getPlans(@Param('name') name: string) {
    return this.insurersService.getPlans(name);
  }

  @Get(':name/plans/:level')
  getPlan(
    @Param('name') name: string,
    @Param('level', ParseIntPipe) level: number,
  ) {
    return this.insurersService.getPlan(name, level);
  }
}
