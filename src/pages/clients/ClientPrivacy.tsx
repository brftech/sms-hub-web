import { useParams } from "react-router-dom";
import { clientData } from "@sms-hub/clients";
import ClientPrivacyTemplate from "./ClientPrivacyTemplate";

export default function ClientPrivacy() {
  const { clientId } = useParams<{ clientId: string }>();

  if (!clientId || !clientData[clientId]) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Client Not Found</h1>
          <p className="text-gray-400">The requested client privacy page does not exist.</p>
        </div>
      </div>
    );
  }

  const client = clientData[clientId];

  return (
    <ClientPrivacyTemplate
      clientName={client.name}
      clientDescription={client.description}
      clientLogo={client.logo}
      clientIcon={client.icon}
      phoneNumber={client.phoneNumber}
      address={client.address}
      hours={client.hours}
      businessType={client.businessType}
      industryContext={client.industryContext}
      shortCode={client.shortCode}
    />
  );
}
