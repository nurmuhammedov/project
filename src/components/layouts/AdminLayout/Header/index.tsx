import {Select} from 'components/UI'
import useActions from 'hooks/useActions'
import useTypedSelector from 'hooks/useTypedSelector'
import {interceptor} from 'libraries/index'
import {useTranslation} from 'react-i18next'
import {getSelectValue} from 'utilities/common'
import styles from './styles.module.scss'
import {useAppContext, useLogout, useSideMenu} from 'hooks'
import {Logout, SelectIcon} from 'assets/icons'
import NavItem from './NavItem'
import classNames from 'classnames'
import {useState} from 'react'
import Status from 'assets/icons/Status'


const Index = () => {
	const {t} = useTranslation()
	const sideMenu = useSideMenu()
	const [accountIsOpen, setAccountIsOpen] = useState(false)
	const {user} = useAppContext()
	const {handleLogout, isPending} = useLogout()
	const {store, stores} = useTypedSelector(state => state.stores)
	const {setStore} = useActions()

	return (
		<div className={styles.root}>
			<div className={styles.logo}>
				{/*<Logo/>*/}
				{/*<span>{t('Erp')}</span>*/}
				<Select
					id="store"
					options={(store && !stores?.length) ? [store, ...stores] : stores}
					placeholder="Store"
					value={getSelectValue((store && !stores?.length) ? [store, ...stores] : stores, store?.value)}
					defaultValue={getSelectValue((store && !stores?.length) ? [store, ...stores] : stores, store?.value)}
					handleOnChange={(e) => {
						if (e) {
							interceptor
								.post(`stores/${Number(e)}/set-main`)
								.then(() => {
									setStore(Number(e))
								})
						}
					}}
				/>
			</div>

			<div className={styles.nav}>
				{
					sideMenu?.map((item) => (
						<NavItem key={item.id} {...item}/>
					))
				}
			</div>

			<div className={styles['profile-container']}>
				<div
					onClick={() => setAccountIsOpen(p => !p)}
					className={classNames(styles.profile)}
				>
					<div className={styles['status-wrapper']}>
						<div className={styles.status}><Status/></div>
						<div className={styles.name}>{user?.fullName ?? t('Employee')}</div>
					</div>
					<div className={classNames(styles.icon, {[styles['active-icon']]: accountIsOpen})}>
						<SelectIcon/>
					</div>
				</div>
				<div className={classNames(styles.account, {[styles['active-account']]: accountIsOpen})}>
					<div
						className={classNames(styles.logout, {[styles.isLoading]: isPending})}
						onClick={() => handleLogout()}
					>
						<Logout/>
						<span>{t('Logout')}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Index