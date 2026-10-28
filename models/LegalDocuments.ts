import { type InferSchemaType, Schema, model } from 'mongoose'
import { countryCodes } from '../utils/countryCode.ts'


const legalDocumentsSchema = new Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ['privacyPolicy', 'terms'],
		},
		language: {
			type: String,
			required: true,
			enum: countryCodes,
			uppercase: true,
		},
		version: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 20,
		},
		content: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 1000000,
		},
		isActive: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { getters: true },
	},
)
export type LegalDocType = InferSchemaType<typeof legalDocumentsSchema>
const LegalDocuments = model('LegalDocument', legalDocumentsSchema)

export default LegalDocuments
