import * as yup from 'yup'


export const dailyCurrencySchema = yup.object().shape({
	rate: yup.string().trim().required('This field is required'),
	base_currency: yup.string().trim().required('This field is required'),
	target_currency: yup.string().trim().required('This field is required')
})


export const currencyExchangeSchema = yup.object().shape({
	customer: yup.number().required('This field is required'),
	store: yup.number().required('This field is required'),
	records: yup
		.array()
		.default([])
		.of(
			yup.object().shape({
				store_currency: yup.string()?.trim().required('This field is required'),
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
							return !(!this.parent.store_amount && !!customer_amount)
						}
					)
					.transform(value => value ? value : null),
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
							return !(!this.parent.customer_amount && !!store_amount)
						}
					)
					.transform(value => value ? value : null)
			})
		)
		.required('This field is required'),
	currency: yup.string().trim().required('This field is required'),
	first_amount: yup.string().trim().required('This field is required'),
	total: yup.string().trim().optional().nullable().transform(value => Number(value) ? value : '0'),
	type: yup.number().required('This field is required'),
	description: yup
		.string()
		.trim()
		.optional()
		.nullable()
		.transform((value) => (value ? value : null)),
	// service_type: yup
	// 	.number()
	// 	.when('type', {
	// 		is: (value: number) => value == exchangeOptions[2]?.value,
	// 		then: (schema) => schema.required('This field is required'),
	// 		otherwise: (schema) => schema.optional().nullable().transform(value => value ? value : null)
	// 	})
})

