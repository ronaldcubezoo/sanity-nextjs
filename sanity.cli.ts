import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./sanity/env";

/**
 * CLI + hosted Studio — same project as `../sanity-check` (`wd0fub35` / `production`).
 * `api` uses `sanity/env.ts` so local `.env.local` stays the source of truth.
 */
export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  /** Hosted Studio URL: sanitycheckstudio.sanity.studio (letters only per Sanity rules) */
  studioHost: "sanitycheckstudio",
  deployment: {
    appId: "l6o4lwibl3fdbutk003xahs1",
    /**
     * Enable auto-updates for hosted studios.
     * @see https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
});
