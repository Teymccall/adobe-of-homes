import * as React from "react"
import { X, Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  maxCount?: number
  disabled?: boolean
  className?: string
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  maxCount = 3,
  disabled = false,
  className
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value)

  React.useEffect(() => {
    setSelectedValues(value)
  }, [value])

  const handleSelect = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue]
    
    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  const handleRemove = (optionValue: string) => {
    const newValues = selectedValues.filter((v) => v !== optionValue)
    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value))
  const remainingCount = selectedValues.length - maxCount

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-[40px] h-auto p-1",
            className
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap">
            {selectedOptions.length === 0 && (
              <span className="text-muted-foreground text-sm ml-2">
                {placeholder}
              </span>
            )}
            {selectedOptions.slice(0, maxCount).map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                {option.icon && (
                  <option.icon className="h-3 w-3" />
                )}
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRemove(option.value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleRemove(option.value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{remainingCount} more
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValues.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.icon && (
                  <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 