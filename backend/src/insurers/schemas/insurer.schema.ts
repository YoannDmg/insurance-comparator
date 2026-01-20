import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type {
  Category,
  NormalizedKey,
  Reimbursement,
} from '../../domain/types';

export type InsurerDocument = HydratedDocument<Insurer>;

// Nested schema for guarantees
@Schema({ _id: false })
export class Guarantee {
  @Prop({ required: true, type: String })
  category: Category;

  @Prop({ required: true, type: String })
  key: NormalizedKey;

  @Prop({ required: true })
  label: string;

  @Prop({ type: Object, required: true })
  reimbursement: Reimbursement;

  @Prop()
  limit?: string;

  @Prop()
  details?: string;
}

export const GuaranteeSchema = SchemaFactory.createForClass(Guarantee);

// Nested schema for plans
@Schema({ _id: false })
export class Plan {
  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [GuaranteeSchema], default: [] })
  guarantees: Guarantee[];
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

// Main schema
@Schema({ collection: 'insurers' })
export class Insurer {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ type: [PlanSchema], default: [] })
  plans: Plan[];
}

export const InsurerSchema = SchemaFactory.createForClass(Insurer);

// Indexes for frequent queries
InsurerSchema.index({ name: 1 });
InsurerSchema.index({ 'plans.level': 1 });
InsurerSchema.index({ 'plans.guarantees.category': 1 });
InsurerSchema.index({ 'plans.guarantees.key': 1 });
