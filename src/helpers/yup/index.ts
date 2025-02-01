import * as yup from 'yup'

// Login validation
const usernameSchema = yup
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
const passwordSchema = yup
	.string()
	.trim()
	.required('This field is required')
	.min(8, 'Password must be at least 8 characters long')
	.max(30, 'Password must not exceed 30 characters')
	.matches(/^\S*$/, 'You cannot leave a space in the password')
	.matches(/^[a-zA-Z0-9!@#$%^&*()]+$/, 'Password can only contain letters, numbers, and special characters (!@#$%^&*)')

// Confirm password validation
const confirmPasswordSchema = yup
	.string()
	.trim()
	.oneOf([yup.ref('password'), undefined], 'Passwords did not match')
	.required('This field is required')

// Export schemas
// export { usernameSchema, passwordSchema, confirmPasswordSchema };


// AUTHENTICATION
const loginSchema = yup.object().shape({
	username: yup
		.string()
		.trim()
		.required('This field is required')
		.min(6, 'Login must be at least 5 characters long')
		.max(20, 'Login must not exceed 20 characters'),
	password: yup
		.string()
		.trim()
		.required('This field is required')
		.min(3, 'Password must be at least 8 characters long')
		.max(30, 'Password must not exceed 30 characters')
})

// DATABASE
const databaseSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
})

const measurementUnitsSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	value_type: yup.string().trim().required('This field is required')
})

const PackagesSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	measure: yup.string().trim().required('This field is required'),
	amount: yup.string().trim().required('This field is required'),
	quantity: yup.string().trim().required('This field is required')
})

// STORES
const storeSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	store_type: yup.string().trim().required('This field is required')
})

const employeeSchema = yup.object().shape({
	full_name: yup.string().trim().required('This field is required'),
	phone: yup.string().trim().required('This field is required').length(17, 'The information entered is invalid'),
	email: yup
		.string()
		.trim()
		.nullable()
		.transform((value) => (!value ? null : value))
		.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'The information entered is invalid'),
	username: usernameSchema,
	password: passwordSchema,
	confirmPassword: confirmPasswordSchema
})

const employeeEditSchema = yup.object().shape({
	full_name: yup.string().trim().required('This field is required'),
	phone: yup.string().trim().required('This field is required').length(17, 'The information entered is invalid'),
	username: usernameSchema
})


export {
	storeSchema,
	loginSchema,
	databaseSchema,
	PackagesSchema,
	employeeSchema,
	employeeEditSchema,
	measurementUnitsSchema
}