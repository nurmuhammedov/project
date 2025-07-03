import {FC, useState, useRef, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {NavLink, NavLinkRenderProps, useLocation} from 'react-router-dom'
import classNames from 'classnames'
import styles from './styles.module.scss'
import {IMenuItem} from 'interfaces/configuration.interface'


const NavItem: FC<IMenuItem> = ({href, label, icon, children}) => {
	const {t} = useTranslation()
	const location = useLocation()
	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
	const navItemRef = useRef<HTMLDivElement>(null)

	const hasChildren = children && children.length > 0

	const handleMouseEnter = () => {
		if (hasChildren) {
			setIsSubMenuOpen(true)
		}
	}

	const handleMouseLeave = () => {
		if (hasChildren) {
			setIsSubMenuOpen(false)
		}
	}

	useEffect(() => {
		const isActiveParent = hasChildren && children.some(child => location.pathname.startsWith(child.href.split('?')[0]))
		if (isActiveParent) {
			setIsSubMenuOpen(true)
		}
	}, [location.pathname, hasChildren, children])


	const renderNavItem = (item: IMenuItem, isSubItem: boolean = false) => {
		const itemIsActive = window?.location?.pathname + window?.location?.search === item.href
		return (
			<NavLink
				to={item.href}
				className={({isActive}: NavLinkRenderProps) => classNames(styles.navItem, {[styles.active]: (isSubItem && itemIsActive) || (!isSubItem && isActive)})}
			>
				{!!item.icon && <span className={classNames(styles.icon)}>{item.icon()}</span>}
				<span className={styles.title}>{t(item.label)}</span>
			</NavLink>
		)
	}

	return (
		<div
			ref={navItemRef}
			className={classNames(styles.navItemContainer, {[styles.navItemContainerOpen]: isSubMenuOpen && hasChildren})}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{renderNavItem({href, label, icon, children} as IMenuItem)}
			{hasChildren && isSubMenuOpen && (
				<div className={styles.subMenu}>
					{children.map((subItem) => (
						<div key={subItem.id} className={styles.subMenuItem}>
							{renderNavItem(subItem, true)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default NavItem