import {Cart, Currency, CurrencyExchange} from 'assets/icons'
import {Button, PageTitle} from 'components'
import {BUTTON_THEME} from 'constants/fields'
import {useNavigate} from 'react-router-dom'
import Currencies from 'modules/dashboard/components/Currencies'


const Index = () => {
	const navigate = useNavigate()
	return (
		<>
			<PageTitle title="Home">
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
						onClick={() => navigate('product-exchange?tab=sale')}
						icon={<Cart/>}
					>
						Product exchange
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<CurrencyExchange/>}
						onClick={() => navigate('daily-currency?modal=dailyCurrency')}
					>
						Update currency
					</Button>
				</div>
			</PageTitle>
			<div className="grid gap-lg">
				<Currencies className="span-3"/>
			</div>
		</>
	)
}

export default Index