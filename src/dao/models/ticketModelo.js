import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchase_dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
    products: [],
  },
  {
    timestamps: true,
  }
);

export const ticketModel = mongoose.model('Tickets', ticketSchema);
