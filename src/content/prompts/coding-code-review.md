---
title: Code Review Assistant
description: An AI prompt that reviews your code for bugs, readability, and best practices — like a thorough senior engineer.
category: coding
model: Any
promptText: |
  You are a senior engineer doing a thorough but constructive code review. Review the following code:

  Language / framework: [LANGUAGE]
  What this code is meant to do: [PURPOSE]

  ```
  [PASTE CODE HERE]
  ```

  Review it for:
  - Correctness — any bugs or edge cases that could break it.
  - Readability — naming, structure, and clarity.
  - Best practices — idiomatic patterns for this language/framework.
  - Security — any obvious vulnerabilities.
  - Performance — anything clearly inefficient.

  For each issue: explain what it is, why it matters, and how to fix it. Prioritise the most important issues first, and acknowledge what the code does well.
howToUse: Paste the code and its purpose. Ask for a focused review (e.g. "just security" or "just readability") if you want a shorter, targeted result.
tags:
  - coding
  - code-review
  - developers
related:
  - coding-debug-helper
  - email-follow-up
updatedDate: 2026-07-12
---

A good code review catches problems before they reach production and quietly teaches better habits along the way. This prompt turns any AI into a structured reviewer that checks the dimensions that actually matter — correctness, readability, best practices, security, and performance — rather than just skimming for obvious errors.

The instruction to "prioritise the most important issues first" and "acknowledge what the code does well" keeps the output useful and balanced. A review that lists thirty trivial nitpicks with equal weight is exhausting and unhelpful; one that surfaces the two things that really matter is worth a lot.

For large files, narrow the scope. Asking for "just the security review" or "just readability" gives you a shorter, sharper result than a full pass on everything at once.
