#!/bin/bash

packages=(
  "core:Headless gamification engine core infrastructure"
  "engine:Main orchestrator that composes all gamification modules"
  "metrics:Points, XP, and multi-currency metric system"
  "levels:Level computation and progression curves"
  "achievements:Achievement evaluation and progress tracking"
  "streaks:Streak tracking with timezone-aware check-ins"
  "quests:Quest/mission lifecycle and objective management"
  "leaderboards:Leaderboard computation and ranking strategies"
  "adapters:State persistence adapters (in-memory, etc.)"
)

for pkg_info in "${packages[@]}"; do
  IFS=':' read -r name description <<< "$pkg_info"
  
  # Create package.json
  cat > "packages/$name/package.json" << PKGJSON
{
  "name": "@temify/$name",
  "version": "0.0.0",
  "description": "$description",
  "license": "MIT",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist *.tsbuildinfo"
  },
  "publishConfig": {
    "access": "public"
  }
}
PKGJSON

  # Create tsconfig.json
  cat > "packages/$name/tsconfig.json" << TSCFG
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
TSCFG

  # Create tsup.config.ts
  cat > "packages/$name/tsup.config.ts" << TSUPCFG
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
TSUPCFG

  # Create src/index.ts
  cat > "packages/$name/src/index.ts" << INDEXTS
/**
 * @temify/$name
 * $description
 */

export const version = '0.0.0';
INDEXTS

  # Create README.md
  cat > "packages/$name/README.md" << README
# @temify/$name

$description

## Installation

\`\`\`bash
npm install @temify/$name
\`\`\`

## Usage

Coming soon...

## License

MIT
README

  echo "✓ Created @temify/$name"
done

echo ""
echo "All packages scaffolded successfully!"
