import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PriceRangeSliderProps {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  onChange?: (value: [number, number]) => void
  formatValue?: (value: number) => string
  currency?: string
  disabled?: boolean
  className?: string
  showInputs?: boolean
  label?: string
}

export function PriceRangeSlider({
  min = 0,
  max = 10000,
  step = 50,
  value = [min, max],
  onChange,
  formatValue,
  currency = "₵",
  disabled = false,
  className,
  showInputs = true,
  label = "Price Range"
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)
  const [inputValues, setInputValues] = React.useState({
    min: value[0].toString(),
    max: value[1].toString()
  })

  React.useEffect(() => {
    setLocalValue(value)
    setInputValues({
      min: value[0].toString(),
      max: value[1].toString()
    })
  }, [value])

  const defaultFormatValue = (val: number): string => {
    if (val >= 1000000) {
      return `${currency}${(val / 1000000).toFixed(1)}M`
    } else if (val >= 1000) {
      return `${currency}${(val / 1000).toFixed(0)}K`
    }
    return `${currency}${val.toLocaleString()}`
  }

  const formatVal = formatValue || defaultFormatValue

  const handleSliderChange = (newValue: number[]) => {
    const [minVal, maxVal] = newValue as [number, number]
    setLocalValue([minVal, maxVal])
    setInputValues({
      min: minVal.toString(),
      max: maxVal.toString()
    })
    onChange?.([minVal, maxVal])
  }

  const handleInputChange = (type: 'min' | 'max', inputValue: string) => {
    setInputValues(prev => ({ ...prev, [type]: inputValue }))
    
    const numValue = parseInt(inputValue) || 0
    if (numValue < min || numValue > max) return

    const newValue: [number, number] = type === 'min' 
      ? [Math.min(numValue, localValue[1]), localValue[1]]
      : [localValue[0], Math.max(numValue, localValue[0])]
    
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleInputBlur = (type: 'min' | 'max') => {
    const numValue = parseInt(inputValues[type]) || 0
    const clampedValue = Math.max(min, Math.min(max, numValue))
    
    const newValue: [number, number] = type === 'min'
      ? [Math.min(clampedValue, localValue[1]), localValue[1]]
      : [localValue[0], Math.max(clampedValue, localValue[0])]
    
    setLocalValue(newValue)
    setInputValues({
      min: newValue[0].toString(),
      max: newValue[1].toString()
    })
    onChange?.(newValue)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <Label className="text-sm font-medium">{label}</Label>
      )}
      
      <div className="space-y-3">
        {/* Price Range Display */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {formatVal(localValue[0])}
          </span>
          <span className="text-muted-foreground">
            {formatVal(localValue[1])}
          </span>
        </div>

        {/* Slider */}
        <Slider
          min={min}
          max={max}
          step={step}
          value={localValue}
          onValueChange={handleSliderChange}
          disabled={disabled}
          className="w-full"
        />

        {/* Min/Max Labels */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatVal(min)}</span>
          <span>{formatVal(max)}</span>
        </div>

        {/* Input Fields */}
        {showInputs && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                Min Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {currency}
                </span>
                <Input
                  id="min-price"
                  type="number"
                  min={min}
                  max={localValue[1]}
                  value={inputValues.min}
                  onChange={(e) => handleInputChange('min', e.target.value)}
                  onBlur={() => handleInputBlur('min')}
                  disabled={disabled}
                  className="pl-8"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                Max Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {currency}
                </span>
                <Input
                  id="max-price"
                  type="number"
                  min={localValue[0]}
                  max={max}
                  value={inputValues.max}
                  onChange={(e) => handleInputChange('max', e.target.value)}
                  onBlur={() => handleInputBlur('max')}
                  disabled={disabled}
                  className="pl-8"
                  placeholder={max.toString()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 