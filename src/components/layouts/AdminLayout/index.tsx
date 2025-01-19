import styles from './styles.module.scss'
import {Outlet} from 'react-router-dom'
import Header from './Header'
import {FC} from 'react'


interface IProperties {
	minHeight?: number
}

const Index: FC = ({minHeight = 15.5}: IProperties) => {
	return (
		<div className={styles.root}>
			<Header/>
			<div
				className={styles.children}
				style={{background: `linear-gradient(to bottom, var(--deep-forest) ${minHeight}rem, var(--light-gray-2) ${minHeight}rem)`}}
			>
				<Outlet/>
			</div>
		</div>
	)
}

export default Index