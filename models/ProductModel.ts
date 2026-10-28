import { model, Schema } from 'mongoose'

const localizedSchema = new Schema(
	{
		en: { type: String, trim: true },
		pl: { type: String, trim: true },
		de: { type: String, trim: true },
	},
	{ _id: false },
)

const productSchema = new Schema(
	{
		name: {
			type: localizedSchema,
			required: true,
		},

		sku: {
			type: String,
			required: [true, 'SKU is required'],
			unique: true,
			trim: true,
			uppercase: true,
		},

		slug: {
			type: localizedSchema,
			required: true,
		},
		productType:{
			type:String,
			enum:['fresh','procceded'],
			required:true
		},
		description: {
			type: localizedSchema,
			default: () => ({}),
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		images: [
			{
				url: { type: String, required: true },
				alt: localizedSchema,
				isPrimary: { type: Boolean, default: false },
			},
		],
		status: {
			type: String,
			enum: ['draft', 'active', 'inactive', 'archived'],
			default: 'draft',
		},
	},
	{
		timestamps: true,
		toJSON: { getters: true },
	},
)

productSchema.index({ name: 1, sku: 1 })

export default model('Product', productSchema)
