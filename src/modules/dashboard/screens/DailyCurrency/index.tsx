import {yupResolver} from '@hookform/resolvers/yup'
import {Exchange, Plus, SelectIcon} from 'assets/icons'
import {
	Button,
	Card,
	Form,
	Input,
	Modal,
	NumberFormattedInput,
	PageTitle,
	ReactTable,
	Select
} from 'components'
import {BUTTON_THEME, FIELD} from 'constants/fields'
import {currencyOptions} from 'constants/options'
import {useAdd, useData, usePaginatedData, usePagination, useSearchParams} from 'hooks'
import {dailyCurrencySchema, dailyCurrencySchema2} from 'modules/dashboard/helpers/yup'
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
	rate: '1'
}

const Index = () => {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {page, pageSize} = usePagination()
	const {
		addParams,
		removeParams,
		paramsObject: {modal = undefined}
	} = useSearchParams()


	const {data, isPending: isLoading, refetch} = usePaginatedData<IDailyCurrency[]>(`exchange-rates`)

	const {mutateAsync: addDailyCurrency, isPending: isAdding} = useAdd('exchange-rates/main')

	const {
		mutateAsync: updateDailyCurrency,
		isPending: isUpdating
	} = useAdd('exchange-rates/other')


	const {
		data: detail,
		isPending: isDetailLoading
	} = useData<{ rate: string }>('exchange-rates/main', modal == 'dailyCurrency')

	const {
		data: rateDetail,
		isPending: isRateDetailLoading
	} = useData<{ transfer_rate: string, p2p_rate: string }>('exchange-rates/other', modal == 'TRANSFER')


	const {
		handleSubmit: handleAddSubmit,
		reset: resetAdd,
		control: controlAdd,
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
		formState: {errors: editErrors}
	} = useForm<InferType<typeof dailyCurrencySchema2>>({
		mode: 'onTouched',
		defaultValues: {
			p2p_rate: '1',
			transfer_rate: '1'
		},
		resolver: yupResolver(dailyCurrencySchema2)
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
			}
		],
		[page, pageSize]
	)

	useEffect(() => {
		if (detail && !isDetailLoading) {
			resetAdd({
				rate: detail.rate
			})
		}
	}, [detail])

	useEffect(() => {
		if (rateDetail && !isRateDetailLoading) {
			resetEdit({
				transfer_rate: rateDetail.transfer_rate,
				p2p_rate: rateDetail.p2p_rate
			})
		}
	}, [rateDetail])

	return (
		<>
			<PageTitle title="Update currency">
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
					<div></div>
					<div className="flex justify-end gap-lg align-center">
						<Button
							icon={<Plus/>}
							onClick={() => addParams({modal: 'TRANSFER'})}
							theme={BUTTON_THEME.OUTLINE}
						>
							{`${t('Click')}/${t('Transfer')}`}
						</Button>
						<Button
							icon={<Plus/>}
							onClick={() => addParams({modal: 'dailyCurrency'})}
							theme={BUTTON_THEME.OUTLINE}
						>
							Update currency
						</Button>
						<Button
							onClick={() => navigate(`history`)}
							theme={BUTTON_THEME.PRIMARY}
							icon={<SelectIcon style={{transform: 'rotate(-90deg)'}}/>}
							iconPosition="right"
						>
							History
						</Button>
					</div>
				</div>
				<ReactTable columns={columns} data={data?.slice(0, 3)} isLoading={isLoading}/>
			</Card>

			<Modal title="Update currency" id="dailyCurrency" style={{height: '30rem', width: '60rem'}}>
				<Form
					onSubmit={handleAddSubmit((data) => {
							addDailyCurrency(data).then(async () => {
								// resetAdd()
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
								<Select
									id="base_currency"
									label="Currency"
									disabled={true}
									options={currencyOptions}
									value={getSelectValue(currencyOptions, 'USD')}
									defaultValue={getSelectValue(currencyOptions, 'USD')}
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
								<Select
									id="target_currency"
									label="Currency"
									disabled={true}
									options={currencyOptions}
									value={getSelectValue(currencyOptions, 'UZS')}
									defaultValue={getSelectValue(currencyOptions, 'UZS')}
								/>
							</div>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
						Save
					</Button>
				</Form>
			</Modal>

			<Modal title={`${t('Click')}/${t('Transfer')}`} style={{height: '30rem', width: '60rem'}} id="TRANSFER">
				<Form
					onSubmit={handleEditSubmit((data) => {
							updateDailyCurrency(data).then(async () => {
								// resetEdit()
								removeParams('modal')
								await refetch()
							})
						}
					)}
				>
					<div className="grid gap-lg">
						<div className="grid gap-lg span-5">
							<div className="span-4">
								<Controller
									control={controlEdit}
									name="p2p_rate"
									render={({field}) => (
										<NumberFormattedInput
											id="p2p_rate"
											maxLength={9}
											disableGroupSeparators={false}
											allowDecimals={true}
											label="Value"
											error={editErrors?.p2p_rate?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div className="span-8">
								<Select
									id="baseCurrencyEdit"
									label="Currency"
									options={currencyOptions}
									isDisabled={true}
									value={getSelectValue(currencyOptions, 'P2P')}
									defaultValue={getSelectValue(currencyOptions, 'P2P')}
								/>
							</div>
						</div>

						<div className="span-1 flex justify-center">
							<Exchange style={{transform: 'translateY(2.5rem)', height: '1.7rem'}}/>
						</div>

						<div className="grid gap-lg span-6">
							<div className="span-5">
								<Input
									label="Value"
									id="baseCurrencyEdit"
									placeholder=" "
									disabled={true}
									value="1"
								/>
							</div>
							<div className="span-7">
								<Select
									id="targetCurrencyEdit"
									label="Currency"
									options={currencyOptions}
									isDisabled={true}
									value={getSelectValue(currencyOptions, 'UZS')}
									defaultValue={getSelectValue(currencyOptions, 'UZS')}
								/>
							</div>
						</div>
						<div className="grid gap-lg span-5">
							<div className="span-4">
								<Controller
									control={controlEdit}
									name="transfer_rate"
									render={({field}) => (
										<NumberFormattedInput
											id="transfer_rate"
											maxLength={9}
											disableGroupSeparators={false}
											allowDecimals={true}
											label="Value"
											error={editErrors?.transfer_rate?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div className="span-8">
								<Select
									id="baseCurrencyEdit1"
									label="Currency"
									options={currencyOptions}
									isDisabled={true}
									value={getSelectValue(currencyOptions, 'TRANSFER')}
									defaultValue={getSelectValue(currencyOptions, 'TRANSFER')}
								/>
							</div>
						</div>

						<div className="span-1 flex justify-center">
							<Exchange style={{transform: 'translateY(2.5rem)', height: '1.7rem'}}/>
						</div>

						<div className="grid gap-lg span-6">
							<div className="span-5">
								<Input
									label="Value"
									id="baseCurrencyEdit1"
									placeholder=" "
									disabled={true}
									value="1"
								/>
							</div>
							<div className="span-7">
								<Select
									id="targetCurrencyEdit1"
									label="Currency"
									options={currencyOptions}
									isDisabled={true}
									value={getSelectValue(currencyOptions, 'UZS')}
									defaultValue={getSelectValue(currencyOptions, 'UZS')}
								/>
							</div>
						</div>
					</div>

					<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isUpdating}>
						Edit
					</Button>
				</Form>
			</Modal>
		</>
	)
}

export default Index