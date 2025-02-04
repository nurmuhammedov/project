import {yupResolver} from '@hookform/resolvers/yup'
import {Search} from 'assets/icons'
import {
	Button,
	Card,
	EditButton,
	EditModal,
	HR,
	Input,
	Modal,
	Pagination,
	ReactTable,
	Form,
	Select, DeleteButton, DeleteModal
} from 'components'
import {FIELD} from 'constants/fields'
import {seriesOptions} from 'helpers/options'
import {
	useAdd,
	useData,
	useDetail,
	usePaginatedData,
	usePagination,
	useSearchParams,
	useUpdate
} from 'hooks'
import {IProductItemDetail} from 'interfaces/products.interface'
import {ISelectOption} from 'interfaces/form.interface'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {productSchema} from 'helpers/yup'
import {getSelectValue} from 'utilities/common'


const Products = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {removeParams, paramsObject: {updateId = undefined, modal = undefined}} = useSearchParams()
	const {data: types = []} = useData<ISelectOption[]>('product-types/select', modal === 'product' || modal === 'edit')
	const {data: packages = []} = useData<ISelectOption[]>('packages/select', modal === 'product' || modal === 'edit')
	const {data: countries = []} = useData<ISelectOption[]>('countries/select', modal === 'product' || modal === 'edit')
	const {data: brands = []} = useData<ISelectOption[]>('brands/select', modal === 'product' || modal === 'edit')
	const {data: measures = []} = useData<ISelectOption[]>('organization/measurement/select', modal === 'product' || modal === 'edit')

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IProductItemDetail[]>(
		`products`,
		{page: page, page_size: pageSize}
	)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			name: '',
			is_serial: false,
			barcodes: '',
			type: undefined,
			package: undefined,
			country: undefined,
			brand: undefined,
			measure: undefined
		},
		resolver: yupResolver(productSchema)
	})

	const columns: Column<IProductItemDetail>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_: IProductItemDetail, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: (row: IProductItemDetail) => row.name
			},
			{
				Header: t('Type'),
				accessor: (row: IProductItemDetail) => row.type?.name
			},
			{
				Header: t('Brand'),
				accessor: (row: IProductItemDetail) => row.brand?.name
			},
			{
				Header: t('Country'),
				accessor: (row: IProductItemDetail) => row.country?.name
			},
			{
				Header: t('Measure unit'),
				accessor: (row: IProductItemDetail) => row.measure?.name
			},
			// {
			// 	Header: t('Barcode'),
			// 	accessor: (row: IProductItemDetail) => row.code
			// },
			{
				Header: t('Series'),
				accessor: (row: IProductItemDetail) => row.is_serial ? t('With a series') : t('Without a series')
			},
			{
				Header: t('Actions'),
				accessor: (row: IProductItemDetail) => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton id={row.id}/>
					</div>
				)
			}
		],
		[t, page, pageSize]
	)

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			name: '',
			is_serial: false,
			barcodes: '',
			type: undefined,
			package: undefined,
			country: undefined,
			brand: undefined,
			measure: undefined
		},
		resolver: yupResolver(productSchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('products')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('products/', updateId)
	const {data: detail, isPending: isDetailLoading} = useDetail<IProductItemDetail>('products/', updateId)

	useEffect(() => {
		if (detail) {
			resetEdit({
				name: detail.name,
				is_serial: detail.is_serial,
				barcodes: detail.barcodes as unknown as string,
				type: detail.type?.id as number,
				package: detail.package?.id as number,
				country: detail.country?.id as number,
				brand: detail.brand?.id as number,
				measure: detail.measure?.id as number
			})
		}
	}, [detail])

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input
						id="search"
						radius={true}
						icon={<Search/>}
						placeholder="Search"
						style={{width: 400}}
					/>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal title="Add a new product" id="product" style={{height: '60rem', width: '60rem'}}>
				<Form
					onSubmit={handleAddSubmit((data) =>
						mutateAsync(data).then(async () => {
							resetAdd()
							removeParams('modal')
							await refetch()
						})
					)}
				>
					<Input
						id="name"
						label="Name"
						error={addErrors.name?.message}
						{...registerAdd('name')}
					/>

					<div className="grid gap-lg">
						<div className="span-6">
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
						<div className="span-6">
							<Controller
								name="brand"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="brand"
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
						<div className="span-6">
							<Controller
								name="country"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="country"
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
						<div className="span-6">
							<Controller
								name="measure"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="measure"
										label="Measure unit"
										options={measures}
										onBlur={onBlur}
										error={addErrors.measure?.message}
										value={getSelectValue(measures, value)}
										defaultValue={getSelectValue(measures, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>
					</div>

					<Controller
						name="package"
						control={controlAdd}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="package"
								label="Package"
								options={packages}
								onBlur={onBlur}
								error={addErrors.package?.message}
								value={getSelectValue(packages, value)}
								defaultValue={getSelectValue(packages, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Controller
						name="is_serial"
						control={controlAdd}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="is_serial"
								label="Series?"
								onBlur={onBlur}
								error={addErrors.is_serial?.message}
								options={seriesOptions}
								value={getSelectValue(seriesOptions, value)}
								defaultValue={getSelectValue(seriesOptions, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Input
						id="barcodes"
						label="Barcode"
						error={addErrors.barcodes?.message}
						{...registerAdd('barcodes')}
					/>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isDetailLoading && !detail} style={{height: '60rem', width: '60rem'}}>
				<Form
					onSubmit={handleEditSubmit((data) =>
						update(data).then(async () => {
							resetEdit()
							removeParams('modal', 'updateId')
							await refetch()
						})
					)}
				>
					<Input
						id="name"
						label="Name"
						error={editErrors.name?.message}
						{...registerEdit('name')}
					/>

					<div className="grid gap-lg">
						<div className="span-6">

							<Controller
								name="type"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="type"
										label="Type"
										options={types}
										onBlur={onBlur}
										error={editErrors.type?.message}
										value={getSelectValue(types, value)}
										defaultValue={getSelectValue(types, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>
						<div className="span-6">
							<Controller
								name="brand"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="brand"
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
						<div className="span-6">
							<Controller
								name="country"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="country"
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
						<div className="span-6">
							<Controller
								name="measure"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="measure"
										label="Measure unit"
										options={measures}
										onBlur={onBlur}
										error={editErrors.measure?.message}
										value={getSelectValue(measures, value)}
										defaultValue={getSelectValue(measures, value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>
					</div>

					<Controller
						name="package"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="package"
								label="Package"
								options={packages}
								onBlur={onBlur}
								error={editErrors.package?.message}
								value={getSelectValue(packages, value)}
								defaultValue={getSelectValue(packages, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>


					<Controller
						name="is_serial"
						control={controlEdit}
						render={({field: {value, ref, onChange, onBlur}}) => (
							<Select
								ref={ref}
								top={true}
								id="is_serial"
								label="Is Serial"
								onBlur={onBlur}
								error={editErrors.is_serial?.message}
								options={seriesOptions}
								value={getSelectValue(seriesOptions, value)}
								defaultValue={getSelectValue(seriesOptions, value)}
								handleOnChange={(e) => onChange(e as string)}
							/>
						)}
					/>

					<Input
						id="barcodes"
						label="Barcode"
						error={editErrors.barcodes?.message}
						{...registerEdit('barcodes')}
					/>

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