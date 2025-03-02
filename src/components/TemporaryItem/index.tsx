import styles from './styles.module.scss'
import {Delete, Detail, Product} from 'assets/icons'
import {FC} from 'react'
import {decimalToInteger, decimalToPrice} from 'utilities/common'
import {getDate} from 'utilities/date'
import classNames from 'classnames'


interface IProperties {
	name?: string
	price?: string
	quantity?: string
	integer?: boolean
	currency?: string
	measure?: string
	expiry?: string
	handleDelete?: () => void
	handleDetail?: () => void
}

const Index: FC<IProperties> = ({
	                                name = '',
	                                price = '0',
	                                integer = false,
	                                quantity = '0',
	                                currency = '',
	                                measure = '',
	                                handleDelete,
	                                handleDetail,
	                                expiry = ''
                                }) => {
	return (
		<div
			className={classNames(styles.root, {[styles.delete]: handleDelete, [styles.detail]: handleDetail})}
		>
			<div className={styles.wrapper}>
				<div className="flex align-center justify-start gap-md">
					<div className={styles.img}>
						<Product/>
					</div>
					<div className="flex align-start items-center flex-col">
						<div className={styles.title}>
							{name}
						</div>
						{
							expiry &&
							<div className={styles['sub-title']}>
								{getDate(expiry)}
							</div>
						}
					</div>
				</div>

				<div className="flex align-end items-center flex-col">
					<div className={styles.title}>
						{decimalToPrice(price)} {currency}
					</div>
					<div className={styles['sub-title']}>
						{integer ? decimalToInteger(quantity) : decimalToPrice(quantity)} {measure}
					</div>
				</div>
			</div>
			{
				handleDelete &&
				<div className={styles['delete-wrapper']} onClick={() => handleDelete?.()}>
					<Delete/>
				</div>
			}
			{
				handleDetail &&
				<div className={styles['detail-wrapper']} onClick={() => handleDetail?.()}>
					<Detail/>
				</div>
			}
		</div>
	)
}

export default Index