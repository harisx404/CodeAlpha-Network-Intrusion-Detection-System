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
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
};

module.exports = createJestConfig(customJestConfig);
