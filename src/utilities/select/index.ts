import {ISelectOption} from 'interfaces/form.interface'
import {ISearchParams} from 'interfaces/params.interface'


export const getSelectOptionsByKey = (data: ISearchParams[], key: string = 'name'): ISelectOption[] => {
	return data.map((item) => ({value: item?.id || 'nb', label: String(item?.[key] || '')}))
}