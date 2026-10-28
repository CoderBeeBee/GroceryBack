import { type InferSchemaType, model, Schema } from 'mongoose'
import { countryCodes } from '../utils/countryCode.ts'
import { hash } from 'argon2'

const addressSchema = new Schema(
	{
		label: {
			type: String,
			trim: true,
			maxlength: 50,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
		recipientName: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 200,
		},
		city: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 100,
		},
		street: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 200,
		},
		buildingNumber: {
			type: String,
			required:true,
			trim:true,
			minLength: 1,
			maxLength: 20,
		},
		apartamentNumber:{
			type:String,
			trim:true,
			maxlength:20
		},
		postalCode: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 20,
		},
		countryCode: {
			type: String,
			required: true,
			uppercase: true,
			enum: countryCodes,
		},
		phone: {
			type: String,
			trim: true,
			maxlength: 32,
		},
	},
	{ _id: true },
)

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			minlength: 6,
			maxlength: 254,
		},
		password: {
			type: String,
			required: true,
			select: false,
			minlength: 8,
			maxlength: 128,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 100,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 100,
		},
		image: {
			src: {
				type: String,
			},
			public_id: {
				type: String,
				default: '',
			},
		},
		country: {
			type: String,
			minlength: 3,
			maxlength: 254,
		},
		phone: {
			type: String,
			maxlength: 32,
		},
		role: {
			type: String,
			enum: ['customer', 'admin', 'superadmin'],
			default: 'customer',
		},
		addresses: [addressSchema],
		lastLogin: {
			type: Date,
			default: null,
		},
		lastLogout: {
			type: Date,
			default: null,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verifiedAt: {
			type: Date,
			default: null,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'deleted'],
			default: null,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		consents: {
			privacyPolicy: {
				
				documentId: {
					type: Schema.Types.ObjectId,
					ref: 'LegalDocuments',
					required: true,
				},
				acceptedAt: {
					type: Date,
					required: true,
				},
			},
			terms: {
				
				documentId: {
					type: Schema.Types.ObjectId,
					ref: 'LegalDocuments',
					required: true,
				},
				acceptedAt: {
					type: Date,
					required: true,
				},
			},
		},
	},
	{ timestamps: true, toJSON: { getters: true } },
)

userSchema.index(
	{ createdAt: 1 },
	{ expireAfterSeconds: 60 * 60 * 24 * 7, partialFilterExpression: { isVerified: false } },
)

userSchema.index(
	{ deletedAt: 1 },
	{
		expireAfterSeconds: 60 * 60 * 24 * 30,
		partialFilterExpression: { status: 'deleted' },
	},
)

userSchema.pre('save', async function () {
	if (!this.isModified('password')) return

	this.password = await hash(this.password)
})

export type UserType = InferSchemaType<typeof userSchema>
const User = model('User', userSchema)

export default User
