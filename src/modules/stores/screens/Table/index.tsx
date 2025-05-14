import {Column} from 'react-table'
import {FIELD} from 'constants/fields'
import {useEffect, useMemo} from 'react'
import {formatDate} from 'utilities/date'
import {Plus, Search} from 'assets/icons'
import {useTranslation} from 'react-i18next'
import {getSelectValue} from 'utilities/common'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm, Controller} from 'react-hook-form'
import {storeSchema} from 'modules/stores/helpers/yup'
import {IStoreDetail} from 'modules/stores/interfaces'
import {storeTypes} from 'modules/stores/helpers/options'
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
	// DetailButton,
	Select,
	PageTitle,
    DetailButton
} from 'components'
import {InferType} from 'yup'


const DEFAULT_FORM_VALUES = {
	name: '',
	exchange_type: undefined
}

const Stores = () => {
	const {page, pageSize} = usePagination()
	const {t} = useTranslation()
	// const {setStore} = useActions()
	const {
		paramsObject: {updateId = undefined, modal = undefined},
		addParams,
		removeParams
	} = useSearchParams()

	const {
		data,
		totalPages,
		isPending: isLoading,
		refetch
	} = usePaginatedData<IStoreDetail[]>('stores', {
		page,
		page_size: pageSize
	})

	const {mutateAsync: addStore, isPending: isAdding} = useAdd('stores')
	const {mutateAsync: updateStore, isPending: isUpdating} = useUpdate('stores/', updateId)

	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IStoreDetail>('stores/', updateId)

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		setFocus,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm<InferType<typeof storeSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(storeSchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		register: registerEdit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm<InferType<typeof storeSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(storeSchema)
	})

	// const setBaseStore = (id: number) => {
	// 	setLoader(true)
	// 	if (!loader) {
	// 		interceptor
	// 			.post(`stores/${id}/set-main`)
	// 			.then(async () => {
	// 				setStore(Number(id))
	// 				showMessage('Successful', 'success')
	// 				await refetch()
	// 			})
	// 			.finally(async () => {
	// 				setLoader(false)
	// 			})
	// 	}
	// }

	const columns: Column<IStoreDetail>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_: IStoreDetail, index: number) => (page - 1) * pageSize + (index + 1),
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
			// 	Header: t('Main'),
			// 	accessor: row => <div>
			// 		<Checkbox
			// 			id={row.id as unknown as string}
			// 			checked={row?.is_main}
			// 			disabled={row?.is_main || loader}
			// 			onChange={e => {
			// 				if (e.target.checked && !loader) {
			// 					setBaseStore(row.id)
			// 				}
			// 			}}
			// 		/>
			// 	</div>
			// },
			{
				Header: t('Type'),
				accessor: row => t(storeTypes.find(i => i.value == row.exchange_type)?.label?.toString() ?? '')
			},
			{
				Header: t('Date added'),
				accessor: row => formatDate(row.created_at)
			},
			{
				Header: t('Actions'),
				accessor: row => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
						<DetailButton id={row.id}/>
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

	useEffect(() => {
		if (modal == 'store') {
			setTimeout(() => {
				setFocus('name')
			}, 0)
		}
	}, [modal])

	return (
		<>
			<PageTitle title="Stores">
				<div className="flex align-center gap-lg">
					<Button icon={<Plus/>} onClick={() => addParams({modal: 'store'})}>Add a new store</Button>
				</div>
			</PageTitle>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input id="search" icon={<Search/>} placeholder="Search" radius style={{width: 400}}/>
				</div>

				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={data} isLoading={isLoading}/>
					<HR/>
					<Pagination totalPages={totalPages}/>
				</div>
			</Card>

			<Modal
				onClose={() => {
					resetAdd(DEFAULT_FORM_VALUES)
					removeParams('modal')
				}}
				title="Add a new store"
				id="store"
				style={{height: '35rem'}}
			>
				<Form
					onSubmit={handleAddSubmit((formData) =>
						addStore(formData).then(async () => {
							// removeParams('modal')
							setTimeout(() => {
								setFocus('name')
							}, 0)
							resetAdd(DEFAULT_FORM_VALUES)
							await refetch()
						})
					)}
				>
					<div className="grid span-12 gap-lg">
						<div className="span-6">
							<Input
								id="name"
								type={FIELD.TEXT}
								label="Name"
								error={addErrors?.name?.message}
								{...registerAdd('name')}
							/>
						</div>
						<div className="span-6">
							<Controller
								name="exchange_type"
								control={controlAdd}
								render={({field}) => (
									<Select
										id="exchangeType"
										options={storeTypes}
										label="Type"
										error={addErrors?.exchange_type?.message}
										value={getSelectValue(storeTypes, field.value)}
										handleOnChange={field.onChange}
									/>
								)}
							/>
						</div>
					</div>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>Save</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '35rem'}}>
				<Form
					onSubmit={handleEditSubmit((formData) =>
						updateStore(formData).then(async () => {
							removeParams('modal', 'updateId')
							resetEdit(DEFAULT_FORM_VALUES)
							await refetch()
						})
					)}
				>
					<div className="grid span-12 gap-lg">
						<div className="span-6">
							<Input
								id="name"
								type={FIELD.TEXT}
								label="Name"
								error={editErrors?.name?.message}
								{...registerEdit('name')}
							/>
						</div>
						<div className="span-6">
							<Controller
								name="exchange_type"
								control={controlEdit}
								render={({field}) => (
									<Select
										id="exchangeType"
										options={storeTypes}
										label="Type"
										error={editErrors?.exchange_type?.message}
										value={getSelectValue(storeTypes, field.value)}
										handleOnChange={field.onChange}
									/>
								)}
							/>
						</div>
					</div>
					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>Edit</Button>
				</Form>
			</EditModal>
		</>
	)
}

export default Stores