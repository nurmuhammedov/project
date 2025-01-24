import {yupResolver} from '@hookform/resolvers/yup'
import {Plus, Search} from 'assets/icons'
import {Button, Card, DeleteButton, DeleteModal, HR, Input, Modal, Pagination, ReactTable} from 'components/index'
import {FIELD} from 'constants/fields'
import {databaseTableHeader} from 'helpers/headers'
import {databaseSchema} from 'helpers/yup'
import {useAdd, usePaginatedData, usePagination, useSearchParams} from 'hooks/index'
import {IDatabaseItemDetail} from 'interfaces/database.interface'
import {useMemo} from 'react'
import {useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()
	const {addParams, removeParams} = useSearchParams()

	const {data, totalPages, isPending, refetch} = usePaginatedData<IDatabaseItemDetail[]>(
		'countries',
		{
			page: page,
			page_size: pageSize
		}
	)

	const columns: Column<IDatabaseItemDetail>[] = useMemo(() =>
			[
				...databaseTableHeader(t, page, pageSize),
				{
					Header: t('Actions'),
					accessor: (row: IDatabaseItemDetail) => <DeleteButton id={row.id}/>
				}
			],
		[t, page, pageSize]
	)


	const {
		handleSubmit,
		register,
		reset,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			name: ''
		},
		resolver: yupResolver(databaseSchema)
	})

	const {mutateAsync, isPending: IsLoading} = useAdd('countries')


	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between items-center">
					<Input
						id="search"
						icon={<Search/>}
						placeholder="Search"
						radius={true}
						style={{width: 400}}
					/>
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'brands'})}>
						Add
					</Button>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isPending}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>
			<Modal title="Add new" id="brands" styles={{height: '20rem'}}>
				<Input
					id="name"
					type={FIELD.TEXT}
					label="Name"
					placeholder="Enter name"
					error={errors?.name?.message}
					{...register('name')}
				/>
				<Button
					style={{marginTop: 'auto'}}
					disabled={IsLoading}
					onClick={handleSubmit((data) => mutateAsync(data).then(async () => {
						reset()
						removeParams('modal', 'page', 'limit')
						await refetch()
					}))}
				>
					Save
				</Button>
			</Modal>
			<DeleteModal endpoint="countries/" onDelete={() => refetch()}/>
		</>
	)
}

export default Index