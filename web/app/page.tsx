import { redirect } from "next/navigation";
import { LANDING_LOCALE } from "@/lib/i18n";

// The bare root just sends visitors to the default landing locale.
export default function RootRedirect() {
  redirect(`/${LANDING_LOCALE}`);
}
