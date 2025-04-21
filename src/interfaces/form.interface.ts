import {BUTTON_THEME} from 'constants/fields'
import React, {InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes} from 'react'
import {Props as SelectProps} from 'react-select'

// Input Interface
export interface IFieldProperties {
	id: string;
	type?: string;
	error?: string | React.ReactNode;
	label?: string;
	textarea?: boolean;
	autocomplete?: boolean;
	required?: boolean;
	radius?: boolean,
	icon?: React.ReactNode;
	iconPosition?: 'right' | 'left';
	handleIcon?: () => void;
	handleDelete?: () => void;
}

export type IField =
	InputHTMLAttributes<HTMLInputElement>
	& TextareaHTMLAttributes<HTMLTextAreaElement>
	& IFieldProperties;

// Button Interface
export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
	theme?: BUTTON_THEME,
	mini?: boolean,
	navigate?: string,
	icon?: React.ReactNode,
	iconPosition?: 'left' | 'right',
}

// Select Option Interface
export interface ISelectOption {
	value: string | number | boolean;
	label: string | number | boolean;
	icon?: React.ReactNode;
	code?: string;
	is_main?: boolean;
	color?: string;
}

// Select Interface
export interface ISelect extends SelectProps<ISelectOption> {
	id: string;
	options: ISelectOption[];
	placeholder?: string;
	icon?: React.ReactNode;
	handleOnChange?: (e: string | number | boolean | string[] | number[] | boolean[] | null) => void;
	disabled?: boolean;
	label?: string;
	error?: string;
	top?: boolean;
}

export interface IFile {
	name: string;
	id: string | number;
	file: string;
}