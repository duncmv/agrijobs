const { Schema, model, Types } = require('mongoose');

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true, default: [0, 0] },
  },
  { _id: false }
);

const ProfileSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    headline: { type: String, trim: true },
    summary: { type: String, trim: true },
    skills: { type: [String], index: true, default: [] },
    location: { type: GeoPointSchema, index: '2dsphere', required: false },
    city: { type: String, trim: true },
    region: { type: String, trim: true, index: true },
    country: { type: String, trim: true },
    links: {
      website: { type: String, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ProfileSchema.index({ skills: 1 });
ProfileSchema.index({ region: 1 });
ProfileSchema.index({ location: '2dsphere' });

module.exports = {
  Profile: model('Profile', ProfileSchema),
  ProfileSchema,
};
