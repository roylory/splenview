import React, { PropsWithChildren } from "react"

interface LongTouchDivProps {
  onLongTouched: () => void
  delay?: number
}

const LongTouchDiv: React.FC<
  PropsWithChildren<LongTouchDivProps & React.HTMLProps<HTMLDivElement>>
> = ({ onLongTouched, delay = 750, children, ...props }) => {
  const handleTouchStart = () => {
    const timeout = setTimeout(() => {
      onLongTouched()
    }, delay)

    const handleTouchEnd = () => {
      clearTimeout(timeout)
    }

    document.addEventListener("mouseup", handleTouchEnd)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener("mouseup", handleTouchEnd)
    }
  }

  return (
    <div
      {...props}
      onTouchStart={(e) => {
        handleTouchStart()
        props.onTouchStart && props.onTouchStart(e)
      }}
    >
      {children}
    </div>
  )
}

export default LongTouchDiv
