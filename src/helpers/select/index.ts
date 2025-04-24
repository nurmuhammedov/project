import {
	DropdownIndicatorProps,
	CSSObjectWithLabel,
	ControlProps,
	IndicatorsContainerProps,
	OptionProps
} from 'react-select'


const getSelectStyles = (error?: boolean, top?: boolean) => ({
	'control': (base: CSSObjectWithLabel, state: ControlProps) => ({
		...base,
		border: error ? '1px solid var(--red-alert)!important' : state.isFocused ? '1px solid var(--teal)' : '1px solid var(--light-gray-3)',
		boxShadow: error ? '0 0 0 1px var(--red-alert)!important' : state.isFocused ? '0 0 0 1px var(--teal)' : 'none',
		backgroundColor: state.isDisabled ? 'var(--light-gray-1)' : 'var(--white)',
		padding: '1rem 1.25rem',
		borderRadius: '0.9375rem',
		fontFamily: 'Golos, Arial, Helvetica, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '1rem',
		lineHeight: '150%',
		outline: 'none',
		gap: '0.5rem',
		color: 'var(--dark-slate)',
		cursor: state.isDisabled ? 'not-allowed' : 'pointer',
		width: '100%',
		transition: 'all ease-in-out 0.15s',
		'&:hover': {
			borderColor: state.isFocused ? 'var(--teal)' : 'var(--light-gray-3)'
		}
	}),
	'valueContainer': (base: CSSObjectWithLabel) => ({
		...base,
		padding: 0
	}),
	'placeholder': (base: CSSObjectWithLabel) => ({
		...base,
		color: 'var(--light-gray-2)',
		gap: '0.5rem',
		display: 'flex',
		alignItems: 'center',
		borderRadius: '0.9375rem',
		fontFamily: 'Golos, Arial, Helvetica, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400'
	}),
	'singleValue': (base: CSSObjectWithLabel) => ({
		...base,
		margin: 0,
		padding: 0,
		gap: '0.5rem',
		display: 'flex',
		alignItems: 'center',
		color: 'var(--dark-slate)'
	}),
	'input': (base: CSSObjectWithLabel) => ({
		...base,
		margin: 0,
		padding: 0,
		color: 'var(--dark-slate)'
	}),
	'dropdownIndicator': (base: CSSObjectWithLabel, state: DropdownIndicatorProps) => ({
		...base,
		padding: 0,
		transition: 'all .3s ease-out',
		transform: state.selectProps.menuIsOpen
			? 'rotate(-180deg)'
			: null
	}),
	'indicatorsContainer': (base: CSSObjectWithLabel, state: IndicatorsContainerProps) => ({
		...base,
		display: state.isDisabled ? 'none' : 'flex'
	}),
	'clearIndicator': (base: CSSObjectWithLabel) => ({
		...base,
		padding: '0.1rem 0.15rem 0.1rem 0.1rem',
		'& svg': {
			'& path': {
				fill: `var(--light-dark-opacity)`
			}
		}
	}),
	'menu': (base: CSSObjectWithLabel) => ({
		...base,
		margin: 0,
		zIndex: '11',
		top: top ? 'auto' : 'calc(100% + .3rem)',
		backgroundColor: 'var(--white)',
		borderRadius: '0.9375rem',
		padding: '.1rem 0',
		overflow: 'hidden',
		minWidth: 'calc(100%)',
		width: 'auto'
	}),
	'menuList': (base: CSSObjectWithLabel) => ({
		...base,
		margin: 0,
		maxHeight: '14.5rem',
		overflowY: 'auto'
	}),
	'option': (base: CSSObjectWithLabel, state: OptionProps) => ({
		...base,
		padding: '1rem 1.25rem',
		fontFamily: 'Golos, Arial, Helvetica, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '1rem',
		lineHeight: '150%',
		gap: '0.5rem',
		display: 'flex',
		alignItems: 'center',
		transition: 'all ease-in-out 0.1s',
		textAlign: 'start',
		color: state.isSelected || state.isFocused
			? 'var(--white)' : 'var(--dark-slate)',
		backgroundColor: state.isSelected || state.isFocused
			? 'var(--teal)'
			: 'transparent',
		cursor: 'pointer',
		'&:active': {
			backgroundColor: state.isSelected || state.isFocused
				? 'var(--teal)'
				: 'transparent'
		}
	}),
	'noOptionsMessage': (base: CSSObjectWithLabel) => ({
		...base,
		padding: '.8rem 1rem',
		fontFamily: 'Golos, Arial, Helvetica, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '1rem',
		lineHeight: '150%',
		color: 'var(--dark-slate)',
		cursor: 'not-allowed'
	}),
	'multiValue': (base: CSSObjectWithLabel) => ({
		...base,
		'& div:first-of-type': {
			padding: '.2rem .3rem .2rem .5rem',
			whiteSpace: 'wrap!important'
		},
		'& svg': {
			fill: 'var(--light-gray-2)'
		},
		'& div[role="button"]': {
			padding: '.2rem .5rem'
		},
		'& div[role="button"]:hover svg': {
			fill: 'var(----red-alert)'
		}
	})
})

export default getSelectStyles