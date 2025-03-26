import SalesHistory from 'modules/stores/components/SalesHistory'
import Employees from 'modules/stores/components/Employees'
import {Loader, PageInfo, HorizontalTab} from 'components'
import Warehouse from 'modules/stores/components/Warehouse'
import {storeTypes} from 'modules/stores/helpers/options'
import {ISelectOption} from 'interfaces/form.interface'
import {IStoreDetail} from 'modules/stores/interfaces'
import {useDetail, useSearchParams} from 'hooks'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import {Status, Store} from 'assets/icons'


const tabOptions: ISelectOption[] = [
	// {
	// 	label: 'Sales history',
	// 	value: 'salesHistory',
	// 	icon: <Cart/>
	// },
	// {
	// 	label: 'Warehouse',
	// 	value: 'warehouse',
	// 	icon: <Box/>
	// },
	{
		label: 'Employees',
		value: 'employees',
		icon: <Status/>
	}
]

const Index = () => {
	const {id = undefined} = useParams()
	const {t} = useTranslation()
	const {paramsObject: {tab = tabOptions[0]?.value}} = useSearchParams()
	const {data: detail, isPending: isDetailLoading} = useDetail<IStoreDetail>('stores/', id)


	if (isDetailLoading) {
		return <Loader/>
	}

	return (
		<>
			<div className="flex align-center justify-between gap-lg">
				<PageInfo
					title={detail?.name}
					subTitle={t(storeTypes.find(i => i.value == detail?.exchange_type)?.label?.toString() ?? '')}
					icon={<Store/>}
				/>
			</div>

			<HorizontalTab
				tabs={tabOptions}
				fallbackValue={tabOptions[0]?.value}
				style={{marginTop: '2.25rem', marginBottom: '0.75rem'}}
			/>
			{
				tab === 'salesHistory' ? <SalesHistory/> :
					tab === 'warehouse' ? <Warehouse/> :
						tab === 'employees' ? <Employees/> :
							null

			}
		</>
	)
}

export default Index