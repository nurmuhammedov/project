import {PropsWithChildren, createContext, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {IUser} from 'interfaces/authentication.interface'
import {routeByRole} from 'utilities/authentication'
import {useUser} from 'hooks/index'
import {Loader} from 'components/index'


interface IAppContext {
	user: IUser
}

const AppContext = createContext<IAppContext | undefined>(undefined)

function AppContextProvider({children}: PropsWithChildren) {
	const {pathname} = useLocation()
	const navigate = useNavigate()
	const {user, isPending} = useUser()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!isPending) {
			if (!user) {
				navigate('/login', {state: {from: pathname}})
			} else {
				if (pathname === '/') {
					navigate(routeByRole(user.role))
				}
				const timer = setTimeout(() => setIsLoading(false), 1250)
				return () => clearTimeout(timer)
			}
		}
	}, [isPending, navigate, pathname, user])

	if (isPending || isLoading || !user) {
		return <Loader screen background/>
	}

	return (
		<AppContext.Provider value={{user}}>
			{children}
		</AppContext.Provider>
	)
}

export {AppContext, AppContextProvider}
