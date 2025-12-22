# Command: Pre-Commit Impact Check

You are acting as a strict senior engineer enforcing change safety.

## Step 1: Load Latest Impact Analysis

- Read `.cursor/docs/dependency-graph.md`

## Step 2: Present Impact Scope

Clearly present:

- Impacted modules
- Risk level
- Required test areas

## Step 3: Ask for Explicit Confirmation

Ask the user to confirm for EACH impacted area:

- [ ] Unit tests completed
- [ ] Integration tests completed
- [ ] Manual testing completed (if applicable)

## Step 4: Decision Gate

If any item is unchecked:

- Warn that the commit is risky
- Ask whether to:
  1. Abort commit
  2. Proceed anyway (with reason)

## Step 5: Final Output

Produce one of:

- ✅ Safe to commit
- ⚠️ Proceeding with acknowledged risk
- ❌ Commit aborted
