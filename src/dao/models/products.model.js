import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: String,
    default: 'admin',
  },
});
productsSchema.plugin(paginate);
export const productsModel = mongoose.model('products', productsSchema);
