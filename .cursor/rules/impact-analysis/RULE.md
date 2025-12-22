---
alwaysApply: true
description: Project-wide dependency and impact analysis rules
globs:
  - '**/*.{ts,tsx,js,jsx,py,go,java}'
---

You must reason about this codebase using a dependency graph mindset.

## Dependency Definition Rules

1. A file is considered dependent on another file if:

   - It imports it directly
   - It re-exports symbols from it
   - It calls functions or uses types defined in it
   - It depends on runtime side effects (e.g. config, polyfills, global state)

2. Dependency directions:
   - A → B means A depends on B
   - Changes in B may impact A

## Impact Scope Rules

When files are modified:

- Direct dependents are always considered impacted
- Transitive dependents must be included unless explicitly proven isolated
- Test files are impacted if their target modules are impacted
- API / interface changes have wider blast radius than internal logic changes

## Output Expectations

When asked for impact analysis:

- Always list:
  1. Modified files
  2. Directly impacted files
  3. Transitively impacted modules or features
- Group impacts by logical module or domain if possible
- Be conservative: prefer false positives over missing impact

This rule applies globally whenever analyzing changes, commits, or refactors.
