import ProfessionalRegistrationForm from "../components/ProfessionalRegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Registration - PROVISIONINGTECH Company",
  description: "Register as a service technician or professional partner with PROVISIONINGTECH Company.",
};

export default function RegistrationFormPhpPage() {
  return <ProfessionalRegistrationForm />;
}
