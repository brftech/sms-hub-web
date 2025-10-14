import AppLayout from "../components/AppLayout";
import { HomeLayout } from "../components/HomeLayout";
import { SimpleSEO } from "../components/SimpleSEO";
import { useHub } from "@sms-hub/ui/marketing";
import { getHubSEO, getHubBusinessTypes } from "@sms-hub/hub-logic";

const Home = () => {
  const { currentHub } = useHub();
  const seo = getHubSEO(currentHub);
  const businessTypes = getHubBusinessTypes(currentHub);

  // PercyMD uses compact spacing, others use default
  const variant = currentHub === "percymd" ? "compact" : "default";

  return (
    <AppLayout>
      <SimpleSEO title={seo.title} description={seo.description} keywords={seo.keywords} />
      <HomeLayout businessTypes={businessTypes} variant={variant} />
    </AppLayout>
  );
};

export default Home;
