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

	const urlMinHeightMap: Record<string, number> = {
		'/admin/stores/detail': 22
	}

	useEffect(() => {
		let matchedMinHeight = minHeight
		for (const path in urlMinHeightMap) {
			if (location.pathname.startsWith(path)) {
				matchedMinHeight = urlMinHeightMap[path]
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
					background: `linear-gradient(to bottom, var(--deep-forest) ${dynamicMinHeight}rem, var(--light-gray-2) ${dynamicMinHeight}rem)`
				}}
			>
				<Outlet/>
			</div>
		</div>
	)
}

export default Index
