import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { HubType, HUB_CONFIGS } from '@sms-hub/types'
import { cn } from '@sms-hub/utils'
import { useHub } from '../providers/hub-provider'
import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { HubLogo } from './hub-logo'

interface HubSwitcherProps {
  className?: string
  disabled?: boolean
}

export const HubSwitcher: React.FC<HubSwitcherProps> = ({ className, disabled = false }) => {
  const { currentHub, switchHub, showHubSwitcher } = useHub()
  const [open, setOpen] = React.useState(false)

  if (!showHubSwitcher) {
    return null
  }

  const hubs = Object.values(HUB_CONFIGS)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          disabled={disabled}
        >
          <div className="flex items-center">
            <HubLogo hubType={currentHub} variant="icon" size="sm" />
            <span className="ml-2">{HUB_CONFIGS[currentHub].displayName}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search hubs..." />
          <CommandList>
            <CommandEmpty>No hub found.</CommandEmpty>
            <CommandGroup>
              {hubs.map((hub) => (
                <CommandItem
                  key={hub.id}
                  value={hub.id}
                  onSelect={(value) => {
                    switchHub(value as HubType)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    <HubLogo hubType={hub.id} variant="icon" size="sm" />
                    <span className="ml-2">{hub.displayName}</span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentHub === hub.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}