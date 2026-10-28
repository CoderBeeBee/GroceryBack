import { model, Schema } from 'mongoose'

const inventoryMovementSchema = new Schema(
	{
		batch: {
			type: Schema.Types.ObjectId,
			ref: 'InventoryBatch',
			required: true,
			index: true,
		},

		type: {
			type: String,
			enum: ['receipt', 'sale', 'reservation', 'release', 'waste', 'adjustment', 'return'],
			required: true,
		},

		// Dodatnia ilość operacji w jednostce partii.
		quantity: {
			type: Number,
			required: true,
			min: Number.MIN_VALUE,
		},

		unit: {
			type: String,
			enum: ['kg', 'g', 'piece', 'liter'],
			required: true,
		},

		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Order',
		},

		reason: String,

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
)

inventoryMovementSchema.index({
	batch: 1,
	createdAt: -1,
})

export default model('InventoryMovement', inventoryMovementSchema)
