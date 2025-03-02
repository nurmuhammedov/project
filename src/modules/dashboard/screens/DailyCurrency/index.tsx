import {yupResolver} from '@hookform/resolvers/yup'
import {Plus, Search} from 'assets/icons'
import {
	Button,
	Card,
	EditButton,
	EditModal,
	HR,
	Input,
	MaskInput,
	Modal,
	Pagination,
	ReactTable,
	Form,
	Select,
	PageTitle,
	NumberFormattedInput
} from 'components/index'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {
	useAdd, useData,
	useDetail,
	usePaginatedData,
	usePagination,
	useSearchParams,
	useUpdate
} from 'hooks/index'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {dailyCurrencySchema} from 'helpers/yup'
import {decimalToPrice, getSelectValue} from 'utilities/common'
import {getSelectOptions} from 'utilities/select'
import {IIDName} from 'interfaces/configuration.interface'
import {formatDate, getDate} from 'utilities/date'
import {IDailyCurrency} from 'interfaces/dashboard.interface'
import {useNavigate} from 'react-router-dom'


const Index = () => {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {page, pageSize} = usePagination()
	const {
		addParams,
		removeParams,
		paramsObject: {updateId = undefined, modal = undefined}
	} = useSearchParams()

	const {data: currencies = []} = useData<IIDName[]>('currency/select/', modal === 'dailyCurrency' || modal === 'edit')

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IDailyCurrency[]>(
		`currency/daily/`,
		{page: page, page_size: pageSize}
	)

	const {
		handleSubmit: handleAddSubmit,
		reset: resetAdd,
		control: controlAdd,
		formState: {errors: addErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			summa: '',
			datetime: getDate(),
			currency_id: undefined
		},
		resolver: yupResolver(dailyCurrencySchema)
	})

	const columns: Column<IDailyCurrency>[] = useMemo(
		() => [
			{
				Header: t('№'),
				accessor: (_: IDailyCurrency, index: number) => (page - 1) * pageSize + (index + 1),
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Currency'),
				accessor: (row: IDailyCurrency) => row.currency?.name
			},
			{
				Header: t('Previous currency'),
				accessor: (row: IDailyCurrency) => `${decimalToPrice(row.previous || '0')} so‘m`
			},
			{
				Header: t('New currency'),
				accessor: (row: IDailyCurrency) => `${decimalToPrice(row.summa || '0')} so‘m`
			},
			{
				Header: t('Date'),
				accessor: (row: IDailyCurrency) => formatDate(row.datetime)
			},
			{
				Header: t('Actions'),
				accessor: (row: IDailyCurrency) => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
					</div>
				)
			}
		],
		[t, page, pageSize]
	)

	const {
		handleSubmit: handleEditSubmit,
		reset: resetEdit,
		control: controlEdit,
		formState: {errors: editErrors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			summa: '',
			datetime: getDate(),
			currency_id: undefined
		},
		resolver: yupResolver(dailyCurrencySchema)
	})

	const {mutateAsync, isPending: isAdding} = useAdd('currency/daily/create/')
	const {mutateAsync: update, isPending: isUpdating} = useUpdate('currency/daily/update/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IDailyCurrency>('currency/daily/', updateId)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({
				summa: detail.summa,
				datetime: getDate(detail.datetime),
				currency_id: detail.currency?.id as number
			})
		}
	}, [detail])

	return (
		<>
			<PageTitle title="Exchange rate history">
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
					<Button
						icon={<Plus/>}
						onClick={() => addParams({modal: 'dailyCurrency'})}
						theme={BUTTON_THEME.PRIMARY}
					>
						Update currency
					</Button>
				</div>
			</PageTitle>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input id="search" icon={<Search/>} placeholder="Search" radius={true} style={{width: 400}}/>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal title="Update currency" id="dailyCurrency" style={{height: '40rem', width: '60rem'}}>
				<Form
					onSubmit={handleAddSubmit((data) => {
							const {datetime, ...newData} = data
							console.log(datetime)
							mutateAsync(newData).then(async () => {
								resetAdd()
								removeParams('modal')
								await refetch()
							})
						}
					)}
				>
					<div className="grid gap-lg">
						<div className="span-6">
							<Controller
								name="currency_id"
								control={controlAdd}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="currency_id"
										label="Currency"
										options={getSelectOptions(currencies)}
										onBlur={onBlur}
										error={addErrors.currency_id?.message}
										value={getSelectValue(getSelectOptions(currencies), value)}
										defaultValue={getSelectValue(getSelectOptions(currencies), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="datetime"
								control={controlAdd}
								render={({field}) => (
									<MaskInput
										id="datetime"
										label="Date"
										placeholder={getDate()}
										disabled={true}
										mask="99.99.9999"
										error={addErrors?.datetime?.message}
										{...field}
									/>
								)}
							/>
						</div>

						<div className="span-12">
							<Controller
								control={controlAdd}
								name="summa"
								render={({field}) => (
									<NumberFormattedInput
										id="summa"
										maxLength={12}
										disableGroupSeparators={false}
										allowDecimals={true}
										label="Price"
										error={addErrors?.summa?.message}
										{...field}
									/>
								)}
							/>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '40rem', width: '60rem'}}>
				<Form
					onSubmit={handleEditSubmit((data) => {
							const {datetime, ...newData} = data
							console.log(datetime)
							update(newData).then(async () => {
								resetEdit()
								removeParams('modal', 'updateId')
								await refetch()
							})
						}
					)}
				>
					<div className="grid gap-lg">
						<div className="span-6">
							<Controller
								name="currency_id"
								control={controlEdit}
								render={({field: {value, ref, onChange, onBlur}}) => (
									<Select
										ref={ref}
										id="currency_id"
										label="Currency"
										isDisabled={true}
										options={getSelectOptions(currencies)}
										onBlur={onBlur}
										error={editErrors.currency_id?.message}
										value={getSelectValue(getSelectOptions(currencies), value)}
										defaultValue={getSelectValue(getSelectOptions(currencies), value)}
										handleOnChange={(e) => onChange(e as string)}
									/>
								)}
							/>
						</div>

						<div className="span-6">
							<Controller
								name="datetime"
								control={controlEdit}
								render={({field}) => (
									<MaskInput
										id="datetime"
										label="Date"
										disabled={true}
										placeholder={getDate()}
										mask="99.99.9999"
										error={editErrors?.datetime?.message}
										{...field}
									/>
								)}
							/>
						</div>

						<div className="span-12">
							<Controller
								control={controlEdit}
								name="summa"
								render={({field}) => (
									<NumberFormattedInput
										id="summa"
										maxLength={12}
										disableGroupSeparators={false}
										allowDecimals={true}
										label="Price"
										error={editErrors?.summa?.message}
										{...field}
									/>
								)}
							/>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</EditModal>
		</>
	)
}

export default Index