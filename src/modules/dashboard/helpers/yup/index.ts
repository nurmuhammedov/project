import {exchangeOptions} from 'modules/dashboard/helpers/options'
import * as yup from 'yup'


export const dailyCurrencySchema = yup.object().shape({
	rate: yup.string().trim().required('This field is required'),
	base_currency: yup.number().required('This field is required'),
	target_currency: yup.number().required('This field is required')
})


export const currencyExchangeSchema = yup.object().shape({
	customer: yup.number().required('This field is required'),
	store: yup.number().required('This field is required'),
	records: yup
		.array()
		.default([])
		.of(
			yup.object().shape({
				store_currency: yup.number().required('This field is required'),
				store_amount: yup
					.string()
					.trim()
					.optional()
					.nullable()
					.test(
						'store-amount-or-customer-amount-required',
						'This field is required',
						function () {
							const {customer_amount} = this.parent
							// If `store_amount` has a value, `customer_amount` must have a value too
							if (this.parent.store_amount && !customer_amount) {
								return false
							}
							// If `customer_amount` has a value, `store_amount` must have a value too
							if (!this.parent.store_amount && customer_amount) {
								return false
							}
							// If both are null, it's valid
							return true
						}
					)
					.transform(value => value ? value : null)
					.notOneOf(
						['0', '0.00', '0.0', '0.', 0 as unknown as string, 0.0 as unknown as string, 0.00 as unknown as string],
						'The value "0" is not allowed'
					),
				customer_amount: yup
					.string()
					.trim()
					.optional()
					.nullable()
					.test(
						'customer-amount-or-store-amount-required',
						'This field is required',
						function () {
							const {store_amount} = this.parent
							// If `customer_amount` has a value, `store_amount` must have a value too
							if (this.parent.customer_amount && !store_amount) {
								return false
							}
							// If `store_amount` has a value, `customer_amount` must have a value too
							if (!this.parent.customer_amount && store_amount) {
								return false
							}
							// If both are null, it's valid
							return true
						}
					)
					.transform(value => value ? value : null)
					.notOneOf(
						['0', '0.00', '0.0', '0.', 0 as unknown as string, 0.0 as unknown as string, 0.00 as unknown as string],
						'The value "0" is not allowed'
					)
			})
		)
		.required('This field is required'),
	currency: yup.number().required('This field is required'),
	first_amount: yup.string().trim().required('This field is required'),
	type: yup.number().required('This field is required'),
	description: yup
		.string()
		.trim()
		.optional()
		.nullable()
		.transform((value) => (value ? value : null)),
	service_type: yup
		.number()
		.when('type', {
			is: (value: number) => value == exchangeOptions[2]?.value,
			then: (schema) => schema.required('This field is required'),
			otherwise: (schema) => schema.optional().nullable().transform(value => value ? value : null)
		})
})

