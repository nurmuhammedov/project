import styles from './styles.module.scss'
import {Outlet, useLocation} from 'react-router-dom'
import Header from './Header'
import {FC, useEffect, useState} from 'react'


interface IProperties {
	minHeight?: number
}

const Index: FC<IProperties> = ({minHeight = 15.5}) => {
	const location = useLocation()
	const [dynamicMinHeight, setDynamicMinHeight] = useState(minHeight)

	const urlMinHeightMap: { startsWith: boolean, url: string, height: number }[] = [
		{
			startsWith: true,
			url: '/admin/stores/detail',
			height: 22
		},
		{
			startsWith: true,
			url: '/admin/products/exchange',
			height: 0
		},
		{
			startsWith: false,
			url: 'product-exchange',
			height: 0
		},
		{
			startsWith: false,
			url: 'currency-exchange',
			height: 0
		}
	]

	useEffect(() => {
		let matchedMinHeight = minHeight

		for (const item of urlMinHeightMap) {
			if (item.startsWith && location.pathname.startsWith(item.url)) {
				matchedMinHeight = item.height
				break
			}
			if (!item.startsWith && location.pathname.endsWith(item.url)) {
				matchedMinHeight = item.height
				break
			}
		}

		setDynamicMinHeight(matchedMinHeight)
	}, [location.pathname, minHeight])

	return (
		<div className={styles.root}>
			<Header/>
			<div
				className={styles.children}
				style={{
					background: `linear-gradient(to bottom, var(--deep-forest) ${dynamicMinHeight}rem, var(--light-gray-1) ${dynamicMinHeight}rem)`
				}}
			>
				<Outlet/>
			</div>
		</div>
	)
}

export default Index
