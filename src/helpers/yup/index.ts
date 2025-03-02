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

// Date
const date = yup
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

const isNotFutureDate = date.test('isNotFutureDate', 'Date must be less than today', (value) => {
	if (!value) return false
	const [year, month, day] = value.split('-').map(Number)
	const inputDate = new Date(year, month - 1, day)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return inputDate <= today
})

// AUTHENTICATION
const loginSchema = yup.object().shape({
	username: usernameSchema,
	password: passwordSchema
})

// DATABASE
const databaseSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
})

const productTypesSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	expiry: yup.boolean().required('This field is required')
})

const measurementUnitsSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	value_type: yup.string().trim().required('This field is required')
})

const packagesSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	measure: yup.string().trim().required('This field is required'),
	// amount: yup.string().trim().required('This field is required'),
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


// CLIENTS
const clientSchema = yup.object().shape({
	full_name: yup.string().trim().required('This field is required'),
	code: yup.string().trim().required('This field is required'),
	phone_number: yup.string().trim().required('This field is required').length(17, 'The information entered is invalid'),
	address: yup.number().required('This field is required'),
	currency: yup.number().required('This field is required'),
	address_detail: yup.string().nullable(),
	store: yup.number().required('This field is required'),
	price_type: yup.number().required('This field is required')
})

// CURRENCIES
const dailyCurrencySchema = yup.object().shape({
	summa: yup.string().trim().required('This field is required'),
	currency_id: yup.number().required('This field is required'),
	datetime: isNotFutureDate
})

const currencyExchangeSchema = yup.object().shape({
	customer: yup.number().required('This field is required'),
	store: yup.number().required('This field is required'),
	date: isNotFutureDate,
	payment: yup
		.array()
		.of(yup.object().shape({
			currency: yup.number().required('This field is required'),
			amount: yup.string().trim().required('This field is required')
		}))
		.required('This field is required')
})


// PRODUCTS
const productSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	is_serial: yup.boolean().required('This field is required'),
	type: yup.number().required('This field is required'),
	package: yup.number().nullable(),
	country: yup.number().nullable(),
	barcodes: yup
		.array()
		.of(yup.string().trim().required('This field is required'))
		.nullable(),
	brand: yup.number().required('This field is required'),
	measure: yup.number().required('This field is required')
})

const temporaryItemSchema = yup.object().shape({
	unit_quantity: yup.string().trim().required('This field is required'),
	package_quantity: yup.string().trim().required('This field is required'),
	price: yup.string().trim().required('This field is required'),
	serial_numbers: yup
		.array()
		.of(yup.string().trim().required('This field is required'))
		.nullable(),
	product: yup.number().required('This field is required'),
	expiry_date: date
})

const temporarySaleItemSchema = yup.object().shape({
	unit_quantity: yup.string().trim().required('This field is required'),
	package_quantity: yup.string().trim().required('This field is required'),
	price: yup.string().trim().required('This field is required'),
	is_paid: yup.boolean().required('This field is required'),
	is_booked: yup.boolean().required('This field is required'),
	serial_numbers: yup.array().required('This field is required'),
	product: yup.number().required('This field is required'),
	store: yup.number().transform(v => v ? v : undefined).required('This field is required'),
	// expiry_date: date
})


const purchaseItemSchema = yup.object().shape({
	store: yup.number().required('This field is required'),
	supplier: yup.number().required('This field is required'),
	price_type: yup.number().required('This field is required'),
	currency: yup.number().required('This field is required'),
	purchase_date: isNotFutureDate,
	cost_amount: yup.string().trim().required('This field is required'),
	cost_currency: yup.number().required('This field is required'),
	comment: yup.string().transform(value => value ? String(value) : '').trim().nullable()
})

const saleItemSchema = yup.object().shape({
	customer: yup.number().required('This field is required'),
	currency: yup.number().required('This field is required'),
	sale_date: isNotFutureDate,
	price_type: yup.number().required('This field is required'),
	comment: yup.string().transform(value => value ? String(value) : '').trim().nullable()
})

export {
	storeSchema,
	loginSchema,
	clientSchema,
	productSchema,
	databaseSchema,
	packagesSchema,
	employeeSchema,
	saleItemSchema,
	productTypesSchema,
	employeeEditSchema,
	purchaseItemSchema,
	dailyCurrencySchema,
	temporaryItemSchema,
	currencyExchangeSchema,
	temporarySaleItemSchema,
	measurementUnitsSchema
}