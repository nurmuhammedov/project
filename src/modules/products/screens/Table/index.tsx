import {Box, Cart, Plus} from 'assets/icons'
import {Button, PageTitle} from 'components'
import {useSearchParams} from 'hooks'
import {ISelectOption} from 'interfaces/form.interface'
import ProductWarehouse from 'modules/products/components/Products'


const tabOptions: ISelectOption[] = [
	{
		label: 'Products',
		value: 'products',
		icon: <Cart/>
	},
	{
		label: 'Products',
		value: 'warehouse',
		icon: <Box/>
	}
]

const Index = () => {
	const {paramsObject: {tab = tabOptions[0]?.value}, addParams} = useSearchParams()

	return (
		<>
			<PageTitle title="Products">
				<div className="flex align-center gap-lg">
					<Button
						icon={<Plus/>}
						onClick={() => addParams({modal: 'product'})}
					>
						Add a new product
					</Button>
				</div>
			</PageTitle>
			{/*<HorizontalTab*/}
			{/*	tabs={tabOptions}*/}
			{/*	fallbackValue={tabOptions[0]?.value}*/}
			{/*	style={{marginTop: '1rem', marginBottom: '1rem'}}*/}
			{/*/>*/}
			{
				tab === 'products' ? <ProductWarehouse/> :
					null
			}
		</>
	)
}

export default Index