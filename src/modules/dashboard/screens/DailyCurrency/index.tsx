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
import {currencyOptions} from 'helpers/options'
import {useAdd, useDetail, usePaginatedData, usePagination, useSearchParams, useUpdate} from 'hooks'
import {dailyCurrencySchema} from 'modules/dashboard/helpers/yup'
import {IDailyCurrency} from 'modules/dashboard/interfaces'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import {Column} from 'react-table'
import {decimalToPrice, findName, getSelectValue} from 'utilities/common'
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
		paramsObject: {updateId = undefined}
	} = useSearchParams()


	const {data, totalPages, isPending: isLoading, refetch} = usePaginatedData<IDailyCurrency[]>(`exchange-rates`)

	const {mutateAsync: addDailyCurrency, isPending: isAdding} = useAdd('exchange-rates')

	const {
		mutateAsync: updateDailyCurrency,
		isPending: isUpdating
	} = useUpdate('exchange-rates/', updateId, 'patch')

	const {
		data: detail,
		isPending: isDetailLoading,
		isFetching
	} = useDetail<IDailyCurrency>('exchange-rates/', updateId)


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
				accessor: row => `${1} ${t(findName(currencyOptions, row.base_currency))?.toLowerCase()}`
			},
			{
				Header: `2-${t('Currency')?.toLowerCase()}`,
				accessor: row => `${decimalToPrice(row?.rate)} ${t(findName(currencyOptions, row.target_currency))?.toLowerCase()}`
			},
			{
				Header: t('Date'),
				accessor: row => formatDate(row.updated_at)
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
				base_currency: detail.base_currency,
				target_currency: detail.target_currency
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
											options={currencyOptions}
											onBlur={onBlur}
											error={addErrors.base_currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => {
												onChange(e as string)
												setValueAdd('target_currency', undefined as unknown as string)
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
											options={currencyOptions?.filter(item => item?.value != watchAdd('base_currency'))}
											onBlur={onBlur}
											error={addErrors.target_currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
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
											options={currencyOptions}
											onBlur={onBlur}
											isDisabled={true}
											error={editErrors.base_currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => {
												onChange(e as string)
												setValueEdit('target_currency', undefined as unknown as string)
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
											options={currencyOptions?.filter(item => item?.value != watchEdit('base_currency'))}
											onBlur={onBlur}
											isDisabled={true}
											error={editErrors.target_currency?.message}
											value={getSelectValue(currencyOptions, value)}
											defaultValue={getSelectValue(currencyOptions, value)}
											handleOnChange={(e) => onChange(e as string)}
										/>
									)}
								/>
							</div>
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