import {yupResolver} from '@hookform/resolvers/yup'
import {Exchange, Plus, Search} from 'assets/icons'
import {
	Button,
	Card,
	EditButton,
	EditModal,
	Form,
	HR,
	Input,
	Modal,
	NumberFormattedInput,
	PageTitle,
	Pagination,
	ReactTable,
	Select
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {useAdd, useData, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks/index'
import {ISelectOption} from 'interfaces/form.interface'
import {dailyCurrencySchema} from 'modules/dashboard/helpers/yup'
import {IDailyCurrency} from 'modules/dashboard/interfaces'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import {Column} from 'react-table'
import {decimalToPrice, getSelectValue} from 'utilities/common'
import {formatDate} from 'utilities/date'
import {InferType} from 'yup'


const DEFAULT_FORM_VALUES = {
	rate: '1',
	base_currency: undefined,
	target_currency: undefined
}

const Index = () => {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {page, pageSize} = usePagination()
	const {
		addParams,
		removeParams,
		paramsObject: {updateId = undefined, modal = undefined}
	} = useSearchParams()

	const {data: currencies = []} = useData<ISelectOption[]>('currencies/select', modal === 'dailyCurrency' || modal === 'edit')

	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IDailyCurrency[]>(
		`exchange-rate/histories`,
		{page: page, page_size: pageSize}
	)

	const {mutateAsync: addDailyCurrency, isPending: isAdding} = useAdd('exchange-rate/histories')
	const {
		mutateAsync: updateDailyCurrency,
		isPending: isUpdating
	} = useUpdate('exchange-rate/histories/', updateId)
	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IDailyCurrency>('exchange-rate/histories/', updateId)


	const {
		handleSubmit: handleAddSubmit,
		reset: resetAdd,
		control: controlAdd,
		watch: watchAdd,
		setValue: setValueAdd,
		formState: {errors: addErrors}
	} = useForm<InferType<typeof dailyCurrencySchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(dailyCurrencySchema)
	})

	const {
		handleSubmit: handleEditSubmit,
		reset: resetEdit,
		control: controlEdit,
		watch: watchEdit,
		setValue: setValueEdit,
		formState: {errors: editErrors}
	} = useForm<InferType<typeof dailyCurrencySchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
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
				Header: `1-${t('Currency')?.toLowerCase()}`,
				accessor: row => `${1} ${row.base_currency?.name?.toLowerCase()}`
			},
			// {
			// 	Header: t('Previous currency'),
			// 	accessor: row => `${decimalToPrice(row.previous || '0')}`
			// },
			{
				Header: `2-${t('Currency')?.toLowerCase()}`,
				accessor: row => `${decimalToPrice(row?.rate)} ${row.target_currency?.name?.toLowerCase()}`
			},
			{
				Header: t('Date'),
				accessor: row => formatDate(row.created_at)
			},
			{
				Header: t('Actions'),
				accessor: row => (
					<div className="flex items-start gap-lg">
						<EditButton id={row.id}/>
					</div>
				)
			}
		],
		[page, pageSize]
	)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetEdit({
				rate: detail.rate,
				base_currency: detail.base_currency?.id,
				target_currency: detail.target_currency?.id
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
				</div>
			</PageTitle>

			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input id="search" icon={<Search/>} placeholder="Search" radius={true} style={{width: 400}}/>
					<Button
						icon={<Plus/>}
						onClick={() => addParams({modal: 'dailyCurrency'})}
						theme={BUTTON_THEME.PRIMARY}
					>
						Update currency
					</Button>
				</div>
				<ReactTable columns={columns} data={data} isLoading={isLoading}/>
				<HR/>
				<Pagination totalPages={totalPages}/>
			</Card>

			<Modal title="Update currency" id="dailyCurrency" style={{height: '30rem', width: '60rem'}}>
				<Form
					onSubmit={handleAddSubmit((data) => {
							addDailyCurrency(data).then(async () => {
								resetAdd()
								removeParams('modal')
								await refetch()
							})
						}
					)}
				>
					<div className="grid gap-lg">
						<div className="grid gap-lg span-5">
							<div className="span-4">
								<Input
									label="Value"
									id="baseCurrency"
									placeholder=" "
									disabled={true}
									value="1"
								/>
							</div>
							<div className="span-8">
								<Controller
									name="base_currency"
									control={controlAdd}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="base_currency"
											label="Currency"
											options={currencies}
											onBlur={onBlur}
											error={addErrors.base_currency?.message}
											value={getSelectValue(currencies, value)}
											defaultValue={getSelectValue(currencies, value)}
											handleOnChange={(e) => {
												onChange(e as string)
												setValueAdd('target_currency', undefined as unknown as number)
											}}
										/>
									)}
								/>
							</div>

						</div>

						<div className="span-1 flex justify-center">
							<Exchange style={{transform: 'translateY(2.5rem)', height: '1.7rem'}}/>
						</div>

						<div className="grid gap-lg span-6">
							<div className="span-5">
								<Controller
									control={controlAdd}
									name="rate"
									render={({field}) => (
										<NumberFormattedInput
											id="rate"
											maxLength={9}
											disableGroupSeparators={false}
											allowDecimals={true}
											label="Value"
											error={addErrors?.rate?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div className="span-7">
								<Controller
									name="target_currency"
									control={controlAdd}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="target_currency"
											label="Currency"
											options={currencies?.filter(item => item?.value != watchAdd('base_currency'))}
											onBlur={onBlur}
											error={addErrors.target_currency?.message}
											value={getSelectValue(currencies, value)}
											defaultValue={getSelectValue(currencies, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<EditModal isLoading={isFetching || !detail} style={{height: '30rem', width: '60rem'}}>
				<Form
					onSubmit={handleEditSubmit((data) => {
							updateDailyCurrency(data).then(async () => {
								resetEdit()
								removeParams('modal', 'updateId')
								await refetch()
							})
						}
					)}
				>
					<div className="grid gap-lg">
						<div className="grid gap-lg span-5">
							<div className="span-4">
								<Input
									label="Value"
									id="baseCurrencyEdit"
									placeholder=" "
									disabled={true}
									value="1"
								/>
							</div>
							<div className="span-8">
								<Controller
									name="base_currency"
									control={controlEdit}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="baseCurrencyEdit"
											label="Currency"
											options={currencies}
											onBlur={onBlur}
											isDisabled={true}
											error={editErrors.base_currency?.message}
											value={getSelectValue(currencies, value)}
											defaultValue={getSelectValue(currencies, value)}
											handleOnChange={(e) => {
												onChange(e as string)
												setValueEdit('target_currency', undefined as unknown as number)
											}}
										/>
									)}
								/>
							</div>

						</div>

						<div className="span-1 flex justify-center">
							<Exchange style={{transform: 'translateY(2.5rem)', height: '1.7rem'}}/>
						</div>

						<div className="grid gap-lg span-6">
							<div className="span-5">
								<Controller
									control={controlEdit}
									name="rate"
									render={({field}) => (
										<NumberFormattedInput
											id="rateEdit"
											maxLength={9}
											disableGroupSeparators={false}
											allowDecimals={true}
											label="Value"
											disabled={true}
											error={editErrors?.rate?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div className="span-7">
								<Controller
									name="target_currency"
									control={controlEdit}
									render={({field: {value, ref, onChange, onBlur}}) => (
										<Select
											ref={ref}
											id="targetCurrencyEdit"
											label="Currency"
											options={currencies?.filter(item => item?.value != watchEdit('base_currency'))}
											onBlur={onBlur}
											isDisabled={true}
											error={editErrors.target_currency?.message}
											value={getSelectValue(currencies, value)}
											defaultValue={getSelectValue(currencies, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating || !!1}>
						Edit
					</Button>
				</Form>
			</EditModal>
		</>
	)
}

export default Index