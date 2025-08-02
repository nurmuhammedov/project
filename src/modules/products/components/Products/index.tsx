import Filter from 'components/Filter'
import {ISearchParams} from 'interfaces/params.interface'
import {measurementUnits} from 'modules/database/helpers/options'
import {IProductDetail} from 'modules/products/interfaces'
import {Controller, useForm, useFieldArray} from 'react-hook-form'
import {ISelectOption} from 'interfaces/form.interface'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {yupResolver} from '@hookform/resolvers/yup'
import {getSelectValue} from 'utilities/common'
import {useTranslation} from 'react-i18next'
import {Plus} from 'assets/icons'
import {productSchema} from 'helpers/yup'
import {useEffect, useMemo} from 'react'
import {Column} from 'react-table'

import {
	HR,
	Card,
	Form,
	Input,
	Modal,
	Select,
	Button,
	EditModal,
	ReactTable,
	EditButton,
	Pagination,
	DeleteModal,
	DeleteButton, Checkbox, FileUploader
} from 'components'

import {
	useAdd,
	useData,
	useUpdate,
	useDetail,
	usePagination,
	useSearchParams,
	usePaginatedData
} from 'hooks'
import {getSelectOptionsByKey} from 'utilities/select'


const Products = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {
		removeParams,
		paramsObject: {updateId = undefined, modal = undefined, product_type = undefined, ...params}
	} = useSearchParams()
	const {data: countries = []} = useData<ISelectOption[]>('countries/select', modal === 'product' || modal === 'edit')
	const {data: types = []} = useData<ISelectOption[]>('product-types/select', modal === 'product' || modal === 'edit')
	const {data: brands = []} = useData<ISelectOption[]>('brands/select', modal === 'product' || modal === 'edit')

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IProductDetail[]>(
		`products`,
		{...params, page: page, page_size: pageSize, type: product_type}
	)

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
			measure: 'nb'
		},
		resolver: yupResolver(productSchema)
	})

	const {
		fields: addBarcodeFields,
		append: addBarcodeAppend,
		remove: addBarcodeRemove
	} = useFieldArray({
		control: controlAdd,
		name: 'barcodes' as never
	})

	const columns: Column<IProductDetail>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_: IProductDetail, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: (row: IProductDetail) => row.name
			},
			{
				Header: t('Type'),
				accessor: (row: IProductDetail) => row.type?.name
			},
			{
				Header: t('Brand'),
				accessor: (row: IProductDetail) => row.brand?.name
			},
			{
				Header: t('Country'),
				accessor: (row: IProductDetail) => row.country?.name
			},
			{
				Header: t('Series'),
				accessor: (row: IProductDetail) => (row.is_serial ? t('With a series') : t('Without a series'))
			},
			{
				Header: t('Expiry deadline'),
				accessor: (row) => row?.expiry ? t('Exist') : t('No')
			},
			{
				Header: t('Actions'),
				accessor: (row: IProductDetail) => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton id={row.id}/>
					</div>
				)
			}
		],
		[page, pageSize]
	)

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		setValue: setValueEdit,
		watch: watchEdit,
		formState: {errors: editErrors}
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
			measure: 'nb'
		},
		resolver: yupResolver(productSchema)
	})

	const {
		fields: editBarcodeFields,
		append: editBarcodeAppend,
		remove: editBarcodeRemove
	} = useFieldArray({
		control: controlEdit,
		name: 'barcodes' as never
	})

	const {mutateAsync, isPending: isAdding} = useAdd('products')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('products/', updateId)
	const {data: detail, isPending: isDetailLoading, isFetching} = useDetail<IProductDetail>('products/', updateId)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({
				name: detail.name,
				is_serial: detail.is_serial,
				expiry: detail.expiry,
				barcodes: detail.barcodes || [],
				type: detail.type?.id as number,
				country: detail.country?.id as number || undefined,
				brand: detail.brand?.id as number || undefined,
				measure: detail.measure as unknown as string
			})
		}
	}, [detail])

	useEffect(() => {
		if (modal === 'product') {
			setTimeout(() => {
				setFocus('name')
			}, 0)
		}
	}, [modal])

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Filter fieldsToShow={['search', 'product_type', 'brand', 'country', 'is_serial', 'expiry']}/>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal
				title="Add a new product"
				id="product"
				style={{height: '45rem', width: '60rem'}}
				onClose={() => {
					resetAdd({
						name: '',
						is_serial: false,
						expiry: false,
						barcodes: [],
						type: undefined,
						country: undefined,
						brand: undefined,
						measure: 'nb'
					})
					removeParams('modal')
				}}
			>
				<Form
					onSubmit={handleAddSubmit((data) =>
						mutateAsync(data).then(async () => {
							// removeParams('modal')
							resetAdd({
								name: '',
								is_serial: false,
								expiry: false,
								barcodes: [],
								type: undefined,
								country: undefined,
								brand: undefined,
								measure: 'nb'
							})
							await refetch()
						})
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

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '45rem', width: '60rem'}}>
				<Form
					onSubmit={handleEditSubmit((data) =>
						update(data)
							.then(async () => {
								resetEdit()
								removeParams('modal', 'updateId')
								await refetch()
							})
					)}
				>

					<div className="grid gap-lg">
						<div className="span-6">
							<Input
								id="nameEdit"
								label="Name"
								error={editErrors.name?.message}
								{...registerEdit('name')}
							/>
						</div>
						<div className="span-6">
							<Controller
								name="measure"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="measureEdit"
										isDisabled={true}
										label="Measure unit"
										options={getSelectOptionsByKey(measurementUnits as unknown as ISearchParams[], 'name')}
										onBlur={onBlur}
										error={editErrors.measure?.message}
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
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="typeEdit"
										label="Type"
										onBlur={onBlur}
										error={editErrors.type?.message}
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
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="brandEdit"
										label="Brand"
										options={brands}
										onBlur={onBlur}
										error={editErrors.brand?.message}
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
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="countryEdit"
										label="Country"
										options={countries}
										onBlur={onBlur}
										error={editErrors.country?.message}
										value={getSelectValue(countries, value)}
										defaultValue={getSelectValue(countries, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-2">
							<Checkbox
								id="seriesEdit"
								title="Series?"
								{...registerEdit('is_serial')}
							/>
						</div>
						<div className="span-6">
							<Checkbox
								id="expiryEdit"
								title="Is there expiry date?"
								{...registerEdit('expiry')}
							/>
						</div>
						<div className="span-12 grid gap-lg">
							{
								editBarcodeFields?.map((_field, index) => (
									<div className="span-4">
										<Input
											id={`barcodes.${index}.edit`}
											label={`${index + 1}-${t('Barcode')?.toLowerCase()}`}
											handleDelete={() => editBarcodeRemove(index)}
											error={editErrors.barcodes?.[index]?.message}
											{...registerEdit(`barcodes.${index}`)}
										/>
									</div>
								))
							}
						</div>
					</div>

					<div className="span-12 flex gap-lg">
						<Button
							type="button"
							onClick={() => editBarcodeAppend('')}
							disabled={watchEdit('barcodes')?.length !== 0 && watchEdit('barcodes')?.[(watchEdit('barcodes')?.length ?? 1) - 1]?.trim() === ''}
							theme={BUTTON_THEME.OUTLINE}
							icon={<Plus/>}
						>
							Add barcode
						</Button>
						<FileUploader
							type="txt"
							handleOnChange={(arr) => setValueEdit('barcodes', Array.isArray(arr) ? Array.from(new Set(arr)) : [])}
							value={undefined}
							id="series"
						/>
					</div>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</EditModal>

			<DeleteModal endpoint="products/" onDelete={refetch}/>
		</>
	)
}

export default Products