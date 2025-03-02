import ExchangesHistory from 'modules/clients/components/ExchangesHistory'
import IncomesHistory from 'modules/clients/components/IncomesHistory'
import TradesHistory from 'modules/clients/components/SalesHistory'
import {Button, Loader, PageInfo, VerticalTab} from 'components'
import {IClientItemDetail} from 'interfaces/clients.interface'
import {ISelectOption} from 'interfaces/form.interface'
import {Cart, Currency, Income} from 'assets/icons'
import {useDetail, useSearchParams} from 'hooks'
import {BUTTON_THEME} from 'constants/fields'
import {useNavigate, useParams} from 'react-router-dom'


const tabOptions: ISelectOption[] = [
	{
		label: 'Incomes history',
		value: 'incomesHistory',
		icon: <Income/>
	},

	{
		label: 'Sales history',
		value: 'tradesHistory',
		icon: <Cart/>
	},
	{
		label: 'Exchanges history',
		value: 'exchangesHistory',
		icon: <Currency/>
	}
]

const Index = () => {
	const {id = undefined} = useParams()
	const {data: detail, isPending: isDetailLoading} = useDetail<IClientItemDetail>('customer/detail/', id)
	const {paramsObject: {tab = tabOptions[0]?.value}} = useSearchParams()
	const navigate = useNavigate()


	if (isDetailLoading) {
		return <Loader/>
	}

	return (
		<>
			<div className="flex align-center justify-between gap-lg" style={{marginBottom: '1.5rem'}}>
				<PageInfo
					type="user"
					title={detail?.full_name}
					subTitle={detail?.phone_number}
				/>
				<div className="flex align-center gap-lg">
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Currency/>}
						onClick={() => navigate('currency-exchange')}
					>
						Currency exchange
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Cart/>}
						onClick={() => navigate('product-exchange?tab=sale')}
					>
						Sale
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Income/>}
						onClick={() => navigate('product-exchange')}
					>
						Making income
					</Button>
				</div>
			</div>

			<div className="grid gap-md flex-1">
				<div className="span-3">
					<VerticalTab fallbackValue={tabOptions[0]?.value} tabs={tabOptions}/>
				</div>
				{
					tab === 'incomesHistory' ? <IncomesHistory/> :
						tab === 'tradesHistory' ? <TradesHistory/> :
							tab === 'exchangesHistory' ? <ExchangesHistory/> :
								null

				}
			</div>
		</>
	)
}

export default Index