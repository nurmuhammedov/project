import {Search} from 'assets/icons'
import {ISelectOption} from 'interfaces/form.interface'
import {currencyOptions} from 'helpers/options'
import {useTranslation} from 'react-i18next'
import {Card, Input, ReactTable} from 'components'
import {Column} from 'react-table'
import {useMemo} from 'react'


const Currencies = () => {
	const {t} = useTranslation()

	const columns: Column<ISelectOption>[] = useMemo(
		() => [
			{
				Header: '№',
				accessor: (_, index: number) => index + 1,
				style: {
					width: '3rem',
					textAlign: 'center'
				}
			},
			{
				Header: t('Name'),
				accessor: (row) => t(row.label as unknown as string)
			},
			{
				Header: t('Label'),
				accessor: (row) => t(row.code as unknown as string)
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
				<div className="flex flex-col gap-md flex-1">
					<ReactTable columns={columns} data={currencyOptions}/>
				</div>
			</Card>
		</>
	)
}

export default Currencies