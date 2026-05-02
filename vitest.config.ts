import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    // Use the Node environment since Prisma runs in Node, not a browser.
    environment: "node",

    // Give DB operations more time than the default 5s — migrations and
    // first-connection setup can be slow on a cold Docker container.
    testTimeout: 15000,
  },
  resolve: {
    // Mirror the @/ alias from tsconfig so imports like "@/lib/db" work in tests.
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
