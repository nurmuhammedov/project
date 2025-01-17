import {Button} from 'components/index'
import {AppContextProvider} from 'contexts/AppContext'
import {useLogout} from 'hooks/index'
import {FC} from 'react'


const Index: FC = () => {
	const {handleLogout, isPending} = useLogout()

	return (
		<AppContextProvider>
			<Button onClick={() => handleLogout()} disabled={isPending}>
				Logout
			</Button>
		</AppContextProvider>
	)
}

export default Index