const { Schema, model, Types } = require('mongoose');

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true, default: [0, 0] },
  },
  { _id: false }
);

const JobSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      default: 'full-time',
      index: true,
    },
    remote: { type: Boolean, default: false, index: true },
    employerOrg: { type: Types.ObjectId, ref: 'EmployerOrg', required: true, index: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    location: { type: GeoPointSchema, index: '2dsphere' },
    city: { type: String },
    region: { type: String, index: true },
    country: { type: String },
    skills: { type: [String], default: [], index: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['draft', 'open', 'closed'], default: 'open', index: true },
    applyUrl: { type: String },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ employerOrg: 1, status: 1, createdAt: -1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ location: '2dsphere' });

module.exports = {
  Job: model('Job', JobSchema),
  JobSchema,
};
