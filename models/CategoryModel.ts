import { model, Schema } from "mongoose"


const categorySchema = new Schema(
	{
		name: {
			en: { type: String, required: true },
			pl: { type: String, required: true },
			de: String,
		},
		slug: {
			en: { type: String, required: true },
			pl: { type: String, required: true },
			de: String,
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			default: null,
		},
		image: String,
		active: { type: Boolean, default: true },
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true, toJSON: { getters: true } },
)

categorySchema.index({ parent: 1, active: 1 })

export default model('Category', categorySchema)
