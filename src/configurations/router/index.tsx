import {createBrowserRouter} from 'react-router-dom'
import {AdminLayout, App, ProtectedRoute} from 'components'

// Screens
import {
	ProductsTable,
	DatabaseTable,
	ClientsTable,
	StoresTable,
	StoreDetail,
	Login,
	Home
} from 'modules'


export const router = createBrowserRouter([
	{
		path: '/',
		element: <App/>,
		children: [
			// {
			// 	index: true,
			// 	element: <Navigate to="/admin/home"/>
			// },
			{
				path: 'admin',
				element: <ProtectedRoute><AdminLayout/></ProtectedRoute>,
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
					},
					{
						path: 'stores',
						children: [
							{
								index: true,
								element: <StoresTable/>
							},
							{
								path: 'detail/:id',
								element: <StoreDetail/>
							}
						]
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
	// {
	// 	path: '*',
	// 	element: <Navigate to="/"/>,
	// 	errorElement: <h1>Error</h1>
	// }
])