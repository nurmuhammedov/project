import {IDailyCurrency} from 'modules/dashboard/interfaces'
import styles from './styles.module.scss'
import {Card, CardTitle, Loader} from 'components'
import {CSSProperties, FC} from 'react'
import classNames from 'classnames'
import {useData} from 'hooks/index'
import {decimalToPrice, findName} from 'utilities/common'
import {useNavigate} from 'react-router-dom'
import {currencyOptions} from 'constants/options'
import {useTranslation} from 'react-i18next'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const {data: currencies = [], isPending} = useData<IDailyCurrency[]>('exchange-rates')
	const navigate = useNavigate()
	const {t} = useTranslation()

	return (
		<Card style={style} className={classNames(styles.root, className)}>
			<CardTitle
				title="Exchange rate"
				subTitle="Exchange rate history"
				onClick={() => navigate(`daily-currency/history`)}
			/>
			<div style={{marginTop: '2.12rem'}} className="flex flex-col gap-lg">
				<div className={styles['currencies-wrapper']}>
					{
						isPending ? <Loader/> : currencies?.slice(0, 1)?.map(item => {
							return (
								<div className={styles.wrapper}>
									<div className={styles.name}>
										1 {t(findName(currencyOptions, item.base_currency, 'code'))?.toLowerCase()}
									</div>
									<div className={styles.currencies}>
										<p>{decimalToPrice(item?.rate ?? '')}</p>
										<span>{t(findName(currencyOptions, item.target_currency, 'code'))?.toLowerCase()}</span>
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