import cloudinary from '../config/cloudinaryConfig.ts'

const cloudinaryInitials = async (firstName: string, lastName: string): Promise<string> => {
	const initials = `${firstName.charAt(0)}${lastName.charAt(0)}` || 'NN'

	const imageUrl = cloudinary.url('placeholder.png', {
		transformation: [
			{
				width: 40,
				height: 40,
				crop: 'fill',
				radius: 'max',
				effect: 'colorize:100',
				color: '#27611e',
			},
			{
				overlay: {
					font_family: 'Georgia',
					font_size: 14,
					font_weight: 'bold',
					text: initials,
				},
				color: '#ffffff',
				gravity: 'center',
			},
		],
	})

	return imageUrl
}

export default cloudinaryInitials
