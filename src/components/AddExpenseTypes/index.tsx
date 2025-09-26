import {FIELD} from 'constants/fields'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {expenseTypeSchema} from 'modules/database/helpers/yup'
import {useAdd, useSearchParams} from 'hooks'
import {
	Form,
	Input,
	Modal,
	Button
} from 'components'
import {InferType} from 'yup'
import {useQueryClient} from '@tanstack/react-query'


const DEFAULT_FORM_VALUES = {
	name: ''
}

const ExpenseTypes = () => {
	const {
		removeParams
	} = useSearchParams()
	const queryClient = useQueryClient()

	const {mutateAsync: addExpenseType, isPending: isAdding} = useAdd('service-types')

	const {
		handleSubmit: handleAddSubmit,
		register: registerAdd,
		reset: resetAdd,
		formState: {errors: addErrors}
	} = useForm<InferType<typeof expenseTypeSchema>>({
		mode: 'onTouched',
		defaultValues: DEFAULT_FORM_VALUES,
		resolver: yupResolver(expenseTypeSchema)
	})

	return (
		<Modal title="Add new" id="expenses" style={{height: '20rem'}}>
			<Form
				onSubmit={handleAddSubmit((formData: InferType<typeof expenseTypeSchema>) =>
					addExpenseType(formData).then(async () => {
						removeParams('modal')
						resetAdd(DEFAULT_FORM_VALUES)
						await queryClient.invalidateQueries({queryKey: ['service-types/select']})
					})
				)}
			>
				<Input
					id="name"
					type={FIELD.TEXT}
					label="Name"
					error={addErrors?.name?.message}
					{...registerAdd('name')}
				/>
				<Button style={{marginTop: 'auto'}} type={FIELD.SUBMIT} disabled={isAdding}>
					Save
				</Button>
			</Form>
		</Modal>
	)
}

export default ExpenseTypes
