import {
  createHopGenerateMetadata,
  createHopPage,
} from "@/lib/link-hop-page";
import { LINK_LEGACY_PREFIX } from "@/lib/link-path";

/** Legacy hop path — existing /r/{code} links keep working. */
export const generateMetadata = createHopGenerateMetadata(LINK_LEGACY_PREFIX);
export default createHopPage();
