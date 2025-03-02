import {yupResolver} from '@hookform/resolvers/yup'
import {Plus, Search} from 'assets/icons'
import {
	Button,
	Card,
	DeleteButton,
	DeleteModal,
	EditButton,
	EditModal,
	HR,
	Input,
	Modal,
	Pagination,
	ReactTable,
	Form
} from 'components'
import {FIELD} from 'constants/fields'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {useForm} from 'react-hook-form'
import {useEffect, useMemo} from 'react'
import {Column} from 'react-table'
import {formatDate} from 'utilities/date'
import * as yup from 'yup'
import {ICurrencyItemDetail} from 'interfaces/database.interface'
import {useTranslation} from 'react-i18next'


const currencySchema = yup.object().shape({
	name: yup.string().trim().required('This field is required'),
	label: yup.string().trim().required('This field is required')
})

const Index = () => {
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
	} = usePaginatedData<ICurrencyItemDetail[]>('currency/', {
		page: page,
		page_size: pageSize
	})

	const {mutateAsync, isPending: isAdding} = useAdd('/currency/create/')

	const {data: detail, isPending: isDetailLoading, isFetching} = useDetail<ICurrencyItemDetail>('/currency/', updateId)

	const {mutateAsync: update, isPending: isUpdating} = useUpdate('/currency/update/', updateId)

	const columns: Column<ICurrencyItemDetail>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: ICurrencyItemDetail, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: (row: ICurrencyItemDetail) => row.name
			},
			{
				Header: t('Label'),
				accessor: (row: ICurrencyItemDetail) => row.label
			},
			{
				Header: t('Date added'),
				accessor: (row: ICurrencyItemDetail) => formatDate(row.created_at)
			},
			{
				Header: t('Actions'),
				accessor: (row: ICurrencyItemDetail) => (
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
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			name: '',
			label: ''
		},
		resolver: yupResolver(currencySchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			name: '',
			label: ''
		},
		resolver: yupResolver(currencySchema)
	})


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
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'currencies'})}>
						Add
					</Button>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal title="Add new" id="currencies" style={{height: '30rem'}}>
				<Form
					onSubmit={handleAddSubmit((formData) =>
						mutateAsync(formData).then(async () => {
							resetAdd()
							removeParams('modal')
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

					<Input
						id="label"
						type={FIELD.TEXT}
						label="Label"
						error={addErrors?.label?.message}
						{...registerAdd('label')}
					/>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '30rem'}}>
				<Form
					onSubmit={handleEditSubmit((formData) =>
						update(formData).then(async () => {
							resetEdit()
							removeParams('modal', 'updateId')
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

					<Input
						id="label"
						type={FIELD.TEXT}
						label="Label"
						error={editErrors?.label?.message}
						{...registerEdit('label')}
					/>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</EditModal>

			<DeleteModal endpoint="/currency/delete/" onDelete={() => refetch()}/>
		</>
	)
}

export default Index