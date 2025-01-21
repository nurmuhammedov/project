import {Loader} from 'components/index'
import classes from './styles.module.scss'
import {useTable, TableOptions, Column} from 'react-table'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'


interface ICustomProps {
	isLoading?: boolean;
	screen?: boolean;
	spacing?: boolean;
	className?: string;
	handleRow?: (id: string | number) => void;
}

// interface ICustomColumnProps {
// 	style?: CSSProperties;
// 	headerRowSpan?: number;
// }

interface ITableOptions<T extends object> extends TableOptions<T>, ICustomProps {
	columns: Column<T>[];
	data: T[];
}

const Index = <T extends object & { id: string | number }>({
	                                                           columns,
	                                                           data,
	                                                           isLoading,
	                                                           className,
	                                                           screen = true,
	                                                           spacing = true,
	                                                           handleRow
                                                           }: ITableOptions<T>) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable<T>({
		columns,
		data
	})

	const {t} = useTranslation()

	return (
		<div
			className={classNames(classes.root, className, {
				[classes.screen]: screen,
				[classes.loader]: isLoading,
				// [classes.spacing]: spacing,
				[classes.empty]: !(data && data.length)
			})}
		>
			<table {...getTableProps()}>
				<thead>
				{headerGroups.map((headerGroup, index) => (
					<tr {...headerGroup.getHeaderGroupProps()} className={classes.row} key={index}>
						{headerGroup.headers.map((column, index) => (
							<th
								{...column.getHeaderProps()}
								// style={{...column.style}}
								// rowSpan={column.headerRowSpan}
								key={index}
							>
								{column.render('Header')}
							</th>
						))}
					</tr>
				))}
				</thead>
				<tbody {...getTableBodyProps()}>
				{isLoading ? (
					<tr>
						<td colSpan={columns.length}>
							<Loader/>
						</td>
					</tr>
				) : data && data.length ? (
					<>
						{
							spacing &&
							<tr className={classes.spacing}>
								<td colSpan={columns.length}></td>
							</tr>
						}
						{
							rows.map((row, index) => {
								prepareRow(row)
								return (
									<tr
										onClick={() => handleRow?.(row.original.id)}
										className={classes.row}
										{...row.getRowProps()}
										key={index}
									>
										{row.cells.map((cell, index) => (
											<td
												{...cell.getCellProps()}
												// style={{...cell.column.style}}
												key={index}
											>
												{cell.render('Cell')}
											</td>
										))}
									</tr>
								)
							})
						}
					</>
				) : (
					<tr>
						<td colSpan={columns.length}>{t('Nothing found')}</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	)
}

export default Index