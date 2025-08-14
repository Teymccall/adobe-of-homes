import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value?: number
  onChange?: (rating: number) => void
  max?: number
  size?: "sm" | "md" | "lg"
  readonly?: boolean
  showValue?: boolean
  showCount?: boolean
  count?: number
  className?: string
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
  showValue = false,
  showCount = false,
  count,
  className
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const [rating, setRating] = React.useState(value)

  React.useEffect(() => {
    setRating(value)
  }, [value])

  const handleClick = (newRating: number) => {
    if (readonly) return
    setRating(newRating)
    onChange?.(newRating)
  }

  const handleMouseEnter = (newRating: number) => {
    if (readonly) return
    setHoverValue(newRating)
  }

  const handleMouseLeave = () => {
    if (readonly) return
    setHoverValue(null)
  }

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  const currentRating = hoverValue ?? rating
  const stars = Array.from({ length: max }, (_, index) => index + 1)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars.map((star) => {
          const isFilled = star <= currentRating
          const isPartiallyFilled = 
            star > Math.floor(currentRating) && 
            star <= Math.ceil(currentRating) && 
            currentRating % 1 !== 0

          return (
            <button
              key={star}
              type="button"
              className={cn(
                "transition-colors duration-150",
                readonly 
                  ? "cursor-default" 
                  : "cursor-pointer hover:scale-110 transition-transform"
              )}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : isPartiallyFilled
                    ? "fill-yellow-200 text-yellow-400"
                    : readonly
                    ? "fill-none text-gray-300"
                    : "fill-none text-gray-400 hover:text-yellow-400"
                )}
              />
            </button>
          )
        })}
      </div>

      {(showValue || showCount) && (
        <div className={cn("flex items-center gap-1 ml-2", textSizeClasses[size])}>
          {showValue && (
            <span className="font-medium text-foreground">
              {rating.toFixed(1)}
            </span>
          )}
          {showCount && count !== undefined && (
            <span className="text-muted-foreground">
              ({count.toLocaleString()})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Read-only version for displaying ratings
export function RatingDisplay({
  value,
  max = 5,
  size = "md",
  showValue = true,
  showCount = false,
  count,
  className
}: Omit<RatingProps, 'onChange' | 'readonly'>) {
  return (
    <Rating
      value={value}
      max={max}
      size={size}
      readonly={true}
      showValue={showValue}
      showCount={showCount}
      count={count}
      className={className}
    />
  )
}

// Interactive version for collecting ratings
export function RatingInput({
  value,
  onChange,
  max = 5,
  size = "md",
  className
}: Pick<RatingProps, 'value' | 'onChange' | 'max' | 'size' | 'className'>) {
  return (
    <Rating
      value={value}
      onChange={onChange}
      max={max}
      size={size}
      readonly={false}
      className={className}
    />
  )
} 