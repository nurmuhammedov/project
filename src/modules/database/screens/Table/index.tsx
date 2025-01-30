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


const Index = () => {
	const {paramsObject} = useSearchParams()
	const tab = paramsObject['tab'] || databaseTabOptions[0]?.value

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
							tab === 'productType' ? <ProductTypes/> :
								tab === 'measurementUnits' ? <MeasurementUnits/> :
									tab === 'expenseTypes' ? <ExpenseTypes/> :
										tab === 'priceTypes' ? <PriceTypes/> :
											tab === 'packages' ? <Packages/> :
												null

				}
			</div>
		</>
	)
}

export default Index