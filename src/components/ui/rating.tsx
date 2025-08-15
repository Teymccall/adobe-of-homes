import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingBaseProps {
  value: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

interface RatingInputProps extends RatingBaseProps {
  onChange: (rating: number) => void
  disabled?: boolean
}

interface RatingDisplayProps extends RatingBaseProps {
  showValue?: boolean
  showCount?: boolean
  count?: number
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6"
}

export function RatingInput({
  value,
  maxRating = 5,
  size = "md",
  onChange,
  disabled = false,
  className
}: RatingInputProps) {
  const [hoveredRating, setHoveredRating] = React.useState(0)

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoveredRating(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0)
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= (hoveredRating || value)
        const isHovered = starValue <= hoveredRating && hoveredRating !== 0

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={cn(
              "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? isHovered
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export function RatingDisplay({
  value,
  maxRating = 5,
  size = "md",
  showValue = false,
  showCount = false,
  count = 0,
  className
}: RatingDisplayProps) {
  const roundedValue = Math.round(value * 2) / 2

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= roundedValue
          const isHalfFilled = starValue === Math.ceil(roundedValue) && roundedValue % 1 !== 0

          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "text-yellow-500 fill-yellow-500"
                  : isHalfFilled
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              )}
            />
          )
        })}
      </div>
      
      {(showValue || showCount) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {showValue && (
            <span className="font-medium">{value.toFixed(1)}</span>
          )}
          {showCount && count > 0 && (
            <span>({count})</span>
          )}
        </div>
      )}
    </div>
  )
}

// Legacy export for backward compatibility
export const Rating = RatingInput
