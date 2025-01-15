import {ISearchParams} from 'interfaces/params.interface'


const noop = (): void => {}

// function ensureHttps(url: string | undefined | null): string | undefined | null {
// 	if (url?.startsWith('http://')) {
// 		return url.replace('http://', 'https://')
// 	}
// 	return url
// }

const cleanParams = (params: ISearchParams) => {
	const filteredParams: ISearchParams = {}
	Object.keys(params).forEach(key => {
		const value = params[key]
		if (value !== null && value !== undefined && value !== '') {
			filteredParams[key] = value
		}
	})
	return filteredParams
}

export {
	noop,
	cleanParams
	// ensureHttps
}