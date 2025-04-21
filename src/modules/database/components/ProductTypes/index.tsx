import {Column} from 'react-table'
import {FIELD} from 'constants/fields'
import {useForm} from 'react-hook-form'
import {useEffect, useMemo} from 'react'
import {formatDate} from 'utilities/date'
import {Plus, Search} from 'assets/icons'
import {useTranslation} from 'react-i18next'
import {yupResolver} from '@hookform/resolvers/yup'
import {productTypeSchema} from 'modules/database/helpers/yup'
import {IProductTypeDetail} from 'modules/database/interfaces'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {
	HR,
	Card,
	Form,
	Input,
	Modal,
	Button,
	EditModal,
	Pagination,
	ReactTable,
	EditButton,
	DeleteModal,
	DeleteButton
} from 'components'
import {InferType} from 'yup'


const DEFAULT_FORM_VALUES = {
	name: ''
}

const ProductTypes = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()

	const {
		paramsObject: {updateId = undefined},
		addParams,
		removeParams
	} = useSearchParams()

	const {
		data,
		totalPages,
		isPending: isLoading,
		refetch
	} = usePaginatedData<IProductTypeDetail[]>('product-types', {
		page,
		page_size: pageSize
	})

	const {mutateAsync: addProductType, isPending: isAdding} = useAdd('product-types')
	const {mutateAsync: updateProductType, isPending: isUpdating} = useUpdate('product-types/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IProductTypeDetail>('product-types/', updateId)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		formState: {errors: addErrors}
	} = useForm<InferType<typeof productTypeSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(productTypeSchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		formState: {errors: editErrors}
	} = useForm<InferType<typeof productTypeSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(productTypeSchema)
	})

	const columns: Column<IProductTypeDetail>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: IProductTypeDetail, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: 'name'
			},
			// {
			// 	Header: t('Expiry deadline'),
			// 	accessor: (row) => row?.expiry ? t('Exist') : t('No')
			// },
			{
				Header: t('Date added'),
				accessor: row => formatDate(row.created_at)
			},
			{
				Header: t('Actions'),
				accessor: row => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DeleteButton id={row.id}/>
					</div>
				)
			}
		],
		[page, pageSize]
	)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit(detail)
		}
	}, [detail])

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input
						id="search"
						icon={<Search/>}
						placeholder="Search"
						radius
						style={{width: 400}}
					/>
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'product-types'})}>
						Add
					</Button>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="product-types" style={{height: '30rem'}}>
				<Form
					onSubmit={handleAddSubmit((formData: InferType<typeof productTypeSchema>) =>
						addProductType(formData).then(async () => {
							removeParams('modal')
							resetAdd(DEFAULT_FORM_VALUES)
							await refetch()
						})
					)}
				>
					<Input
						id="name"
						type={FIELD.TEXT}
						label="Name"
						error={addErrors?.name?.message}
						{...registerAdd('name')}
					/>
					{/*<div className="span-12">*/}
					{/*	<Checkbox*/}
					{/*		id="expiryAdd"*/}
					{/*		title="Is there expiry_date?"*/}
					{/*		{...registerAdd('expiry')}*/}
					{/*	/>*/}
					{/*</div>*/}
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '30rem'}}>
				<Form
					onSubmit={handleEditSubmit((formData: InferType<typeof productTypeSchema>) =>
						updateProductType(formData).then(async () => {
							removeParams('modal', 'updateId')
							resetEdit(DEFAULT_FORM_VALUES)
							await refetch()
						})
					)}
				>
					<Input
						id="name"
						type={FIELD.TEXT}
						label="Name"
						error={editErrors?.name?.message}
						{...registerEdit('name')}
					/>
					{/*<div className="span-12">*/}
					{/*	<Checkbox*/}
					{/*		id="expiryEdit"*/}
					{/*		title="Is there expiry_date?"*/}
					{/*		{...registerEdit('expiry')}*/}
					{/*	/>*/}
					{/*</div>*/}
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</EditModal>

			<DeleteModal endpoint="product-types/" onDelete={() => refetch()}/>
		</>
	)
}

export default ProductTypes
