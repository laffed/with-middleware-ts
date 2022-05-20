import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node", 
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: {
        rootDir: '.'
      }
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}'
  ], 
  coverageThreshold: {
    global: {
      branches: 75, 
      functions: 75, 
      lines: 75, 
      statements: 75
    }
  }
};

export default config;