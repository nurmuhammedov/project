// components/DynamicFilter/DynamicFilter.tsx
import useData from 'hooks/useData'
import useSearchParams from 'hooks/useSearchParams'
import React, {useState, useEffect, FC} from 'react'
import {Input, Select, MaskInput} from 'components'
import {ISelectOption} from 'interfaces/form.interface'
import {currencyOptions, isSerialOptions, expiryOptions, regionsOptions} from 'constants/options' // Assuming this path is correct
import {getSelectValue} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss' // Using the provided style import
import {Search as SearchIcon} from 'assets/icons'


export type FilterFieldType =
	| 'store'
	| 'search'
	| 'from_date'
	| 'to_date'
	| 'customer'
	| 'price_type'
	| 'service_type'
	| 'currency'
	| 'product_type'
	| 'brand'
	| 'country'
	| 'is_serial'
	| 'expiry'
	| 'is_user'
	| 'region'
	| 'purchase_date';

interface DynamicFilterProps {
	fieldsToShow: FilterFieldType[];
	width?: boolean;
}

const fieldLabels: Record<FilterFieldType, string> = {
	store: 'Store',
	search: 'Search',
	from_date: 'From',
	to_date: 'To',
	customer: 'Customer',
	price_type: 'Price type',
	service_type: 'Service type',
	currency: 'Currency',
	product_type: 'Type',
	brand: 'Brand',
	country: 'Country',
	is_serial: 'Series',
	expiry: 'Expiry deadline',
	is_user: 'Employee',
	region: 'Region',
	purchase_date: 'Date'
}

function useDebouncedValue<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)
		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])
	return debouncedValue
}

const formatDateToURL = (dateStr_ddMMyyyy: string): string | undefined => {
	if (!dateStr_ddMMyyyy || dateStr_ddMMyyyy.length !== 10 || !/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr_ddMMyyyy)) {
		return undefined
	}
	const parts = dateStr_ddMMyyyy.split('.')
	const day = parseInt(parts[0], 10)
	const month = parseInt(parts[1], 10)
	const year = parseInt(parts[2], 10)

	if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined
	const dateObj = new Date(year, month - 1, day)
	if (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) {
		return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
	}
	return undefined
}

const formatDateFromURL = (dateStr_yyyyMMdd: string | undefined): string => {
	if (!dateStr_yyyyMMdd || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr_yyyyMMdd)) return ''
	const parts = dateStr_yyyyMMdd.split('-')
	if (parts.length !== 3) return ''
	return `${parts[2]}.${parts[1]}.${parts[0]}`
}

