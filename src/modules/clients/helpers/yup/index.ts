import * as yup from 'yup'


export const customerSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	phone_number: yup.string().trim().required('This field is required').length(17, 'The information entered is invalid'),
	region: yup.number().nullable().transform(value => value ? value : null),
	currency: yup.number().required('This field is required'),
	address: yup.string().nullable().transform(value => value ? value : ''),
	store: yup.number().required('This field is required'),
	price_type: yup.number().required('This field is required')
})
