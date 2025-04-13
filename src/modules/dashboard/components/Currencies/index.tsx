import {IDailyCurrency} from 'modules/dashboard/interfaces'
import styles from './styles.module.scss'
import {Card, CardTitle, Loader} from 'components'
import {CSSProperties, FC} from 'react'
import classNames from 'classnames'
import {useData} from 'hooks/index'
import {decimalToPrice} from 'utilities/common'
import {useNavigate} from 'react-router-dom'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const {data: currencies = [], isPending} = useData<IDailyCurrency[]>('exchange-rate/actual')
	const navigate = useNavigate()

	return (
		<Card style={style} className={classNames(styles.root, className)}>
			<CardTitle
				title="Exchange rate"
				subTitle="Exchange rate history"
				onClick={() => navigate(`daily-currency`)}
			/>
			<div style={{marginTop: '2.12rem'}} className="flex flex-col gap-lg">
				<div className={styles['currencies-wrapper']}>
					{
						isPending ? <Loader/> : currencies?.map(item => {
							return (
								<div className={styles.wrapper}>
									<div className={styles.name}>
										1 {item.base_currency?.toLowerCase() ?? ''}
									</div>
									<div className={styles.currencies}>
										<p>{decimalToPrice(item?.rate ?? '')}</p>
										<span>{item?.target_currency}</span>
									</div>
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