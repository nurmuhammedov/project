import {ICheckoutItem} from 'interfaces/dashboard.interface'
import styles from './styles.module.scss'
import {Button, Card, CardTitle, Loader} from 'components'
import {CSSProperties, FC} from 'react'
import classNames from 'classnames'
import {useData} from 'hooks/index'
import {decimalToPrice} from 'utilities/common'
import {Loss, Profit} from 'assets/icons'
import {useNavigate} from 'react-router-dom'


interface IProperties {
	style?: CSSProperties,
	className?: string,
}

const Index: FC<IProperties> = ({style, className}) => {
	const navigate = useNavigate()
	const {data: currencies = [], isPending} = useData<ICheckoutItem[]>('currency/organization/balance/')

	return (
		<Card style={style} className={classNames(styles.root, className)}>
			<CardTitle title="Checkout"/>
			<div style={{marginTop: '1rem'}} className="flex flex-col gap-lg">
				<div className={styles['currencies-wrapper']}>
					{
						isPending ? <Loader/> : currencies?.map(item => {
							return (
								<div className={styles.currencies}>
									{decimalToPrice(item?.summa ?? '')} {item?.label?.toString()?.toLowerCase() ?? ''}
								</div>
							)
						})
					}
				</div>
				<div className="flex align-center gap-lg">
					<Button
						icon={<Profit/>}
						onClick={() => navigate('currency-exchange')}
						style={{width: '100%'}}
					>
						Making income
					</Button>
					<Button
						onClick={() => navigate('currency-exchange?tab=loss')}
						icon={<Loss/>}
						style={{width: '100%'}}
					>
						Making loss
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default Index