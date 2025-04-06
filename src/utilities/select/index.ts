import {IIDName} from 'interfaces/configuration.interface'
import {ISelectOption} from 'interfaces/form.interface'
import {ISearchParams} from 'interfaces/params.interface'


const getSelectOptions = (data: IIDName[]): ISelectOption[] => {
	return data.map(({id, name}) => ({value: id, label: name}))
}

const getSelectOptionsByKey = (data: ISearchParams[], key: string = 'name'): ISelectOption[] => {
	return data.map((item) => ({value: item?.id || 'nb', label: String(item?.[key] || '')}))
}

export {
	getSelectOptions,
	getSelectOptionsByKey
}