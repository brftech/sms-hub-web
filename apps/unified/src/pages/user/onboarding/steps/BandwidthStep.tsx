import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import { StepComponentProps } from "@sms-hub/types";
import { Phone, ChevronRight, RefreshCw } from "lucide-react";

export function BandwidthStep({ onComplete }: StepComponentProps) {
  // const { hubConfig } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string>("");

  // Mock available phone numbers
  const [availableNumbers] = useState([
    { number: "+1-555-0101", area: "New York, NY", type: "Local" },
    { number: "+1-555-0202", area: "Los Angeles, CA", type: "Local" },
    { number: "+1-555-0303", area: "Chicago, IL", type: "Local" },
    { number: "+1-888-555-0001", area: "Toll-free", type: "Toll-free" },
  ]);

  const handleSubmit = async () => {
    if (!selectedNumber) return;

    setIsSubmitting(true);

    try {
      // TODO: Reserve phone number with Bandwidth
      await onComplete({
        assigned_phone_number: selectedNumber,
        bandwidth_account_setup: true,
      });
    } catch (error) {
      console.error("Phone number assignment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-5 h-5 mr-2 hub-text-primary" />
          Phone Number Assignment
        </CardTitle>
        <CardDescription>
          Select a dedicated phone number for your SMS campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Available Numbers</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-2">
            {availableNumbers.map((phoneNumber) => (
              <div
                key={phoneNumber.number}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedNumber === phoneNumber.number
                    ? "border-hub-primary bg-hub-primary/5"
                    : "border-border hover:border-hub-primary/50"
                }`}
                onClick={() => setSelectedNumber(phoneNumber.number)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono font-semibold">
                      {phoneNumber.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {phoneNumber.area}
                    </div>
                  </div>
                  <Badge
                    variant={
                      phoneNumber.type === "Toll-free" ? "default" : "secondary"
                    }
                  >
                    {phoneNumber.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your selected number will be reserved</li>
            <li>• Bandwidth account will be configured</li>
            <li>• SMS routing will be activated</li>
            <li>• Your campaign will be ready for messages</li>
          </ul>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            className="hub-bg-primary hover:hub-bg-primary/90"
            disabled={!selectedNumber || isSubmitting}
          >
            {isSubmitting ? "Assigning Number..." : "Activate Platform"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
