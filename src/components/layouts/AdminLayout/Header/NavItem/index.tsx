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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (navItemRef.current && !navItemRef.current.contains(event.target as Node)) {
				setIsSubMenuOpen(false)
			}
		}

		if (isSubMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isSubMenuOpen])
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

	const isParentActive = hasChildren && children.some(child => location.pathname === child.href.split('?')[0])

	return (
		<div
			ref={navItemRef}
			className={classNames(styles.navItemContainer)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<NavLink
				to={href}
				className={({isActive}: NavLinkRenderProps) => classNames(styles.navItem, {
					[styles.active]: (isActive && !hasChildren) || isParentActive
				})}
				onClick={(e) => {
					if (hasChildren) e.preventDefault()
				}}
			>
				{!!icon && <span className={classNames(styles.icon)}>{icon()}</span>}
				<span className={styles.title}>{t(label)}</span>
			</NavLink>

			{hasChildren && isSubMenuOpen && (
				<div className={styles.subMenu}>
					{children.map((subItem) => (
						<div key={subItem.id} className={styles.subMenuItem} onClick={() => setIsSubMenuOpen(false)}>
							<NavLink
								to={subItem.href}
								className={({isActive}: NavLinkRenderProps) => classNames(styles.navItem, {[styles.active]: isActive})}
							>
								{!!subItem.icon && <span className={classNames(styles.icon)}>{subItem.icon()}</span>}
								<span className={styles.title}>{t(subItem.label)}</span>
							</NavLink>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default NavItem