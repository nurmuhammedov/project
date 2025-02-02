import {PropsWithChildren, createContext} from 'react'
import {IUser} from 'interfaces/authentication.interface'
import {useUser} from 'hooks'
import {Loader} from 'components'


interface IAppContext {
	user: IUser | null
}

const AppContext = createContext<IAppContext | null>(null)

function AppContextProvider({children}: PropsWithChildren) {
	const {user, isPending} = useUser()

	console.log(isPending, user)


	if (isPending) {
		return <Loader screen background/>
	}

	return (
		<AppContext.Provider value={{user}}>
			{children}
		</AppContext.Provider>
	)
}

export {AppContext, AppContextProvider}
