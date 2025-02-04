import {IOption, ISelectOption} from 'interfaces/form.interface'


const getSelectOptions = (data: IOption[]): ISelectOption[] => {
	return data.map(({id, name}) => ({value: id, label: name}))
}

export {
	getSelectOptions
}