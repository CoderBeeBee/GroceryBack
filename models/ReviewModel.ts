import mongoose from 'mongoose'

const { Schema, model } = mongoose

const reviewSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
            required:true
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
            required:true
		},
        description:{
            type:String,
            required:true
        },
        ratting:{
            type:Number,
            required:true,
            min:1,
            max:5,

        }
	},
	{
		timestamps: true,
		toJSON: {
			getters: true,
		},
	},
)

export default model('Review',reviewSchema)