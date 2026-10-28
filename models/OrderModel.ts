import { model, Schema } from "mongoose"

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  variant: {
    type: Schema.Types.ObjectId,
    ref: 'ProductVariant',
  },
  sku: { type: String, required: true },
  name: {
    en: String,
    pl: String,
    de: String,
  },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0.001 },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false })

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  customer: {
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    phone: String,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: (v:any) => v.length > 0,
  },
  shippingAddress: {
    recipientName: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  subtotalInGrosze: { type: Number, required: true },
  shippingInGrosze: { type: Number, required: true, default: 0 },
  discountInGrosze: { type: Number, required: true, default: 0 },
  totalInGrosze: { type: Number, required: true },
  currency: { type: String, default: 'PLN' },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ],
    default: 'pending',
  },
}, { timestamps: true, toJSON:{getters:true} })

export default model('Order', orderSchema)