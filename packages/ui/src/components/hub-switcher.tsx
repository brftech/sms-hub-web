import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { HubType, HUB_CONFIGS } from "../types";
import { cn } from "@sms-hub/utils";
import { useHub } from "../contexts/HubContext";
import { Button } from "./button";
import { Command, CommandGroup, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { HubLogo } from "./hub-logo";

interface HubSwitcherProps {
  className?: string;
  disabled?: boolean;
}

export const HubSwitcher: React.FC<HubSwitcherProps> = ({
  className,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const { currentHub, switchHub } = useHub();

  const hubs = Object.entries(HUB_CONFIGS).map(([hubType, config]) => ({
    hubType: hubType as HubType,
    ...config
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
          disabled={disabled}
        >
          <div className="flex items-center">
            <HubLogo hubType={currentHub} variant="icon" size="sm" />
            <span className="ml-2">{HUB_CONFIGS[currentHub].name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {hubs.map((hub) => (
                <CommandItem
                  key={hub.id}
                  value={hub.hubType}
                  onSelect={(value: string) => {
                    switchHub(value as HubType);
                    setOpen(false);
                  }}
                  className="data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                >
                  <div className="flex items-center">
                    <HubLogo hubType={hub.hubType} variant="icon" size="sm" />
                    <span className="ml-2">{hub.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentHub === hub.hubType ? "opacity-100" : "opacity-0"
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
