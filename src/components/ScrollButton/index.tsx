import React, {useState, useEffect, useRef} from 'react'
import {Button} from 'components/UI'
import styles from './styles.module.scss'
import {BUTTON_THEME} from 'constants/fields'
import classNames from 'classnames'
import {SelectIcon} from 'assets/icons'


const ScrollButton: React.FC = () => {
	const [isAtBottom, setIsAtBottom] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	const scrollableElementRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		scrollableElementRef.current = document.getElementById('children')
		const element = scrollableElementRef.current

		if (element) {
			const handleScroll = () => {
				const tolerance = 1
				const bottom = element.scrollHeight - element.scrollTop <= element.clientHeight + tolerance
				setIsAtBottom(bottom)
			}

			const checkVisibility = () => {
				const hasScroll = element.scrollHeight > element.clientHeight
				setIsVisible(hasScroll)
				if (hasScroll) {
					handleScroll()
				}
			}

			element.addEventListener('scroll', handleScroll, {passive: true})
			const observer = new ResizeObserver(checkVisibility)
			observer.observe(element)

			checkVisibility()

			return () => {
				element.removeEventListener('scroll', handleScroll)
				observer.disconnect()
			}
		}
	}, [])

	const scrollToTop = () => {
		scrollableElementRef.current?.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	const scrollToBottom = () => {
		if (scrollableElementRef.current) {
			scrollableElementRef.current.scrollTo({
				top: scrollableElementRef.current.scrollHeight,
				behavior: 'smooth'
			})
		}
	}

	if (!isVisible) {
		return null
	}

	return (
		<div
			className={classNames(styles.scrollButton, {[styles.btn]: isAtBottom})}
		>
			<Button
				theme={BUTTON_THEME.PRIMARY}
				onClick={isAtBottom ? scrollToTop : scrollToBottom}
				svg={<SelectIcon/>}
			/>
		</div>
	)
}

export default ScrollButton