import {loginSchema} from 'modules/authentication/helpers/yup'
import {useLogin} from 'modules/authentication/hooks'
import {ILoginForm} from 'interfaces/yup.interface'
import {yupResolver} from '@hookform/resolvers/yup'
import {useTranslation} from 'react-i18next'
import styles from './styles.module.scss'
import {Button, Input} from 'components'
import {useForm} from 'react-hook-form'
import {FIELD} from 'constants/fields'
import {Logo} from 'assets/icons'


const Index = () => {
	const {t} = useTranslation()
	const {isPending, login} = useLogin()

	const {
		register,
		handleSubmit,
		formState: {errors}
	} = useForm({
		mode: 'onTouched',
		defaultValues: {
			username: 'admin',
			password: 'pass0101'
		},
		resolver: yupResolver(loginSchema)
	})

	return (
		<div className={styles.root}>
			<div className={styles.left}>
				<div className={styles.top}></div>
				<div className={styles.bottom}>
					<div className={styles.logo}>
						<Logo/>
						<span>{t('Erp')}</span>
					</div>
					<div className={styles.slogan}>
						{t('Ensure transparency in managing your business!')}
					</div>
					<div
						className={styles.tagline}
						dangerouslySetInnerHTML={{__html: t('A unique and modern platform for financial management of any business')}}
					>
					</div>
				</div>
			</div>

			<div className={styles.wrapper}>
				<div className={styles.form}>
					<h1>{t('Login to the system')}</h1>
					<form onSubmit={handleSubmit((data: ILoginForm) => login(data))}>
						<Input
							id="login"
							type={FIELD.TEXT}
							label="Login"
							required={true}
							error={errors?.username?.message}
							placeholder={'Enter your login'}
							{...register('username')}
						/>
						<Input
							id="password"
							type={FIELD.PASSWORD}
							label="Password"
							required={true}
							error={errors?.password?.message}
							placeholder="Enter your password"
							{...register('password')}
						/>
						<Button disabled={isPending} type={FIELD.SUBMIT}>
							Enter
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Index
