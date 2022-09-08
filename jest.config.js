// jest.config.js
module.exports = {
    preset: 'ts-jest',
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    verbose: true,
    testTimeout: 10000,
    setupFiles: ["../jest-setup-file.ts"]
};