import {AppContext} from 'contexts/AppContext'
import {useContext} from 'react'


export default function useAppContext() {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('useContext must be used within ContextProvider')
	}
	return context
}
