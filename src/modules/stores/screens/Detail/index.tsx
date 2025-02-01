import {Box, Cart, Currency, Status, Store} from 'assets/icons'
import {Button, PageInfo, Select} from 'components'
import HorizontalTab from 'components/HorizontalTab'
import {BUTTON_THEME} from 'constants/fields'
import {useSearchParams} from 'hooks'
import {ISelectOption} from 'interfaces/form.interface'
import {getSelectValue} from 'utilities/common'


const tabOptions: ISelectOption[] = [
	{
		label: 'Sales history',
		value: 'salesHistory',
		icon: <Cart/>
	},
	{
		label: 'Warehouse',
		value: 'warehouse',
		icon: <Box/>
	},
	{
		label: 'Employees',
		value: 'employees',
		icon: <Status/>
	}
]

const Index = () => {
	const {paramsObject: {tab = tabOptions[0]?.value}} = useSearchParams()

	console.log(tab)
	return (
		<>
			<div className="flex align-center justify-between gap-lg">
				<PageInfo title="Stroes" subTitle="0.5 L" icon={<Store/>}/>
				<div className="flex align-center gap-lg">
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Currency/>}
					>
						Currency exchange
					</Button>
				</div>
			</div>

			<div className="flex align-center" style={{marginTop: '2.25rem', gap: '2.25rem'}}>
				<div className="flex-1">
					<Select
						id="clients"
						options={[]}
						label="Clients"
						value={getSelectValue([], undefined)}
						defaultValue={getSelectValue([], undefined)}
						handleOnChange={(e) => console.log(e as string)}
					/>
				</div>
				<div className="flex-1">
					<Select
						id="priceType"
						options={[]}
						label="Price type"
						value={getSelectValue([], undefined)}
						defaultValue={getSelectValue([], undefined)}
						handleOnChange={(e) => console.log(e as string)}
					/>
				</div>
			</div>


			<HorizontalTab fallbackValue={tabOptions[0]?.value} tabs={tabOptions} style={{marginTop: '2.25rem'}}/>

			{/*<PageTitle title="Database"/>*/
			}
			{/*<div className="grid gap-md flex-1">*/
			}
			{/*	<div className="span-3">*/
			}
			{/*		<VerticalTab fallbackValue={databaseTabOptions[0]?.value} tabs={databaseTabOptions}/>*/
			}
			{/*	</div>*/
			}
			{/*	{*/
			}
			{/*		tab === 'brands' ? <Brands/> :*/
			}
			{/*			tab === 'countries' ? <Countries/> :*/
			}
			{/*				tab === 'productType' ? <ProductTypes/> :*/
			}
			{/*					tab === 'measurementUnits' ? <MeasurementUnits/> :*/
			}
			{/*						tab === 'expenseTypes' ? <ExpenseTypes/> :*/
			}
			{/*							tab === 'priceTypes' ? <PriceTypes/> :*/
			}
			{/*								tab === 'packages' ? <Packages/> :*/
			}
			{/*									null*/
			}

			{/*	}*/
			}
			{/*</div>*/
			}
		</>
	)
}

export default Index