import * as yup from 'yup'

// Login validation
export const usernameSchema = yup
	.string()
	.trim()
	.required('This field is required')
	.min(5, 'Login must be at least 5 characters long')
	.max(30, 'Login must not exceed 30 characters')
	.matches(/^\S*$/, 'You cannot leave a space in the login')
	.matches(/^[a-zA-Z0-9_]+$/, 'The login can only contain letters, numbers, and underscores')
	.matches(/^(?!\d)[a-zA-Z0-9_]+$/, 'Login cannot start with a number')
	.matches(/^(?!_)[a-zA-Z0-9_]+(?<!_)$/, 'Login cannot begin or end with an underscore')
	.matches(/^(?!.*_{2})/, 'It is not possible to type consecutive underscores in a login')

// Password validation
export const passwordSchema = yup
	.string()
	.trim()
	.required('This field is required')
	.min(8, 'Password must be at least 8 characters long')
	.max(30, 'Password must not exceed 30 characters')
	.matches(/^\S*$/, 'You cannot leave a space in the password')
	.matches(/^[a-zA-Z0-9!@#$%^&*()]+$/, 'Password can only contain letters, numbers, and special characters (!@#$%^&*)')

// Confirm password validation
export const confirmPasswordSchema = yup
	.string()
	.trim()
	.oneOf([yup.ref('password'), undefined], 'Passwords did not match')
	.required('This field is required')

// Date
export const date = yup
	.string()
	.required('This field is required')
	.length(10, 'The information entered is invalid')
	.transform((value) => {
		if (!value) return value
		const [day, month, year] = value.split('.')
		return `${year}-${month}-${day}`
	})
	.test('isValidDate', 'The information entered is invalid', (value) => {
		if (!value) return false
		const [year, month, day] = value.split('-').map(Number)
		const date = new Date(year, month - 1, day)
		return (
			date.getFullYear() === year &&
			date.getMonth() === month - 1 &&
			date.getDate() === day
		)
	})

export const isNotFutureDate = date.test('isNotFutureDate', 'Date must be less than today', (value) => {
	if (!value) return false
	const [year, month, day] = value.split('-').map(Number)
	const inputDate = new Date(year, month - 1, day)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return inputDate <= today
})


// PRODUCTS
const productSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	is_serial: yup.boolean().default(false).optional().nullable().transform(value => value ? value : false),
	type: yup.number().optional().nullable().transform(value => value ? value : null),
	// package: yup.number().nullable(),
	country: yup.number().optional().nullable().transform(value => value ? value : null),
	expiry: yup.boolean().default(false).optional().nullable().transform(value => value ? value : false),
	barcodes: yup
		.array()
		.optional()
		.nullable()
		.of(yup.string().trim().required('This field is required'))
		.transform(value => value ? value : null),
	brand: yup.number().optional().nullable().transform(value => value ? value : null),
	measure: yup.string().trim().required('This field is required')
})


export {
	productSchema
}