import React, { useState } from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { HubType, HUB_CONFIGS } from "@sms-hub/types";
import { cn } from "@sms-hub/utils";
import { useHub, HubLogo } from "@sms-hub/ui";
import { useGlobalView } from "../contexts/GlobalViewContext";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@sms-hub/ui";

interface AdminHubSwitcherProps {
  className?: string;
  onHubChange?: () => void; // Callback to refresh data when hub changes
}

export const AdminHubSwitcher: React.FC<AdminHubSwitcherProps> = ({
  className,
  onHubChange,
}) => {
  const { currentHub, switchHub } = useHub();
  const { isGlobalView, setIsGlobalView } = useGlobalView();
  const [open, setOpen] = useState(false);

  const hubs = Object.values(HUB_CONFIGS);

  const handleSelection = (value: string) => {
    if (value === 'global') {
      setIsGlobalView(true);
      // Don't switch hub when going to global view
    } else {
      setIsGlobalView(false);
      switchHub(value as HubType);
    }
    setOpen(false);
    
    // Trigger the optional callback if provided
    if (onHubChange) {
      onHubChange();
    }
  };

  const currentDisplay = isGlobalView 
    ? { name: "Global View", icon: <Globe className="w-4 h-4" /> }
    : { name: HUB_CONFIGS[currentHub].name, icon: <HubLogo hubType={currentHub} variant="icon" size="sm" /> };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[200px] justify-between",
            isGlobalView 
              ? "bg-purple-50 border-purple-200 hover:bg-purple-100" 
              : "bg-white",
            className
          )}
        >
          <div className="flex items-center">
            {currentDisplay.icon}
            <span className="ml-2 text-sm font-medium">{currentDisplay.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <Command>
          <CommandList>
            <CommandGroup heading="View Options">
              {/* Global View Option */}
              <CommandItem
                value="global"
                onSelect={() => handleSelection('global')}
                className="data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
              >
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="ml-2">Global View</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    isGlobalView ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              
              {/* Separator */}
              <div className="my-1 border-b border-gray-200" />
              
              {/* Hub Options */}
              {hubs.map((hub) => (
                <CommandItem
                  key={hub.id}
                  value={hub.id}
                  onSelect={() => handleSelection(hub.id)}
                  className="data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                >
                  <div className="flex items-center">
                    <HubLogo hubType={hub.id} variant="icon" size="sm" />
                    <span className="ml-2">{hub.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      !isGlobalView && currentHub === hub.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};