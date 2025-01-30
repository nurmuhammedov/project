import * as yup from 'yup'

// AUTHENTICATION
const loginSchema = yup.object().shape({
	username: yup.string()
		.trim()
		.required('This field is required')
		.min(6, 'Login must be at least 5 characters long')
		.max(20, 'Login must not exceed 20 characters'),
	password: yup.string()
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


export {
	loginSchema,
	databaseSchema,
	measurementUnitsSchema,
	PackagesSchema,
	storeSchema
}