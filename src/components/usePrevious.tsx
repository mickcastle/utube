import { useEffect, useRef } from "react"

/** Hook returning previous value*/
function usePrevious<T>(value?: T): T | undefined {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class

  // Store current value in ref
  const ref = useRef<T>()

  // Only re-run if value changes
  useEffect(() => {
    ref.current = value
  }, [value])

  // Return happens before update in useEffect above
  return ref.current
}

export default usePrevious
