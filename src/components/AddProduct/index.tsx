import {ISearchParams} from 'interfaces/params.interface'
import {measurementUnits} from 'modules/database/helpers/options'
import {Controller, useForm, useFieldArray, UseFormSetFocus, UseFormTrigger} from 'react-hook-form'
import {ISelectOption} from 'interfaces/form.interface'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {cleanParams, getSelectValue} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {Plus} from 'assets/icons'
import {productSchema2} from 'helpers/yup'
import {FC, useEffect} from 'react'

import {
	Form,
	Input,
	Modal,
	Select,
	Button,
	Checkbox,
	FileUploader,
	NumberFormattedInput
} from 'components'

import {
	useAdd,
	useData,
	useSearchParams
} from 'hooks'
import {getSelectOptionsByKey} from 'utilities/select'
import {useQueryClient} from '@tanstack/react-query'
import {InferType} from 'yup'
import {purchaseItemSchema} from 'modules/products/helpers/yup'


interface IProperties {
	clientId?: number | string
	focus?: UseFormSetFocus<InferType<typeof purchaseItemSchema>>,
	trigger?: UseFormTrigger<InferType<typeof purchaseItemSchema>>,
}

const Products: FC<IProperties> = ({clientId, focus: parentFocus, trigger}) => {
	const {t} = useTranslation()
	const queryClient = useQueryClient()

	const {
		removeParams,
		paramsObject: {modal = undefined}
	} = useSearchParams()
	const {data: countries = []} = useData<ISelectOption[]>('countries/select', modal === 'product' || modal === 'edit')
	const {data: types = []} = useData<ISelectOption[]>('product-types/select', modal === 'product' || modal === 'edit')
	const {data: brands = []} = useData<ISelectOption[]>('brands/select', modal === 'product' || modal === 'edit')

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		control: controlAdd,
		setValue: setValueAdd,
		watch: watchAdd,
		setFocus,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			name: '',
			is_serial: false,
			expiry: false,
			barcodes: [],
			type: undefined,
			country: undefined,
			brand: undefined,
			unit_quantity: '1',
			price: '',
			measure: 'nb'
		},
		resolver: yupResolver(productSchema2)
	})


	const {
		fields: addBarcodeFields,
		append: addBarcodeAppend,
		remove: addBarcodeRemove
	} = useFieldArray({
		control: controlAdd,
		name: 'barcodes' as never
	})

	const {mutateAsync, isPending: isAdding} = useAdd<InferType<typeof productSchema2>, {
		id: number
	}, never>('products')

	const {mutateAsync: add, isPending: isNewAdding} = useAdd('temporaries')


	useEffect(() => {
		if (modal === 'product') {
			setTimeout(() => {
				setFocus('name')
			}, 0)
		}
	}, [modal])

	return (
		<Modal
			title="Add a new product"
			id="product"
			style={{height: '45rem', width: '60rem'}}
			onClose={() => {
				resetAdd((prev) => ({
					name: '',
					is_serial: false,
					expiry: false,
					barcodes: [],
					type: prev?.type,
					brand: prev?.brand,
					country: undefined,
					unit_quantity: '1',
					price: '',
					measure: 'nb'
				}))
				removeParams('modal')
			}}
		>
			<Form
				onSubmit={handleAddSubmit((data) => {
						if (!clientId) {
							trigger?.(['supplier'])
							parentFocus?.('supplier')
						} else {
							mutateAsync(data).then(async (d) => {
								const newData = {
									product: d?.id as unknown as string,
									expiry_date: null,
									price: data?.price,
									serial_numbers: [],
									unit_quantity: data?.unit_quantity,
									supplier: clientId
								}
								add(cleanParams(newData as unknown as ISearchParams)).then(async () => {
									removeParams('modal')
									resetAdd({
										name: '',
										is_serial: false,
										expiry: false,
										barcodes: [],
										type: data?.type,
										country: undefined,
										brand: data?.brand,
										unit_quantity: '1',
										price: '',
										measure: 'nb'
									})
									queryClient?.invalidateQueries({queryKey: ['products/select']})
									queryClient?.invalidateQueries({queryKey: ['temporaries']})
								})
							})
						}
					}
				)}
			>
				<div className="grid gap-lg">
					<div className="span-6">
						<Input
							id="nameAdd"
							label="Name"
							error={addErrors.name?.message}
							{...registerAdd('name')}
						/>
					</div>

					<div className="span-6">
						<Controller
							control={controlAdd}
							name="unit_quantity"
							render={({field}) => (
								<NumberFormattedInput
									id="unit_quantity"
									disableGroupSeparators={false}
									allowDecimals={true}
									maxLength={9}
									error={addErrors?.unit_quantity?.message}
									label="Count"
									{...field}
								/>
							)}
						/>
					</div>

					<div className="span-6">
						<Controller
							control={controlAdd}
							name="price"
							render={({field}) => (
								<NumberFormattedInput
									id="price"
									maxLength={12}
									disableGroupSeparators={false}
									allowDecimals={true}
									label="Price"
									error={addErrors?.price?.message}
									{...field}
								/>
							)}
						/>
					</div>

					<div className="span-6">
						<Controller
							name="measure"
							control={controlAdd}
							render={({field: {value, ref, onChange, onBlur}}) => (
								<Select
									ref={ref}
									id="measureAdd"
									label="Measure unit"
									options={getSelectOptionsByKey(measurementUnits as unknown as ISearchParams[], 'name')}
									onBlur={onBlur}
									error={addErrors.measure?.message}
									value={getSelectValue(getSelectOptionsByKey(measurementUnits as unknown as ISearchParams[], 'name'), value)}
									defaultValue={getSelectValue(getSelectOptionsByKey(measurementUnits as unknown as ISearchParams[], 'name'), value)}
									handleOnChange={(e) => onChange(e as string)}
								/>
							)}
						/>
					</div>
					<div className="span-4">
						<Controller
							name="type"
							control={controlAdd}
							render={({field: {value, ref, onChange, onBlur}}) => (
								<Select
									ref={ref}
									id="type"
									label="Type"
									onBlur={onBlur}
									error={addErrors.type?.message}
									options={types}
									value={getSelectValue(types, value)}
									defaultValue={getSelectValue(types, value)}
									handleOnChange={(e) => onChange(e as string)}
								/>
							)}
						/>
					</div>
					<div className="span-4">
						<Controller
							name="brand"
							control={controlAdd}
							render={({field: {value, ref, onChange, onBlur}}) => (
								<Select
									ref={ref}
									id="brandAdd"
									label="Brand"
									options={brands}
									onBlur={onBlur}
									error={addErrors.brand?.message}
									value={getSelectValue(brands, value)}
									defaultValue={getSelectValue(brands, value)}
									handleOnChange={(e) => onChange(e as string)}
								/>
							)}
						/>
					</div>
					<div className="span-4">
						<Controller
							name="country"
							control={controlAdd}
							render={({field: {value, ref, onChange, onBlur}}) => (
								<Select
									ref={ref}
									id="countryAdd"
									label="Country"
									options={countries}
									onBlur={onBlur}
									error={addErrors.country?.message}
									value={getSelectValue(countries, value)}
									defaultValue={getSelectValue(countries, value)}
									handleOnChange={(e) => onChange(e as string)}
								/>
							)}
						/>
					</div>

					<div className="span-2">
						<Checkbox
							id="seriesAdd"
							title="Series?"
							{...registerAdd('is_serial')}
						/>
					</div>
					<div className="span-6">
						<Checkbox
							id="expiryAdd"
							title="Is there expiry date?"
							{...registerAdd('expiry')}
						/>
					</div>

					<div className="span-12 grid gap-lg">
						{
							addBarcodeFields?.map((_field, index) => (
								<div className="span-4">
									<Input
										id={`barcodes.${index}.add`}
										label={`${index + 1}-${t('Barcode')?.toLowerCase()}`}
										handleDelete={() => addBarcodeRemove(index)}
										error={addErrors.barcodes?.[index]?.message}
										{...registerAdd(`barcodes.${index}`)}
									/>
								</div>
							))
						}
					</div>
				</div>

				<div className="span-12 flex gap-lg">
					<Button
						theme={BUTTON_THEME.OUTLINE}
						type="button"
						disabled={watchAdd('barcodes')?.length !== 0 && watchAdd('barcodes')?.[(watchAdd('barcodes')?.length ?? 1) - 1]?.trim() === ''}
						icon={<Plus/>}
						onClick={() => addBarcodeAppend('')}
					>
						Add barcode
					</Button>
					<FileUploader
						type="txt"
						handleOnChange={(arr) => setValueAdd('barcodes', Array.isArray(arr) ? Array.from(new Set(arr)) : [])}
						value={undefined}
						id="series"
					/>
				</div>

				<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding || isNewAdding}>
					Save
				</Button>
			</Form>
		</Modal>
	)
}

export default Products