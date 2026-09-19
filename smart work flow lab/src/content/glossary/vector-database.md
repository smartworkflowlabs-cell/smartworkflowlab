---
term: Vector Database
aliases:
  - vector database
  - vector store
definition: A vector database stores information as numerical representations of meaning, so an AI can find results by similarity — retrieving text that's conceptually related to a query, not just an exact keyword match.
category: AI Concepts
related:
  - rag
  - llm
---

A **vector database** is a specialised store that powers the "search by meaning" behind modern AI. Instead of matching exact words, it finds information that is _conceptually_ similar to what you asked — which is exactly what techniques like [RAG](/glossary/rag) rely on.

## Why it exists

Traditional databases are great at exact matches: find the row where the name equals "Ahmed." But AI needs something different — the ability to find text that _means_ the same thing even when the words differ. A search for "how do I cancel" should also surface a document titled "ending your subscription," even with no shared keywords.

## How it works, briefly

AI models can turn any piece of text into a list of numbers — a "vector" — that captures its meaning. Similar meanings produce similar vectors. A vector database stores these and, given a new query vector, quickly finds the closest matches. That's how a [RAG](/glossary/rag) system locates the most relevant chunks of your documents before the [language model](/glossary/llm) writes an answer.

## Vector database in one sentence

A vector database finds information by meaning rather than exact keywords, which is what lets AI retrieve the most relevant text to answer a question.
