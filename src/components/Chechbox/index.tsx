import {InputHTMLAttributes} from 'react'
import styles from './styles.module.scss'


const ToggleSwitch = (props: InputHTMLAttributes<HTMLInputElement> & { title?: string }) => {
	return (
		<div className={styles.root}>
			<input className={styles.tgl} type="checkbox" id="toggle" {...props} />
			<label className={styles.tglBtn} htmlFor="toggle"></label>
			{props.title && <p>{props.title}</p>}
		</div>
	)
}

export default ToggleSwitch
