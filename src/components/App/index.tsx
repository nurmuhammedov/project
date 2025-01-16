import {AppContextProvider} from 'contexts/AppContext'
import {Outlet} from 'react-router-dom'
import {FC} from 'react'


const Index: FC = () => <AppContextProvider><Outlet/></AppContextProvider>

export default Index