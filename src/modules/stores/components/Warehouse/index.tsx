import {Search} from 'assets/icons'
import {
	Card,
	DetailButton,
	HR,
	Input,
	Pagination,
	ReactTable
} from 'components'
import {usePagination} from 'hooks'
import {IPackageItemDetail} from 'interfaces/database.interface'
import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {Column} from 'react-table'
import {formatDate} from 'utilities/date'


const Index = () => {
	const {t} = useTranslation()
	const {page, pageSize} = usePagination()


	const columns: Column<IPackageItemDetail>[] = useMemo(() =>
			[
				{
					Header: t('№'),
					accessor: (_: IPackageItemDetail, index: number) => ((page - 1) * pageSize) + (index + 1),
					style: {
						width: '3rem',
						textAlign: 'center'
					}
				},
				{
					Header: t('Name'),
					accessor: (row: IPackageItemDetail) => row.name
				},
				{
					Header: t('Time'),
					accessor: (row: IPackageItemDetail) => row.quantity
				},
				{
					Header: t('Brand'),
					accessor: (row: IPackageItemDetail) => `${row.amount} ${row.measure_name}`
				},
				{
					Header: t('Country'),
					accessor: (row: IPackageItemDetail) => `${row.amount} ${row.measure_name}`
				},
				{
					Header: t('Remainder'),
					accessor: (row: IPackageItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Measure unit'),
					accessor: (row: IPackageItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Barcode'),
					accessor: (row: IPackageItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Price'),
					accessor: (row: IPackageItemDetail) => formatDate(row.created_at)

				},
				{
					Header: t('Actions'),
					accessor: (row: IPackageItemDetail) => <div className="flex items-start gap-lg">
						<DetailButton id={row.id}/>
					</div>
				}
			],
		[t, page, pageSize]
	)


	return (
		<>
			<Card screen={true} className="span-9 gap-2xl flex-1">
				<div className="flex justify-between align-center">
					<Input
						id="search"
						icon={<Search/>}
						placeholder="Search"
						radius={true}
						style={{width: 400}}
					/>
				</div>
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={[]} isLoading={false}/>
					<HR/>
					<Pagination totalPages={1}/>
				</div>
			</Card>
		</>
	)
}

export default Index
