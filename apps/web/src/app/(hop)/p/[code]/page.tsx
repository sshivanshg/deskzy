import {
  createHopGenerateMetadata,
  createHopPage,
} from "@/lib/link-hop-page";
import { LINK_PUBLIC_PREFIX } from "@/lib/link-path";

export const generateMetadata = createHopGenerateMetadata(LINK_PUBLIC_PREFIX);
export default createHopPage();
