import {BUTTON_THEME} from 'constants/fields'
import ExchangesHistory from 'modules/clients/components/ExchangesHistory'
import {Button, Loader, PageInfo, VerticalTab} from 'components'
import {ISelectOption} from 'interfaces/form.interface'
import {Currency} from 'assets/icons'
import {useDetail, useSearchParams} from 'hooks'
import {ICustomerDetail} from 'modules/clients/interfaces'
import {useNavigate, useParams} from 'react-router-dom'


const tabOptions: ISelectOption[] = [
	{
		label: 'Exchanges history',
		value: 'exchangesHistory',
		icon: <Currency/>
	}
]

const Index = () => {
	const {id = undefined} = useParams()
	const navigate = useNavigate()
	const {data: detail, isPending: isDetailLoading} = useDetail<ICustomerDetail>('customers/', id)
	const {paramsObject: {tab = tabOptions[0]?.value}} = useSearchParams()


	if (isDetailLoading) {
		return <Loader/>
	}

	return (
		<>
			<div className="flex align-center justify-between gap-lg" style={{marginBottom: '1.5rem'}}>
				<PageInfo
					type="user"
					title={detail?.name}
					subTitle={detail?.phone_number}
				/>
				<div className="flex align-center gap-lg">
					<Button
						onClick={() => navigate(-1)}
						theme={BUTTON_THEME.DANGER_OUTLINE}
					>
						Back
					</Button>
				</div>
			</div>

			<div className="grid gap-md flex-1">
				<div className="span-3">
					<VerticalTab fallbackValue={tabOptions[0]?.value} tabs={tabOptions}/>
				</div>
				{
					tab === 'exchangesHistory' ? <ExchangesHistory/> :
						null

				}
			</div>
		</>
	)
}

export default Index