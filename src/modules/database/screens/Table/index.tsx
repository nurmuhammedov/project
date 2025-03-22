import MeasurementUnits from 'modules/database/components/MeasurementUnits'
import ProductTypes from 'modules/database/components/ProductTypes'
import ExpenseTypes from 'modules/database/components/ExpenseTypes'
import PriceTypes from 'modules/database/components/PriceTypes'
import Currencies from 'modules/database/components/Currencies'
import Countries from 'modules/database/components/Countries'
import {databaseTabs} from 'modules/database/helpers/options'
import Packages from 'modules/database/components/Packages'
import Brands from 'modules/database/components/Brands'
import {PageTitle, VerticalTab} from 'components'
import {useSearchParams} from 'hooks'


const Index = () => {
	const {paramsObject: {tab = databaseTabs[0]?.value}} = useSearchParams()

	return (
		<>
			<PageTitle title="Database"/>
			<div className="grid gap-md flex-1">
				<div className="span-3">
					<VerticalTab fallbackValue={databaseTabs[0]?.value} tabs={databaseTabs}/>
				</div>
				{
					tab === 'brands' ? <Brands/> :
						tab === 'countries' ? <Countries/> :
							tab === 'productTypes' ? <ProductTypes/> :
								tab === 'measurementUnits' ? <MeasurementUnits/> :
									tab === 'expenseTypes' ? <ExpenseTypes/> :
										tab === 'priceTypes' ? <PriceTypes/> :
											tab === 'packages' ? <Packages/> :
												tab === 'currencies' ? <Currencies/> :
													null

				}
			</div>
		</>
	)
}

export default Index