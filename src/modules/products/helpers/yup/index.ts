import {date, isNotFutureDate} from 'helpers/yup'
import * as yup from 'yup'


export const temporaryItemSchema = yup.object().shape({
	unit_quantity: yup.string().trim().required('This field is required'),
	price: yup.string().trim().required('This field is required'),
	serial_numbers: yup
		.array()
		.default([])
		.optional()
		.nullable()
		.of(yup.string().trim().optional().nullable().transform(value => value ? value : ''))
		.transform(value => (value && Array.isArray(value)) ? value : []),
	product: yup.number().required('This field is required'),
	expiry_date: date
})

export const temporarySaleItemSchema = yup.object().shape({
	unit_quantity: yup.string().trim().required('This field is required'),
	price: yup.string().trim().required('This field is required'),
	serial_numbers: yup.array().required('This field is required'),
	product: yup.number().required('This field is required'),
	// store: yup.number().transform(v => v ? v : undefined).required('This field is required')
})


export const purchaseItemSchema = yup.object().shape({
	store: yup.number().required('This field is required'),
	supplier: yup.number().required('This field is required'),
	price_type: yup.number().required('This field is required'),
	currency: yup.string().trim().required('This field is required'),
	purchase_date: isNotFutureDate,
	cost_amount: yup.string().trim().required('This field is required'),
	cost_currency: yup.string().trim().required('This field is required'),
	comment: yup.string().transform(value => value ? String(value) : '').trim().nullable()
})

export const saleItemSchema = yup.object().shape({
	customer: yup.number().required('This field is required'),
	currency: yup.string().trim().required('This field is required'),
	sale_date: isNotFutureDate,
	price_type: yup.number().required('This field is required'),
	comment: yup.string().transform(value => value ? String(value) : '').trim().nullable()
})