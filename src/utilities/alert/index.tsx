import toast, {Toast} from 'react-hot-toast'
import {AlertItem} from '@app/components'


const showMessage = (message: string = '', type: 'success' | 'error' | 'alert' = 'alert', duration: number = 5000, position: 'top-right' | 'top-center' = 'top-right'): void => {
	toast.custom(
		(customToast: Toast) => {
			return (
				<AlertItem
					onClose={() => toast.dismiss(customToast.id)}
					visible={customToast.visible}
					type={type}
					title={message}
				/>
			)
		},
		{
			position,
			duration
		}
	)
}

export {
	showMessage
}