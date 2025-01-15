import {Loader} from 'components/index'
import {FC, useEffect} from 'react'
import {showMessage} from 'utilities/alert'


const Index: FC = () => {


	useEffect(() => {
		fetch('https://jr.technocorp.uz/api/accounts/login/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'json/application'
			},
			body: JSON.stringify({username: 'admin2', password: '123'})
		})
	}, [])

	const aasd = () => {

		showMessage('aasdasd', 'success')
	}

	return (
		<>
			<div><Loader background/></div>
			<button onClick={aasd}>sdasdasd</button>
		</>
	)
}

export default Index