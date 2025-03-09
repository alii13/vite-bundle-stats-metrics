import bundleStatsMetrics from "vite-bundle-stats-metrics";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [bundleStatsMetrics({ logToConsole: "summary" })]
});
