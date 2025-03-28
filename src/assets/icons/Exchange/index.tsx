import {CSSProperties} from 'react'


interface IProperties {
	style: CSSProperties
}

const Index = ({style}: IProperties) => {
	return (
		<svg
			style={{maxWidth: '1.7rem', minWidth: '1.7rem', width: '100%', height: 'auto', ...style}}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="var(--teal)"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
			<path d="M7 10h14l-4 -4"/>
			<path d="M17 14h-14l4 4"/>
		</svg>
	)
}

export default Index
