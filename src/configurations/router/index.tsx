import {App} from 'components'
import {createBrowserRouter, Navigate} from 'react-router-dom'
import AdminLayout from 'components/layouts/AdminLayout'

// Screens
import {
	ProductsTable,
	DatabaseTable,
	ClientsTable,
	Login,
	Home
} from 'modules'


export const router = createBrowserRouter([
	{
		path: '/',
		element: <App/>,
		children: [
			{
				path: 'admin',
				element: <AdminLayout/>,
				children: [
					{
						path: 'home',
						element: <Home/>
					},
					{
						path: 'clients',
						element: <ClientsTable/>
					},
					{
						path: 'products',
						element: <ProductsTable/>
					},
					{
						path: 'database',
						element: <DatabaseTable/>
					}
				]
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

