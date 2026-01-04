# AGENT_CONTEXT.md

## 🛑 CRITICAL: READ THIS FIRST

This repository is a **strict, headless gamification engine**.
All future development must adhere to the laws defined in this document.
Violation of these laws is a project failure.

---

## 🏗 Core Intent

To build a **framework-agnostic, event-driven** gamification engine that can power any application (web, mobile, backend) without imposing:
- UI components
- Database choices
- HTTP frameworks
- Specific backend runtimes

This engine calculates state; it does not render it.

---

## ⚖️ Architectural Laws (Non-Negotiable)

### 1. Headless by Design
- **NO** UI code (React, Vue, HTML, CSS).
- **NO** HTTP endpoints (Express, Fastify).
- **NO** Database drivers in core logic.

### 2. Strict Dependency Direction
The dependency graph is **DAG (Directed Acyclic Graph)**.
Flow is strictly **downwards**:

`sdk` -> `adapters`, `engine-core`
`adapters` -> `engine-core`
`rules` -> `engine-core` (contracts only)
`engine-core` -> `events`, `domain`
`events` -> `domain`
`domain` -> **NOTHING**

### 3. State & Events
- **Actions** mutate state.
- **Events** are side-effects of mutation.
- **Derived State** (Levels, Ranks) is calculated on-the-fly or cached, never authoritative.

---

## 🚫 Explicit Prohibitions

1.  **`domain` imports NOTHING.**
    - No `import { ... }` from any other workspace.
    - Pure Types/Interfaces only.
2.  **No package may import from `sdk`.**
    - The SDK is the consumer entry point, not a dependency.
3.  **No package may depend on implementation logic.**
    - Depend on *contracts* (interfaces), not classes.
4.  **No package may reference storage, UI, or frameworks.**
    - `localStorage`, `window`, `document`, `express` are forbidden in `core`, `domain`, `rules`.

---

## 📦 Package Responsibilities

### `packages/domain`
- **Purpose**: Purest definitions of the gamification domain.
- **Contains**: `Player`, `Metric`, `Achievement` interfaces.
- **Allowed Deps**: None.

### `packages/events`
- **Purpose**: Canonical domain events.
- **Contains**: `XPGranted`, `LevelUp`, `AchievementUnlocked` types.
- **Allowed Deps**: `@temify/domain`.

### `packages/engine-core`
- **Purpose**: The brain of the engine. Defines *how* things work, not *what* happens.
- **Contains**: `GamificationEngine` interface, `Action` processors.
- **Allowed Deps**: `@temify/domain`, `@temify/events`.

### `packages/rules`
- **Purpose**: Rule Contracts and definitions.
- **Contains**: Interfaces for constraints and formulas. **NO EVALUATION LOGIC**.
- **Allowed Deps**: `@temify/domain`, `@temify/engine-core`.

### `packages/adapters`
- **Purpose**: Interfaces for the outside world to plug in.
- **Contains**: `StorageAdapter`, `EventBusAdapter` contracts.
- **Allowed Deps**: `@temify/engine-core`.

### `packages/sdk`
- **Purpose**: The public face of the library.
- **Contains**: Developer-friendly API wrapper.
- **Allowed Deps**: All internal packages.

---

## 🔮 Phase Awareness

**Current Phase: 3.5 (Scaffolding)**
- **Goal**: Structure and definitions.
- **Forbidden**: Logic, algorithms, persistence code.

**Next Phases**:
- **Phase 4**: Core Logic Implementation
- **Phase 5**: Adapters & Plugins
- **Phase 6**: SDK & Developer Experience

If you are an agent working on this repo, **CHECK YOUR PHASE**.
Do not implement Phase 5 features in Phase 4.

---

## 💡 Guidance for Future Agents

*   When asked to "implement XP", check if the *interface* exists first.
*   If you need to store data, define a `StorageAdapter` interface, do NOT write MongoDB code.
*   If you need to emit an event, define the `Event` type in `events` package first.
*   **Refactor ruthlessly** if dependencies start pointing the wrong way.
