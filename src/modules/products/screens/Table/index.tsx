import {Box, Cart, Income, Plus} from 'assets/icons'
import {Button, HorizontalTab, PageTitle} from 'components'
import {BUTTON_THEME} from 'constants/fields'
import {useSearchParams} from 'hooks'
import {ISelectOption} from 'interfaces/form.interface'
import ProductWarehouse from 'modules/products/components/Warehouse'
import {useNavigate} from 'react-router-dom'


const tabOptions: ISelectOption[] = [
	{
		label: 'Product warehouse',
		value: 'productWarehouse',
		icon: <Cart/>
	},
	{
		label: 'Warehouse',
		value: 'warehouse',
		icon: <Box/>
	}
]

const Index = () => {
	const {paramsObject: {tab = tabOptions[0]?.value}, addParams} = useSearchParams()
	const navigate = useNavigate()

	return (
		<>
			<PageTitle title="Products">
				<div className="flex align-center gap-lg">
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Cart/>}
						onClick={() => navigate('exchange?tab=sale')}
					>
						Sale
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Income/>}
						onClick={() => navigate('exchange')}
					>
						Making income
					</Button>
					<Button
						icon={<Plus/>}
						onClick={() => addParams({modal: 'product'})}
					>
						Add a new product
					</Button>
				</div>
			</PageTitle>
			<HorizontalTab
				tabs={tabOptions}
				fallbackValue={tabOptions[0]?.value}
				style={{marginTop: '1rem', marginBottom: '1rem'}}
			/>
			{
				tab === 'productWarehouse' ? <ProductWarehouse/> :
					null
			}
		</>
	)
}

export default Index