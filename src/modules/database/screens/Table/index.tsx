import {PageTitle, VerticalTab} from 'components'
import {databaseTabOptions} from 'helpers/options'
import {useSearchParams} from 'hooks'
import Brands from 'modules/database/components/Brands'
import Countries from 'modules/database/components/Countries'
import Packages from 'modules/database/components/Packages'
import ProductTypes from 'modules/database/components/ProductTypes'
import MeasurementUnits from 'modules/database/components/MeasurementUnits'
import ExpenseTypes from 'modules/database/components/ExpenseTypes'
import PriceTypes from 'modules/database/components/PriceTypes'
import Currencies from 'modules/database/components/Currencies'


const Index = () => {
	const {paramsObject: {tab = databaseTabOptions[0]?.value}} = useSearchParams()

	return (
		<>
			<PageTitle title="Database"/>
			<div className="grid gap-md flex-1">
				<div className="span-3">
					<VerticalTab fallbackValue={databaseTabOptions[0]?.value} tabs={databaseTabOptions}/>
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