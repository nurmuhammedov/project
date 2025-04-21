import * as yup from 'yup'


export const currencySchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	code: yup.string().trim().transform((value: string) => value?.toLowerCase()).required('This field is required')
})

export const countrySchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
})

export const brandSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
})

export const expenseTypeSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
})

export const priceTypeSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
})

export const productTypeSchema = yup.object().shape({
	name: yup.string().trim().required('This field is required')
	// expiry: yup.boolean().nullable().default(false)
})
