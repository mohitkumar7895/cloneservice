import { getPolicy } from "../actions/policies";
import PolicyPageView from "../components/PolicyPageView";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy - PROVISIONINGTECH Company",
  description: "Learn how PROVISIONINGTECH Company collects, uses, and protects your information.",
};

export default async function PrivacyPolicyPage() {
  const policy = await getPolicy("privacy-policy");
  return <PolicyPageView policy={policy} />;
}
