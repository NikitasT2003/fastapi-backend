import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface BusinessValueDrawerProps {
  budgetRange: number[];
  setBudgetRange: (value: number[]) => void;
}

export function BusinessValueDrawer({ budgetRange, setBudgetRange }: BusinessValueDrawerProps) {
  const [minValue, setMinValue] = React.useState(budgetRange[0])
  const [maxValue, setMaxValue] = React.useState(budgetRange[1])

  const handleMinChange = (value: number[]) => {
    setMinValue(value[0])
  }

  const handleMaxChange = (value: number[]) => {
    setMaxValue(value[0])
  }

  const handleApply = () => {
    setBudgetRange([minValue, maxValue])
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">Set Business Value Range</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Set Business Value Range</DrawerTitle>
          <DrawerDescription>Adjust the range to filter businesses by their estimated value.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="min-value">Minimum Value</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="min-value"
                min={0}
                max={10000000}
                step={100000}
                value={[minValue]}
                onValueChange={handleMinChange}
              />
              <Input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              ${minValue.toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-value">Maximum Value</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="max-value"
                min={0}
                max={10000000}
                step={100000}
                value={[maxValue]}
                onValueChange={handleMaxChange}
              />
              <Input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              ${maxValue.toLocaleString()}
            </span>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleApply}>Apply</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

