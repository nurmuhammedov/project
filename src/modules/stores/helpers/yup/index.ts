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

export const employeeEditSchema = yup.object().shape({
	first_name: yup.string().trim().required('This field is required'),
	last_name: yup.string().trim().required('This field is required'),
	phone_number: yup.string().trim().required('This field is required').length(17, 'The information entered is invalid'),
	username: usernameSchema,
	password: passwordSchema,
	confirmPassword: confirmPasswordSchema
})
