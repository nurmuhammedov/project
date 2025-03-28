import * as yup from 'yup'


export const dailyCurrencySchema = yup.object().shape({
	rate: yup.string().trim().required('This field is required'),
	base_currency: yup.number().required('This field is required'),
	target_currency: yup.number().required('This field is required')
})

