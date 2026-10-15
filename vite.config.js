import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      svelte({
        prebundleSvelteLibraries: false,
      }),
      tailwindcss(),
      svelteTesting(),
    ],
    server: {
      port: Number(env.APP_PORT) || 3004,
    },
    preview: {
      port: Number(env.APP_PORT) || 3004,
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, "/");
            if (normalizedId.includes("node_modules/svelte")) {
              return "framework";
            }
            if (normalizedId.includes("node_modules/lucide-svelte")) {
              return "icons";
            }
            if (
              normalizedId.includes("src/helpers") ||
              normalizedId.includes("src/hooks") ||
              normalizedId.includes("src/router.js")
            ) {
              return "shared";
            }
            if (normalizedId.includes("src/features/users")) {
              return "users";
            }
            if (normalizedId.includes("src/features/linktrees/modals")) {
              return "linktrees-modals";
            }
            if (normalizedId.includes("src/features/linktrees/pages/DetailPage")) {
              return "linktrees-detail";
            }
            if (normalizedId.includes("src/features/linktrees")) {
              return "linktrees";
            }
          },
        },
      },
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      exclude: ["**/node_modules/**", "**/dist/**", "**/ref_svelte/**", "**/scratch_sections/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,svelte}"],
        exclude: [
          "src/main.js",
          "src/setupTests.js",
          "src/test-utils.js",
          "**/*.test.{js,jsx}",
          "node_modules/**",
          ".docs/**",
          "ref_svelte/**",
          "scratch_sections/**",
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});
