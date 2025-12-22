# Command: Analyze Change Impact

You are an expert in static code analysis and software architecture.

## Step 1: Identify Changed Files

- Use `git diff --name-only HEAD` (or staged files if specified)
- List all modified, added, and deleted files

## Step 2: Build or Update Dependency Graph

- For each changed file:
  - Identify all direct imports and exports
  - Identify files that import this file
- Construct a mental dependency graph across the project

## Step 3: Impact Analysis

For each changed file:

1. Direct impact:
   - Files that directly depend on it
2. Transitive impact:
   - Higher-level modules, pages, services, or APIs
3. Runtime impact:
   - Config, environment, initialization order, or shared state changes

## Step 4: Scope Summary

Output a structured report:

- Changed Files
- Directly Impacted Files
- Transitively Impacted Modules
- Risk Level (Low / Medium / High)
- Suggested Test Scope

## Step 5: Save Results

Summarize the dependency relationships and impact scope in:
`.cursor/docs/dependency-graph.md`

Use clear bullet points and module grouping.
