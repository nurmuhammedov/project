import {Cart, Income} from 'assets/icons'
import {Button, Card, PageTitle, Pagination} from 'components'
import ReactTable from 'components/ReactTable'
import {BUTTON_THEME} from 'constants/fields'


const Index = () => {
	return (
		<>
			<PageTitle title="Home">
				<div className="flex align-center gap-lg">
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Cart/>}
					>
						Making trade
					</Button>
					<Button
						theme={BUTTON_THEME.DANGER_OUTLINE}
						icon={<Income/>}
					>
						Making income
					</Button>
				</div>
			</PageTitle>
			<Card className="gap-2xl" screen={true}>
				<ReactTable
					screen={true}
					columns={[]}
					data={[]}
				/>
				<Pagination totalPages={100}/>
			</Card>
		</>
	)
}

export default Index