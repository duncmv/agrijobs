const { Schema, model, Types } = require('mongoose');

const ApplicationSchema = new Schema(
  {
    job: { type: Types.ObjectId, ref: 'Job', required: true, index: true },
    applicantUser: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    profile: { type: Types.ObjectId, ref: 'Profile', required: false },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    status: {
      type: String,
      enum: ['submitted', 'review', 'interview', 'offer', 'rejected', 'hired'],
      default: 'submitted',
      index: true,
    },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ApplicationSchema.index({ job: 1, applicantUser: 1 }, { unique: true });
ApplicationSchema.index({ createdAt: -1 });

module.exports = {
  Application: model('Application', ApplicationSchema),
  ApplicationSchema,
};
