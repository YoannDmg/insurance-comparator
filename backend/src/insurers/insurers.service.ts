import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Insurer, InsurerDocument } from './schemas/insurer.schema';

@Injectable()
export class InsurersService {
  constructor(
    @InjectModel(Insurer.name) private insurerModel: Model<InsurerDocument>,
  ) {}

  async findAll() {
    const insurers = await this.insurerModel
      .find()
      .select('name brand plans')
      .lean();

    return insurers.map((insurer) => ({
      name: insurer.name,
      brand: insurer.brand,
      planCount: insurer.plans.length,
    }));
  }

  async findByName(name: string) {
    const insurer = await this.insurerModel
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
      .lean();

    if (!insurer) {
      throw new NotFoundException(`Insurer "${name}" not found`);
    }
    return insurer;
  }

  async getPlans(name: string) {
    const insurer = await this.findByName(name);
    return insurer.plans.map((plan) => ({
      level: plan.level,
      name: plan.name,
    }));
  }

  async getPlan(name: string, level: number) {
    const insurer = await this.findByName(name);
    const plan = insurer.plans.find((p) => p.level === level);

    if (!plan) {
      throw new NotFoundException(
        `Plan level ${level} not found for "${name}"`,
      );
    }
    return plan;
  }
}
