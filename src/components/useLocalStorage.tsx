import { useEffect, useState } from "react"

/**
 * State-like hook for localStorage.
 *
 * @param state The state to be stored in localStorage.
 * @param defaultValue The default value of the state.
 * @returns A tuple containing the state and a function to set the state.
 *
 * @example
 * const [isPaused, setIsPaused] = useLocalStorage("paused", false)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLocalStorage = (state: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(state)
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue
  })

  useEffect(() => {
    window.localStorage.setItem(state, JSON.stringify(value))
  }, [state, value])

  return [value, setValue]
}
