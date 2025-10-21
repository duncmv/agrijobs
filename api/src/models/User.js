const { Schema, model } = require('mongoose');

const ROLES = ['candidate', 'employer', 'admin'];

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    roles: {
      type: [
        {
          type: String,
          enum: ROLES,
        },
      ],
      default: ['candidate'],
      index: true,
    },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

module.exports = {
  User: model('User', UserSchema),
  UserSchema,
  ROLES,
};
