import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ISelectOption} from 'interfaces/form.interface'
import {fetchStores} from 'store/stores/stores.actions'


interface IStore {
	store: ISelectOption | undefined,
	stores: ISelectOption[],
}

const getInitialStoreId = (): ISelectOption => {
	const stored = localStorage.getItem('store')
	return (stored && JSON.parse(stored)) ? JSON.parse(stored) : undefined
}

const initialState: IStore = {
	store: getInitialStoreId(),
	stores: []
}

export const storeSlice = createSlice({
	name: 'stores',
	initialState,
	reducers: {
		setStore: (state: IStore, action: PayloadAction<number>) => {
			if (state.stores && Array.isArray(state.stores) && state.stores?.find(item => item.value == action.payload)) {
				state.store = state.stores.find(item => item.value == action.payload)
				localStorage.setItem('store', JSON.stringify(state.stores.find(item => item.value == action.payload)))
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchStores.fulfilled, (state, action) => {
			if (action.payload?.storeId) {
				state.store = action.payload?.stores?.find(item => item.value == action.payload?.storeId)
				localStorage.setItem('store', JSON.stringify(action.payload?.stores?.find(item => item.value == action.payload?.storeId)))
			}
			state.stores = action.payload?.stores ?? []
		})
	}
})

export const {
	setStore
} = storeSlice.actions

export default storeSlice.reducer
