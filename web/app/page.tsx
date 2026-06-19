import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

// The bare root just sends visitors to the default locale.
export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
