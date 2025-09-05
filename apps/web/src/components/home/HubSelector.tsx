import { useHub } from "@sms-hub/ui";
import { PercyMD } from "./PercyMD";
import { Gnymble } from "./Gnymble";

const gnymbleBusinessTypes = [
  "cigar lounges...",
  "tobacco shops...",
  "wine bars...",
  "breweries...",
  "distilleries...",
  "cigar manufacturers...",
  "gun ranges...",
  "firearms dealers...",
  "hunting outfitters...",
  "sporting goods stores...",
  "outdoor recreation...",
  "tactical gear shops...",
];

const percymdBusinessTypes = [
  "medical practices...",
  "dental offices...",
  "specialty clinics...",
  "urgent care centers...",
  "mental health providers...",
  "veterinary clinics...",
];

export const HubSelector: React.FC = () => {
  const { currentHub } = useHub();

  switch (currentHub) {
    case "percymd":
      return <PercyMD businessTypes={percymdBusinessTypes} />;
    case "gnymble":
      return <Gnymble businessTypes={gnymbleBusinessTypes} />;
    default:
      return <Gnymble businessTypes={gnymbleBusinessTypes} />; // Default fallback
  }
};
