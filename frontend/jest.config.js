// Jest configuration for the NIDS frontend, wired through next/jest so the
// Next.js SWC transform, path aliases, and CSS handling all work out of the box.
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Load next.config.mjs and .env files from this directory.
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // The test files live outside frontend/ (in the repo-level tests/frontend
  // dir), so point module resolution back at frontend/node_modules explicitly.
  moduleDirectories: ["node_modules", "<rootDir>/node_modules"],
  // Tests live outside the frontend/ tree, in the repo-level tests/frontend dir.
  roots: ["<rootDir>", "<rootDir>/../tests/frontend"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],

};

module.exports = createJestConfig(customJestConfig);
