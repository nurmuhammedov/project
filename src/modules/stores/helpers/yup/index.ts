import {confirmPasswordSchema, passwordSchema, usernameSchema} from 'helpers/yup'
import * as yup from 'yup'


export const storeSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	exchange_type: yup.string().trim().required('This field is required')
})

export const employeeSchema = yup.object().shape({
	first_name: yup.string().trim().required('This field is required'),
	last_name: yup.string().trim().required('This field is required'),
	role: yup.string().trim().required('This field is required'),
	phone_number: yup
		.string()
		.trim()
		.required('This field is required')
		.length(17, 'The information entered is invalid'),
	// email: yup
	// 	.string()
	// 	.trim()
	// 	.nullable()
	// 	.transform((value) => (!value ? null : value))
	// 	.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'The information entered is invalid'),
	username: usernameSchema,
	password: passwordSchema,
	confirmPassword: confirmPasswordSchema
})

export const employeeEditSchema = yup.object().shape({
	first_name: yup.string().trim().required('This field is required'),
	last_name: yup.string().trim().required('This field is required'),
	phone_number: yup
		.string()
		.trim()
		.required('This field is required')
		.length(17, 'The information entered is invalid'),
	// email: yup
	// 	.string()
	// 	.trim()
	// 	.nullable()
	// 	.transform(value => value ? value : null)
	// 	.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'The information entered is invalid'),


	loginUpdate: yup.boolean().nullable().default(false),
	username: yup.string()
		.trim()
		.nullable()
		.when('passwordUpdate', {
			is: false,
			then: schema => schema.transform(() => null),
			otherwise: schema => schema.required('This field is required')
				.min(5, 'Login must be at least 5 characters long')
				.max(30, 'Login must not exceed 30 characters')
				.matches(/^\S*$/, 'You cannot leave a space in the login')
				.matches(/^[a-zA-Z0-9_]+$/, 'The login can only contain letters, numbers, and underscores')
				.matches(/^(?!\d)[a-zA-Z0-9_]+$/, 'Login cannot start with a number')
				.matches(/^(?!_)[a-zA-Z0-9_]+(?<!_)$/, 'Login cannot begin or end with an underscore')
				.matches(/^(?!.*_{2})/, 'It is not possible to type consecutive underscores in a login')
		}),

	roleUpdate: yup.boolean().nullable().default(false),
	role: yup.string()
		.trim()
		.nullable()
		.when('roleUpdate', {
			is: false,
			then: schema => schema.transform(() => null),
			otherwise: schema => schema.required('This field is required')
		}),


	passwordUpdate: yup.boolean().nullable().default(true),
	password: yup.string()
		.trim()
		.nullable()
		.when('passwordUpdate', {
			is: false,
			then: schema => schema.transform(() => null),
			otherwise: schema => schema.required('This field is required')
				.min(8, 'Password must be at least 8 characters long')
				.max(30, 'Password must not exceed 30 characters')
				.matches(/^\S*$/, 'You cannot leave a space in the password')
				.matches(/^[a-zA-Z0-9!@#$%^&*()]+$/, 'Password can only contain letters, numbers, and special characters (!@#$%^&*)')
		}),
	confirmPassword: yup.string()
		.trim()
		.nullable()
		.when('passwordUpdate', {
			is: false,
			then: schema => schema.transform(() => null),
			otherwise: schema => schema.required('This field is required')
				.oneOf([yup.ref('password')], 'Passwords did not match')
		})
})
