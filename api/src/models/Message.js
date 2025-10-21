const { Schema, model, Types } = require('mongoose');

const MessageSchema = new Schema(
  {
    fromUser: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    toUser: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    employerOrg: { type: Types.ObjectId, ref: 'EmployerOrg', required: false, index: true },
    job: { type: Types.ObjectId, ref: 'Job', required: false, index: true },
    application: { type: Types.ObjectId, ref: 'Application', required: false, index: true },
    body: { type: String, required: true },
    readAt: { type: Date },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

MessageSchema.index({ fromUser: 1, toUser: 1, createdAt: -1 });

module.exports = {
  Message: model('Message', MessageSchema),
  MessageSchema,
};
