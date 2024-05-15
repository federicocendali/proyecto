import mongoose from 'mongoose';

const collection = 'messages';

const messageSchema = new mongoose.Schema(
  {
    user: String,
    message: String,
  },
  { timestamps: true }
);
const messageModel = mongoose.model(collection, messageSchema);

export default messageModel;
