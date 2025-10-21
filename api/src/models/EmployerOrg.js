const { Schema, model, Types } = require('mongoose');

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true, default: [0, 0] },
  },
  { _id: false }
);

const TestimonialSchema = new Schema(
  {
    authorName: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true, _id: true }
);

const EmployerOrgSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    website: { type: String },
    industry: { type: String, index: true },
    size: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'], index: true },
    description: { type: String },
    headquarters: { type: GeoPointSchema, index: '2dsphere' },
    regions: { type: [String], index: true, default: [] },
    ownerUser: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    hrManagerUsers: [{ type: Types.ObjectId, ref: 'User', index: true }],
    testimonials: { type: [TestimonialSchema], default: [] },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

EmployerOrgSchema.index({ name: 1 }, { unique: true });
EmployerOrgSchema.index({ slug: 1 }, { unique: true });
EmployerOrgSchema.index({ headquarters: '2dsphere' });
EmployerOrgSchema.index({ regions: 1 });

module.exports = {
  EmployerOrg: model('EmployerOrg', EmployerOrgSchema),
  EmployerOrgSchema,
};
