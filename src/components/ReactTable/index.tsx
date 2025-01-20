// import {Loader} from 'components/index'
// import classes from './styles.module.scss'
// import {TableOptions, useTable} from 'react-table'
// import classNames from 'classnames'
// import {useTranslation} from 'react-i18next'
//
//
// const Index = <T extends object & { id: string }>({
// 	                                                  columns,
// 	                                                  data,
// 	                                                  isLoading,
// 	                                                  className,
// 	                                                  screen = true,
// 	                                                  handleRow
//                                                   }: TableOptions<T>) => {
//
// 	const {
// 		getTableProps,
// 		getTableBodyProps,
// 		headerGroups,
// 		rows,
// 		prepareRow
// 	} = useTable({
// 		columns,
// 		data
// 	})
//
// 	const {t} = useTranslation()
//
// 	return (
// 		<div className={classNames(classes.root, className, {
// 			[classes.screen]: screen,
// 			[classes.loader]: isLoading,
// 			[classes.empty]: !(data && data.length)
// 		})}>
// 			<table {...getTableProps()} >
// 				<thead>
// 				{
// 					headerGroups.map((headerGroup, index) => (
// 						<tr {...headerGroup.getHeaderGroupProps()} className={classes.row} key={index}>
// 							{
// 								headerGroup.headers.map((column, index) => (
// 									<th
// 										{...column.getHeaderProps()}
// 										style={{...column.style}}
// 										rowSpan={column.headerRowSpan}
// 										key={index}
// 									>
// 										{column.render('Header')}
// 									</th>
// 								))
// 							}
// 						</tr>
// 					))
// 				}
// 				</thead>
// 				<tbody {...getTableBodyProps()}>
// 				{
// 					isLoading ?
// 						<tr>
// 							<td colSpan={columns.length}>
// 								<Loader/>
// 							</td>
// 						</tr>
// 						:
// 						<>
// 							{
// 								data && data.length ?
// 									<>
// 										{
// 											rows.map(
// 												(row, index) => {
// 													prepareRow(row)
// 													return (
// 														<tr
// 															onClick={() => handleRow?.(row.original.id)}
// 															className={classes.row}
// 															{...row.getRowProps()}
// 															key={index}
// 														>
// 															{
// 																row.cells.map((cell, index) => {
// 																		return (
// 																			<td
// 																				{...cell.getCellProps([])}
// 																				style={{...cell.column.style}}
// 																				key={index}
// 																			>
// 																				{cell.render('Cell')}
// 																			</td>
// 																		)
// 																	}
// 																)
// 															}
// 														</tr>
// 													)
// 												}
// 											)
// 										}
// 									</> :
// 									<tr>
// 										<td colSpan={columns.length}>
// 											{t('Nothing found')}
// 										</td>
// 									</tr>
// 							}
// 						</>
// 				}
// 				</tbody>
// 			</table>
// 		</div>
// 	)
// }
//
// export default Index


const Index = () => {
	return (
		<div>

		</div>
	)
}

export default Index