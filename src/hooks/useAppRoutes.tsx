import {ClientsTable, DatabaseTable, Home, Login, ProductsTable, StoreDetail, StoresTable} from 'modules'
import {Navigate, Outlet, useRoutes} from 'react-router-dom'
import {routeByRole} from 'utilities/authentication'
import {ROLE_LIST} from 'constants/roles'
import {AdminLayout} from 'components'
import {useAppContext} from 'hooks'


function useAppRoutes() {
	const {user} = useAppContext()

	const routes = {
		[ROLE_LIST.ADMIN]: [
			{
				path: '/',
				element: <AdminLayout/>,
				children: [
					{
						index: true,
						element: <Navigate to={routeByRole(user?.role)} replace/>
					},
					{
						path: 'admin',
						children: [
							{
								index: true,
								element: <Navigate to={routeByRole(user?.role)} replace/>
							},
							{
								path: 'home', element: <Home/>
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
				]
			},
			{
				path: '*',
				element: <Navigate to={routeByRole(user?.role)} replace/>
			}
		],
		[ROLE_LIST.SELLER]: [
			{
				path: '/',
				element: <Outlet/>,
				children: [
					{
						index: true,
						element: <Navigate to={routeByRole(user?.role)} replace/>
					},
					{
						path: 'seller',
						children: [
							{
								index: true,
								element: <Navigate to={routeByRole(user?.role)} replace/>
							},
							{
								path: 'home',
								element: <h1>Seller dashboard</h1>
							}
						]
					}
				]
			},
			{
				path: '*',
				element: <Navigate to={routeByRole(user?.role)} replace/>
			}
		],
		default: [
			{
				path: '/login',
				element: <Login/>
			},
			{
				path: '*',
				element: <Navigate to="/login" replace/>
			}
		]
	}

	return useRoutes(routes[user?.role ?? 'default'] || routes.default)
}

export default useAppRoutes
