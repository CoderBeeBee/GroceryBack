import { model } from 'mongoose'
import { Schema } from 'mongoose'

const priceSchema = new Schema(
	{
		amount: {
			type: Number,
			required: true,
			min: 0,
			validate: Number.isSafeInteger,
		},
		currency: {
			type: String,
			enum: ['PLN', 'EUR', 'GBP'],
			default: 'EUR',
			required: true,
		},
	},
	{
		_id: false,
	},
)

const productVariantSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
			index: true,
		},
		sku: {
			type: String,
			required: [true, 'SKU is required'],
			unique: true,
			uppercase: true,
			trim: true,
		},
		barcode: {
			type: String,
			trim: true,
			sparse: true,
		},
		label: {
			en: { type: String, trim: true },
			pl: { type: String, trim: true },
			de: { type: String, trim: true },
		},
		salesUnit: {
			type: String,
			enum: ['kg', 'g', 'piece', 'liter', 'pack', 'box'],
			required: true,
		},
		salesQuantity: {
			type: Number,
			min: 0.5,
			default: 0.5,
		},
		prices: {
			pl: priceSchema,
			en: priceSchema,
			de: priceSchema,
		},

		status: {
			type: String,
			enum: ['available', 'expired', 'blocked'],
			default: 'available',
		},
	},
	{ timestamps: true, toJSON: { getters: true } },
)

export default model('ProductVariant', productVariantSchema)
