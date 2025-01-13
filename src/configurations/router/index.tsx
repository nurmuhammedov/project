import {createBrowserRouter, Navigate} from 'react-router-dom'
import App from '../../App'


export const router = createBrowserRouter([
	{
		path: '/',
		element: <App/>,
		children: [
			{
				index: true,
				element: <></>
			}
		],
		errorElement: <h1>Error</h1>
	},
	{
		path: '/login',
		element: <Login/>,
		errorElement: <h1>Error</h1>
	},
	{
		path: '*',
		element: <Navigate to="/"/>,
		errorElement: <h1>Error</h1>
	}
])

