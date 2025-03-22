import {passwordSchema, usernameSchema} from 'helpers/yup'
import * as yup from 'yup'


export const loginSchema = yup.object().shape({
	username: usernameSchema,
	password: passwordSchema
})
