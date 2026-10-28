import { model, Schema } from 'mongoose'

const inventorySchema = new Schema(
	{
		variant: {
			type: Schema.Types.ObjectId,
			ref: 'ProductVariant',
			required: true,
		},

		quantityOnHand: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},

		quantityReserved: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},

		unit: {
			type: String,
			enum: ['g', 'ml', 'piece'],
			required: true,
		},
	},
	{ timestamps: true, toJSON: { getters: true } },
)

inventorySchema.index({ variant: 1 }, { unique: true })

export default model('Inventory', inventorySchema)
