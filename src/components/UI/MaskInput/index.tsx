import classes from 'components/UI/Input/styles.module.css'
import {useTranslation} from 'react-i18next'
import InputMask from 'react-input-mask'
import {Input} from 'components'
import React, {ChangeEvent, FocusEvent, forwardRef} from 'react'


interface IProperties {
	id: string
	label?: string
	error?: string
	placeholder?: string
	value?: string | number | null
	mask?: string
	disabled?: boolean
	onChange: (value: ChangeEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

const Index = forwardRef<HTMLInputElement, IProperties>(({
	                                                         id,
	                                                         label,
	                                                         placeholder = 'Enter value',
	                                                         mask = '+\\9\\98 99 999 99 99',
	                                                         error,
	                                                         disabled,
	                                                         value,
	                                                         onChange,
	                                                         onKeyDown,
	                                                         onBlur
                                                         }, ref) => {
	const {t} = useTranslation()
	// const inputRef = useRef(ref)

	return (
		<Input
			id={id}
			type="text"
			label={label}
			error={error}
			// ref={inputRef}
			disabled={disabled}
		>
			<InputMask
				disabled={disabled}
				data-title="input"
				maskChar=""
				value={value as unknown as string}
				onChange={onChange}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				mask={mask}
				placeholder={t(placeholder)}
				inputRef={ref}
				// ref={inputRef}
				className={classes.input}
			/>
		</Input>
	)
})

export default Index