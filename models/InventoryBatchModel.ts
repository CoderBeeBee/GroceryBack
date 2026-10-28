import { model, Schema } from 'mongoose'

const inventoryBatchSchema = new Schema(
	{
		// variant: {
		// 	type: Schema.Types.ObjectId,
		// 	ref: 'ProductVariant',
		// 	required: true,
		// 	index: true,
		// },
		inventory: {
			type: Schema.Types.ObjectId,
			ref: 'Inventory',
			required: true,
			index: true,
		},
		supplier: {
			type: Schema.Types.ObjectId,
			ref: 'Supplier',
		},
		batchNumber: { type: String, required: true, trim: true },
		quantityReceived: { type: Number, required: true, min: 0 },
		quantityAvailable: { type: Number, required: true, min: 0 },

		unit: {
			type: String,
			required: true,
		},
		receivedAt: { type: Date, required: true },
		bestBeforeAt: Date,
		expiresAt: Date,
		harvestAt: Date,
		status: {
			type: String,
			enum: ['available', 'depleted', 'expired', 'blocked'],
			default: 'available',
		},
	},
	{ timestamps: true, toJSON: { getters: true } },
)

inventoryBatchSchema.index({
	status: 1,
	expiryDate: 1,
})

export default model('InventoryBatch', inventoryBatchSchema)
