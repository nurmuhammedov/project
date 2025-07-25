import {ICheckoutItem} from 'interfaces/dashboard.interface'
import styles from './styles.module.scss'
import {Card, CardTitle, Loader} from 'components'
import {CSSProperties, FC} from 'react'
import classNames from 'classnames'
import {useData} from 'hooks/index'
import {decimalToPrice, findName} from 'utilities/common'
import {currencyOptions} from 'constants/options'
import {useTranslation} from 'react-i18next'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const {data: currencies = [], isPending} = useData<ICheckoutItem[]>('stores/balances/summary')
	const {t} = useTranslation()

	return (
		<Card style={style} className={classNames(styles.root, className)}>
			<CardTitle title="Checkout"/>
			<div style={{marginTop: '1rem'}} className="flex flex-col gap-lg">
				<div className={styles['currencies-wrapper']}>
					{
						isPending ? <Loader/> : currencies?.map(item => {
							return (
								<div className={styles.currencies}>
									{decimalToPrice(item?.total_amount ?? '')}{' '}<span>{t(findName(currencyOptions, item.currency))?.toLowerCase()}</span>
								</div>
							)
						})
					}
				</div>
			</div>
		</Card>
	)
}

export default Index