import {IField} from 'interfaces/form.interface'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import React, {forwardRef} from 'react'
import {FIELD} from 'constants/fields'
import {Delete} from 'assets/icons'
import classNames from 'classnames'


const Index = forwardRef<HTMLInputElement | HTMLTextAreaElement, IField>(
	(
		{
			iconPosition = 'left',
			autocomplete = false,
			type = FIELD.TEXT,
			textarea = false,
			radius = false,
			redLabel = false,
			handleDelete,
			handleIcon,
			disabled = false,
			children,
			className,
			label,
			error,
			icon,
			id,
			...props
		},
		ref
	) => {
		const {t} = useTranslation()

		return (
			<div className={classNames(styles.root, className, {
				[styles.error]: error,
				[styles.icon]: icon,
				[styles.delete]: handleDelete,
				[styles.redLabel]: redLabel,
				[styles.disabled]: disabled,
				[styles['delete-children']]: !!children && handleDelete,
				[styles.radius]: radius
			})}>
				{
					label && (
						<div className={styles.wrapper}>
							<label htmlFor={id}>{t(label)}</label>
						</div>
					)
				}
				{
					children ? <>
							{children}
							{
								handleDelete &&
								<div className={styles['delete-wrapper']} onClick={() => handleDelete?.()}>
									<Delete/>
								</div>
							}
						</> :
						textarea ? (
							<textarea
								rows={5}
								{...props}
								disabled={disabled}
								data-title="input"
								ref={ref as React.Ref<HTMLTextAreaElement>}
								id={id.toString()}
								className={styles.input}
								placeholder={props.placeholder ? t(props.placeholder as string) : t('Enter value')}
								autoComplete={autocomplete ? 'on' : 'off'}
							/>
						) : (
							<div
								className={classNames(styles['input-wrapper'], {[styles.right]: iconPosition === 'right'})}
							>
								{
									icon &&
									<div className={styles['icon-wrapper']} onClick={() => handleIcon?.()}>
										{icon}
									</div>
								}
								<input
									{...props}
									disabled={disabled}
									ref={ref as React.Ref<HTMLInputElement>}
									id={id.toString()}
									type={type}
									data-title="input"
									className={styles.input}
									placeholder={props.placeholder ? t(props.placeholder as string) : t('Enter value')}
									autoComplete={autocomplete ? 'on' : 'off'}
								/>

								{
									handleDelete &&
									<div className={styles['delete-wrapper']} onClick={() => handleDelete?.()}>
										<Delete/>
									</div>
								}
							</div>
						)}
				{error && <span className={styles['error__message']}>{t(error as string)}!</span>}
			</div>
		)
	}
)

export default Index
