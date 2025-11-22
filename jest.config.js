// Jest Configuration
module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests', '<rootDir>/js'],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/**/*.test.js',
        '!js/**/*.spec.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    testTimeout: 10000
};

