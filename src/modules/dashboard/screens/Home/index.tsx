import {Cart, Currency, Income} from 'assets/icons'
import {Button, PageTitle} from 'components'
import {BUTTON_THEME} from 'constants/fields'
import {useNavigate} from 'react-router-dom'
import Cashier from 'modules/dashboard/components/Cashier'
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
						icon={<Income/>}
						onClick={() => navigate('product-exchange')}
					>
						Making income
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						onClick={() => navigate('product-exchange?tab=sale')}
						icon={<Cart/>}
					>
						Sale
					</Button>
				</div>
			</PageTitle>
			<div className="grid gap-lg">
				<Cashier className="span-3"/>
				<div className="span-9">
				</div>
				<Currencies className="span-3"/>
			</div>
		</>
	)
}

export default Index