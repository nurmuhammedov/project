import {measurementUnits, measurementUnitTypes} from 'modules/database/helpers/options'
import {IMeasurementUnitDetail} from 'modules/database/interfaces'
import {Card, Input, ReactTable} from 'components'
import {useTranslation} from 'react-i18next'
import {Search} from 'assets/icons'
import {Column} from 'react-table'
import {useMemo} from 'react'


const Index = () => {
	const {t} = useTranslation()

	const columns: Column<IMeasurementUnitDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IMeasurementUnitDetail, index: number) => index + 1,
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Name'),
					accessor: row => t(row.name)
				},
				{
					Header: t('Label'),
					accessor: row => t(row.label)
				},
				{
					Header: t('Type'),
					accessor: row => t(measurementUnitTypes.find(i => i.value == row.type)?.label?.toString() ?? '')
				}
			],
		[]
	)

	return (
		<>
			<Card screen={true} className="span-9 gap-2xl">
				<div className="flex justify-between align-center">
					<Input
						id="search"
						icon={<Search/>}
						placeholder="Search"
						radius
						style={{width: 400}}
					/>
				</div>
				<ReactTable columns={columns} data={measurementUnits}/>
			</Card>
		</>
	)
}

export default Index
