// import { I18nextProvider } from 'react-i18next';
import {createRoot} from 'react-dom/client'
// import {StrictMode} from 'react'
import {Alert, App} from 'components'
import 'styles/index.scss'


createRoot(document.getElementById('root')!).render(
	<>
		<App/>
		<Alert/>
	</>
)
