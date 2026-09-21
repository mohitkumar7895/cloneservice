import { getPolicy } from "../actions/policies";
import PolicyPageView from "../components/PolicyPageView";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions - PROVISIONINGTECH Company",
  description: "Terms and conditions for using PROVISIONINGTECH Company's home appliance repair and maintenance services.",
};

export default async function TermsAndConditionsPage() {
  const policy = await getPolicy("terms-and-conditions");
  return <PolicyPageView policy={policy} />;
}
