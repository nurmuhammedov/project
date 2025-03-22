import {CSSProperties, FC, HTMLAttributes, ReactNode} from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'


interface IProperties extends HTMLAttributes<HTMLFormElement> {
	children: ReactNode
	style?: CSSProperties
	className?: string
}

const Index: FC<IProperties> = ({onSubmit, className, children, ...rest}) => {
	return (
		<form className={classNames(styles.root, className)}  {...rest} onSubmit={onSubmit}>
			{children}
		</form>
	)
}

export default Index
