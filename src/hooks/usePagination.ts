import {useSearchParams} from 'hooks'


interface IProperties {
	page?: string
	pageSize?: string
}

function usePagination({page = 'page', pageSize = 'pageSize'}: IProperties = {}) {
	const {paramsObject, removeParams, addParams} = useSearchParams()
	const currentPage = Number(paramsObject[page]) || 1
	const currentPageSize = Number(paramsObject[pageSize]) || 20

	const onPageChange = (selectedValue: number): void => {
		if (selectedValue <= 1) {
			removeParams(page)
		} else {
			addParams({[page]: selectedValue})
		}
	}

	const onPageSizeChange = (selectedValue?: string | number | null): void => {
		if (selectedValue === 20 || !selectedValue) {
			removeParams(pageSize, page)
		} else {
			addParams({[pageSize]: selectedValue}, page)
		}
	}

	return {
		onPageChange,
		onPageSizeChange,
		page: currentPage,
		pageSize: currentPageSize
	}
}

export default usePagination