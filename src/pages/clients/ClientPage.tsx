import { useParams, useLocation } from "react-router-dom";
import { clientData } from "./clientData";
import ClientPageTemplate from "./ClientPageTemplate";

export default function ClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const location = useLocation();

  // Handle special case for /donsbt route
  let actualClientId = clientId;
  if (location.pathname === "/donsbt") {
    actualClientId = "donsbt";
  }

  if (!actualClientId || !clientData[actualClientId]) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Client Not Found
          </h1>
          <p className="text-gray-400">
            The requested client page does not exist.
          </p>
        </div>
      </div>
    );
  }

  const client = clientData[actualClientId];

  return (
    <ClientPageTemplate
      clientName={client.name}
      clientDescription={client.description}
      clientLogo={client.logo}
      clientIcon={client.icon}
      phoneNumber={client.phoneNumber}
      address={client.address}
      hours={client.hours}
      features={client.features}
      benefits={client.benefits}
      ctaText={client.ctaText}
      ctaButtonText={client.ctaButtonText}
      privacyLink={client.privacyLink}
      termsLink={client.termsLink}
      clientWebsite={client.clientWebsite}
    />
  );
}