const DynamicFilter: FC<DynamicFilterProps> = ({fieldsToShow, width = true}) => {
	const {t} = useTranslation()
	const {paramsObject, addParams} = useSearchParams()

	const [searchText, setSearchText] = useState(paramsObject.search || '')
	const debouncedSearchText = useDebouncedValue(searchText, 500)

	const [fromDateText, setFromDateText] = useState(() => formatDateFromURL(paramsObject.from_date as unknown as string))
	const [toDateText, setToDateText] = useState(() => formatDateFromURL(paramsObject.to_date as unknown as string))
	const [purchaseDateText, setPurchaseDateText] = useState(() => formatDateFromURL(paramsObject.purchase_date as unknown as string))


	useEffect(() => {
		const currentSearchInParams = paramsObject.search || ''
		if (debouncedSearchText !== currentSearchInParams) {
			addParams({search: debouncedSearchText || undefined}, 'page')
		}
	}, [debouncedSearchText, paramsObject.search, addParams])

	useEffect(() => {
		setSearchText(paramsObject.search || '')
	}, [paramsObject.search])

	useEffect(() => {
		setFromDateText(formatDateFromURL(paramsObject.from_date as unknown as string))
	}, [paramsObject.from_date])

	useEffect(() => {
		setToDateText(formatDateFromURL(paramsObject.to_date as unknown as string))
	}, [paramsObject.to_date])

	useEffect(() => {
		setPurchaseDateText(formatDateFromURL(paramsObject.purchase_date as unknown as string))
	}, [paramsObject.purchase_date])


	const {data: storesOptions = [], isPending: storesLoading} = useData<ISelectOption[]>(
		'stores/select',
		fieldsToShow.includes('store')
	)
	const {data: customersOptions = [], isPending: customersLoading} = useData<ISelectOption[]>(
		'customers/select',
		fieldsToShow.includes('customer')
	)
	const {data: priceTypesOptions = [], isPending: priceTypesLoading} = useData<ISelectOption[]>(
		'price-types/select',
		fieldsToShow.includes('price_type')
	)
	const {data: serviceTypesOptions = [], isPending: serviceTypesLoading} = useData<ISelectOption[]>(
		'service-types/select',
		fieldsToShow.includes('service_type')
	)
	const {data: productTypesOptions = [], isPending: productTypesLoading} = useData<ISelectOption[]>(
		'product-types/select',
		fieldsToShow.includes('product_type')
	)
	const {data: brandOptions = [], isPending: brandLoading} = useData<ISelectOption[]>(
		'brands/select',
		fieldsToShow.includes('brand')
	)
	const {data: countryOptions = [], isPending: countryLoading} = useData<ISelectOption[]>(
		'countries/select',
		fieldsToShow.includes('country')
	)


	const handleDateChange = (
		value: React.ChangeEvent<HTMLInputElement>,
		paramKey: 'from_date' | 'to_date' | 'purchase_date',
		setDateTextState: React.Dispatch<React.SetStateAction<string>>
	) => {
		const maskedValue = value.target.value
		setDateTextState(maskedValue)
		const formattedForURL = formatDateToURL(maskedValue)
		addParams({[paramKey]: formattedForURL}, 'page')
	}

	const renderField = (field: FilterFieldType) => {
		const placeholderText = t(fieldLabels[field])
		const commonSelectProps = {
			isClearable: true,
			placeholder: placeholderText
		}
		const selectId = `${field}_filter_select`
		const inputId = `${field}_filter_input`


		switch (field) {
			case 'search':
				return (
					<div>
						<Input
							id={inputId}
							radius={true}
							style={width ? {width: '20rem', maxWidth: '100%'} : {}}
							placeholder={placeholderText}
							value={searchText as unknown as string}
							onChange={(e) => setSearchText(e.target.value)}
							icon={<SearchIcon/>}
							iconPosition="left"
						/>
					</div>
				)
			case 'store':
				return (
					<Select
						id={selectId}
						options={storesOptions}
						value={getSelectValue(storesOptions, paramsObject.store)}
						handleOnChange={(selectedValue) => addParams({store: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={storesLoading}
						{...commonSelectProps}
					/>
				)
			case 'customer':
				return (
					<Select
						id={selectId}
						options={customersOptions}
						value={getSelectValue(customersOptions, paramsObject.customer)}
						handleOnChange={(selectedValue) => addParams({customer: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={customersLoading}
						{...commonSelectProps}
					/>
				)
			case 'price_type':
				return (
					<Select
						id={selectId}
						options={priceTypesOptions}
						value={getSelectValue(priceTypesOptions, paramsObject.price_type)}
						handleOnChange={(selectedValue) => addParams({price_type: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={priceTypesLoading}
						{...commonSelectProps}
					/>
				)
			case 'service_type':
				return (
					<Select
						id={selectId}
						options={serviceTypesOptions}
						value={getSelectValue(serviceTypesOptions, paramsObject.service_type)}
						handleOnChange={(selectedValue) => addParams({service_type: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={serviceTypesLoading}
						{...commonSelectProps}
					/>
				)
			case 'currency':
				return (
					<Select
						id={selectId}
						options={currencyOptions}
						value={getSelectValue(currencyOptions, paramsObject.currency)}
						handleOnChange={(selectedValue) => addParams({currency: selectedValue as unknown as string ?? undefined}, 'page')}
						{...commonSelectProps}
					/>
				)
			case 'product_type':
				return (
					<Select
						id={selectId}
						options={productTypesOptions}
						value={getSelectValue(productTypesOptions, paramsObject.product_type)}
						handleOnChange={(selectedValue) => addParams({product_type: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={productTypesLoading}
						{...commonSelectProps}
					/>
				)
			case 'brand':
				return (
					<Select
						id={selectId}
						options={brandOptions}
						value={getSelectValue(brandOptions, paramsObject.brand)}
						handleOnChange={(selectedValue) => addParams({brand: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={brandLoading}
						{...commonSelectProps}
					/>
				)
			case 'country':
				return (
					<Select
						id={selectId}
						options={countryOptions}
						value={getSelectValue(countryOptions, paramsObject.country)}
						handleOnChange={(selectedValue) => addParams({country: selectedValue as unknown as string ?? undefined}, 'page')}
						isLoading={countryLoading}
						{...commonSelectProps}
					/>
				)
			case 'is_serial':
				return (
					<Select
						id={selectId}
						options={isSerialOptions}
						value={getSelectValue(isSerialOptions, paramsObject.is_serial)}
						handleOnChange={(selectedValue) => addParams({is_serial: selectedValue as unknown as string ?? undefined}, 'page')}
						{...commonSelectProps}
					/>
				)
			case 'expiry':
				return (
					<Select
						id={selectId}
						options={expiryOptions} // Reusing expiryOptions as per previous instruction
						value={getSelectValue(expiryOptions, paramsObject.expiry)}
						handleOnChange={(selectedValue) => addParams({expiry: selectedValue as unknown as string ?? undefined}, 'page')}
						{...commonSelectProps}
					/>
				)
			case 'is_user':
				return (
					<Select
						id={selectId}
						options={expiryOptions} // Using expiryOptions as requested
						value={getSelectValue(expiryOptions, paramsObject.is_user)}
						handleOnChange={(selectedValue) => addParams({is_user: selectedValue as unknown as string ?? undefined}, 'page')}
						{...commonSelectProps}
					/>
				)
			case 'region':
				return (
					<Select
						id={selectId}
						options={regionsOptions}
						value={getSelectValue(regionsOptions, paramsObject.region)}
						handleOnChange={(selectedValue) => addParams({region: selectedValue as unknown as string ?? undefined}, 'page')}
						{...commonSelectProps}
					/>
				)
			case 'from_date':
				return (
					<MaskInput
						id={inputId}
						placeholder={placeholderText}
						value={fromDateText}
						onChange={(e) => handleDateChange(e, 'from_date', setFromDateText)}
						mask="99.99.9999"
					/>
				)
			case 'to_date':
				return (
					<MaskInput
						id={inputId}
						placeholder={placeholderText}
						value={toDateText}
						onChange={(e) => handleDateChange(e, 'to_date', setToDateText)}
						mask="99.99.9999"
					/>
				)
			case 'purchase_date':
				return (
					<MaskInput
						id={inputId}
						placeholder={placeholderText}
						value={purchaseDateText}
						onChange={(e) => handleDateChange(e, 'purchase_date', setPurchaseDateText)}
						mask="99.99.9999"
					/>
				)
			default:
				return null
		}
	}

	return (
		<div className={styles.filterContainer}>
			{fieldsToShow.map((field) => (
				<div key={field} className={styles.filterItem}>
					{renderField(field)}
				</div>
			))}
		</div>
	)
}

export default DynamicFilter