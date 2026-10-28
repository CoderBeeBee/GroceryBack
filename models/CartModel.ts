import { model, Schema } from "mongoose"

const cartSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		sessionId: String,
		items: [
			{
				variant: {
					type: Schema.Types.ObjectId,
					ref: 'ProductVariant',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 0.001,
				},
			},
		],
        
		expiresAt: Date,
	},
	{ timestamps: true },
)

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default model('Cart', cartSchema)
