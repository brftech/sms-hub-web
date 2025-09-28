import AppLayout from "../components/AppLayout";
import { HubSelector } from "../components/home";
import { SimpleSEO } from "../components/SimpleSEO";

const Home = () => {
  return (
    <AppLayout>
      <SimpleSEO
        title="Gnymble - SMS for Businesses That Break the Mold"
        description="The SMS platform that delivers excellence for regulated businesses, employers, and retailers that demand SMS that actually works."
        keywords="SMS platform, business texting, regulated businesses, compliance, employee communication, retail SMS, premium messaging"
      />

      <HubSelector />
    </AppLayout>
  );
};

export default Home;
