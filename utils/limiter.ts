import rateLimit from 'express-rate-limit'

const verifyLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message:  'Too many verification attempts. Please try again later' ,
})
const registerLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	message: 'registrationLimiter',
})
const signInLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: { error: 'Too many sign in attempts. Please try again later' },
})
const changePasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: { error: 'Too many attempts. Please try again later' },
})
const contactFormLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: { error: 'Too many registration attempts. Please try again later' },
})

const subscriptionLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: { error: 'Too many attempts. Please try again later' },
})
export { verifyLimiter,signInLimiter, registerLimiter, contactFormLimiter, subscriptionLimiter, changePasswordLimiter }
