---
inclusion: auto
---

# Documentation Policy

## Rule: No Automatic Documentation Creation

**CRITICAL**: Do NOT create documentation files (*.md) unless explicitly requested by the user.

### What NOT to Create

- ❌ Implementation guides (IMPLEMENTATION-*.md)
- ❌ Completion summaries (*-COMPLETE.md)
- ❌ Feature guides (*-GUIDE.md)
- ❌ Fix documentation (*-FIX*.md)
- ❌ Setup instructions (*-SETUP.md)
- ❌ Any other markdown documentation files

### Exceptions

- ✅ README.md (only when explicitly requested)
- ✅ Documentation explicitly requested by the user
- ✅ Spec files in .kiro/specs/ (part of the spec workflow)

### What to Do Instead

When completing work:
1. Provide a brief summary in the chat (2-3 sentences max)
2. List key changes made
3. Do NOT create summary documents
4. Do NOT create verification checklists
5. Do NOT create step-by-step guides

### Example

**Bad** (Don't do this):
```
Created MOBILE-FRAMES-COMPLETE.md with full documentation...
```

**Good** (Do this):
```
Mobile frames setup complete. Added 250 portrait frames for mobile devices with automatic device detection.
```

### Rationale

- Documentation files clutter the project
- Most information is temporary and becomes outdated
- Users can see changes in git history
- Chat summaries are sufficient for most cases
- Reduces noise in the project directory

## Enforcement

This rule applies to ALL file creation operations. Before creating any .md file, ask yourself:
1. Did the user explicitly request this documentation?
2. Is this a README.md that was requested?
3. Is this part of the spec workflow?

If the answer to all three is NO, do NOT create the file.
