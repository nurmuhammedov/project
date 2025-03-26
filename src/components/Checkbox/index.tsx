import classNames from 'classnames'
import {forwardRef, InputHTMLAttributes} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'


const ToggleSwitch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & {
	id: string,
	title?: string
}>(({id, title, ...props}, ref) => {
	const {t} = useTranslation()
	return (
		<div className={classNames(styles.root, {[styles.disabled]: props.disabled})}>
			<input {...props} ref={ref} className={styles.tgl} type="checkbox" id={id}/>
			<label className={styles.tglBtn} htmlFor={id}></label>
			{title && <p>{t(title)}</p>}
		</div>
	)
})

export default ToggleSwitch