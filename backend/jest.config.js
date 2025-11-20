/** @type {import('ts-jest').JestConfigWithTsJest} */

export const preset = 'ts-jest';

export const testEnvironment = 'node';

export const testMatch = ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'];

export const moduleFileExtensions = ['ts', 'js', 'json', 'node'];

export const globalSetup = '<rootDir>/tests/jest.global-setup.ts';

export const globalTeardown = '<rootDir>/tests/jest.global-teardown.ts';
