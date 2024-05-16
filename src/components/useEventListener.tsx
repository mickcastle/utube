import { useRef, useEffect, RefObject } from "react"

type EventName = "keydown" | "click" | "mouseover" | "scroll" | "focus" | "blur" | "input" | "change" | "submit"

/**
 *
 * @param event - event name
 * @param eventHandler - function to run on event
 * @param element - RefObject of element to listen to
 * @param condition - condition to control when to add event listener
 *
 * @example
 * useEventListener("keydown", (e) => {
 *  if (e.key === "§") {
 *   inputRef.current?.focus()
 * }
 */
function useEventListener<T extends HTMLElement | Document | Window = HTMLDivElement | Document | Window>(
  event: EventName,
  eventHandler: (event?: Event) => void,
  element?: RefObject<T> | T | (RefObject<T> | T)[] | null,
  condition = true
): void {
  const savedHandler = useRef<(event: Event) => void>()

  useEffect(() => {
    if (!condition) {
      return
    }

    const targetElements: { element: T | null; eventListener: (event: Event) => void }[] = []

    const addTargetEventListener = (elm: RefObject<T> | T) => {
      const targetElement = elm && "current" in elm ? elm.current : elm

      if (!targetElement || !targetElement.addEventListener) {
        return
      }

      if (savedHandler.current !== eventHandler) {
        savedHandler.current = eventHandler
      }

      const eventListener = (event: Event) => {
        if (savedHandler.current) {
          savedHandler.current(event)
        }
      }

      targetElements.push({ element: targetElement, eventListener })
      targetElement.addEventListener(event, eventListener)
    }

    if (Array.isArray(element)) {
      element.forEach(addTargetEventListener)
    } else {
      if (element) {
        addTargetEventListener(element)
      }
    }

    return () => {
      targetElements.forEach(({ element, eventListener }) => {
        if (element) {
          element.removeEventListener(event, eventListener)
        }
      })
    }
  }, [event, element, eventHandler, condition])
}

export default useEventListener

function tabLock(event: KeyboardEvent, parentClass: string) {
  if (event.key !== "Tab") {
    return
  }
  const parent = document.querySelector(parentClass)

  const focusableElementsString =
    'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([aria-disabled]), iframe, object, embed, [tabindex="0"]'
  const focusableElements = parent?.querySelectorAll(focusableElementsString)
  if (focusableElements !== undefined) {
    const numberOfElements = focusableElements.length
    const firstTabElement = focusableElements[0] as HTMLElement
    const lastTabElement = focusableElements[numberOfElements - 1] as HTMLElement

    if (event.key === "Tab" && event.shiftKey) {
      if (document.activeElement === firstTabElement) {
        event.preventDefault()
        lastTabElement.focus()
      } else if (event.key === "Tab") {
        if (document.activeElement === lastTabElement) {
          event.preventDefault()
          firstTabElement.focus()
        }
      }
    }
  }
}

export { tabLock }
