# Temify — Headless Gamification Engine

Temify is a **headless, rules-driven gamification engine** for modern applications.

It provides production-grade building blocks for modeling **user progression, engagement, and competition**—such as XP, levels, achievements, streaks, quests, and leaderboards—**without imposing any UI, backend framework, database, or transport assumptions**.

Temify is designed to be embedded into existing systems as a pure logic engine. You bring your UI, APIs, storage, and business rules; Temify provides the deterministic gamification core.

---

## Why Temify Exists

Most gamification solutions fall into one of these traps:

* Tightly coupled to a specific UI or frontend framework
* Hard-wired to a backend or hosted service
* Difficult to customize without forking
* Impossible to audit or replay
* Unsafe to extend without breaking core logic

Temify was built to solve these problems by separating **gamification logic** from **product implementation concerns**.

If your application needs motivation systems but you do **not** want:

* A SaaS dependency
* Opinionated UX flows
* Hard-coded schemas
* Framework lock-in

…then Temify is designed for you.

---

## What Temify Is (and Is Not)

### Temify **IS**

* A **logic-only** gamification engine
* Deterministic and auditable
* TypeScript-first
* Modular and extensible
* Production-oriented, not a demo library

### Temify **IS NOT**

* A UI component library
* A hosted service
* A real-time socket server
* An analytics platform
* A product-specific gamification solution

Temify provides **capabilities**, not opinions about how your product should work.

---

## Core Capabilities

Temify supports the following gamification systems. Each system is optional and can be adopted incrementally.

### Points & Experience

* Multiple point types (XP, coins, tokens, etc.)
* Increment and decrement operations
* Min/max bounds
* Transaction history and source attribution
* Fully auditable mutations

### Levels

* XP-driven level calculation
* Configurable progression curves
* Level caps
* Level-up and level-down support
* Level-based rewards and unlocks

> Levels are **derived**, never stored.

### Achievements

* One-time achievements
* Progress-based achievements
* Tiered achievements
* Hidden or secret achievements
* Dependency chains
* One-time reward granting per tier

### Streaks

* Daily or periodic streaks
* Timezone-aware check-ins
* Grace periods and freezes
* Longest streak tracking
* Milestone rewards

### Quests & Missions

* One-time, daily, weekly, or seasonal quests
* Multi-objective quests
* Prerequisites and chaining
* Expiration handling
* Automatic or manual reward claiming

### Leaderboards

* Global or segmented leaderboards
* Time-windowed rankings (daily, weekly, monthly, all-time)
* Configurable tie-breaking strategies
* Rank movement tracking

> Leaderboards are **computed views**, not stored state.

### Event System

* Domain events for all state transitions
* Deterministic ordering (per player)
* Synchronous and asynchronous listeners
* Failure isolation
* Primary extension mechanism

---

## Architectural Philosophy

Temify is built around three strict principles:

### 1. Headless by Default

The engine exposes **pure domain logic** and **deterministic state transitions**.

UI, APIs, databases, caching, and transport layers live **outside** the engine.

### 2. Deterministic and Auditable

Given the same inputs and configuration:

* The engine always produces the same output
* All state changes are traceable
* No hidden side effects exist

This enables:

* Reliable testing
* Event replay
* Debugging and audits

### 3. Modular and Extensible

Each gamification system is isolated into its own module.

Modules:

* Do not depend on each other directly
* Communicate only through events
* Can be enabled, disabled, or extended safely

---

## High-Level Architecture

```
Application / SDK
        │
        ▼
Integration Layer (optional)
- Persistence adapters
- Backend middleware
- Client SDKs
        │
        ▼
Core Gamification Engine

- Event Bus
- Metrics & XP
- Levels & Progression
- Achievements
- Streaks
- Quests
- Leaderboards
```

### Dependency Direction (Strict)

* Core engine **never** depends on storage, SDKs, or frameworks
* Adapters and SDKs depend on the core engine
* Modules communicate via events only

---

## Core Concepts

Temify models gamification as **state transitions driven by actions**.

### Actions

Explicit commands invoked by the application.

Examples:

* Add XP
* Check in for a streak
* Update quest progress

Actions:

* Are immutable
* Trigger rule evaluation
* May mutate user state

### Events

Immutable records emitted **after** successful state changes.

Examples:

* `xp.added`
* `level.up`
* `achievement.unlocked`

Events:

* Never mutate state
* Are order-preserving per player
* Form the integration boundary

### State

* **Mutable state**: user metrics, progress, streak counters
* **Derived state**: levels, leaderboards, rankings

Derived state is **never** persisted as source of truth.

---

## Deterministic State Flow (Example)

```
Action: Add XP
  → Validate metric bounds
  → Update XP balance
  → Recompute level
  → Emit level-up event (if applicable)
  → Evaluate achievements
  → Invalidate leaderboard views
```

Every step is explicit, ordered, and observable.

---

## Extensibility Model

Temify is designed to be extended safely.

Extensions can:

* Register event listeners
* Define custom metrics
* Add achievement evaluators
* Add ranking strategies
* Handle rewards

Extensions **cannot**:

* Mutate core state directly
* Bypass validation rules
* Break invariants

This prevents plugin-induced corruption.

---

## Storage & Persistence

Temify does not assume any database.

Instead, it defines **clear state ownership rules** so it can work with:

* SQL databases
* NoSQL databases
* Event stores
* In-memory storage

Persistence is handled via **adapters**, not the core engine.

---

## Who This Project Is For

Temify is well-suited for:

* Product teams building gamified applications
* Backend engineers who want full control over infrastructure
* SDK authors building reusable platforms
* Companies that need auditability and correctness
* Open-source contributors interested in domain-driven design

It is likely **not** a good fit if you want:

* A ready-made UI
* A hosted gamification service
* Minimal configuration with fixed behavior

---

## Project Status

Temify is under **active design and phased implementation**.

Current focus:

* Domain modeling
* Architecture definition
* Deterministic core engine

Public APIs and integrations will be introduced only after the core is stable.

---

## How to Get Involved

* Read the architectural documentation
* Review the domain model
* Open discussions or RFCs before proposing major changes
* Follow dependency and invariants strictly

This project values **correctness, clarity, and maintainability** over speed.

---

## License

MIT License (planned)

---

## Final Note

Temify is intentionally opinionated about *what it does not do*.

That discipline is what allows it to remain:

* Headless
* Extensible
* Deterministic
* Production-ready

If you are looking to build gamification **as infrastructure**, not as a UI feature, Temify is designed to be that foundation.
