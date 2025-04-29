import {ISelectOption} from 'interfaces/form.interface'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {interceptor} from 'libraries'


export interface IFetchStoresData {
	storeId: number | undefined
	stores: ISelectOption[]
}

export const fetchStores = createAsyncThunk<IFetchStoresData, void, { rejectValue: string }>(
	'store/setStoreId',
	async (_, {rejectWithValue}) => {
		try {
			const {data: stores} = await interceptor.get<ISelectOption[]>('/stores/select')

			if (!stores.length) {
				return {storeId: undefined, stores: []}
			}

			const main = stores.find(s => s.is_main)
			const selected = main?.value ?? stores[0]?.value
			const storeId = selected ? Number(selected) : undefined
			return {storeId, stores}
		} catch (err) {
			console.error(err)
			return rejectWithValue('Failed to fetch stores')
		}
	}
)
