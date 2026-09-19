---
term: RAG (Retrieval-Augmented Generation)
aliases:
  - RAG
  - retrieval augmented generation
definition: RAG is a technique that lets an AI model pull in relevant information from an external source before answering, so its responses are grounded in your data rather than only what it learned during training.
category: AI Concepts
related:
  - llm
  - vector-database
  - ai-agent
---

**Retrieval-Augmented Generation (RAG)** is one of the most important techniques behind practical business AI. In plain terms, it connects a language model to an external knowledge source — your documents, a database, a help centre — so that when you ask a question, the system first _retrieves_ the most relevant information and then _generates_ an answer using it.

## Why RAG matters

A standard language model only knows what it learned during training. It can't see your company's internal documents, this month's pricing, or last week's support tickets — and if you ask about them, it may confidently make something up. RAG fixes this by giving the model real, current context to work from.

This is why RAG powers most business AI you actually find useful: internal chatbots that answer from company policies, support tools that cite the real knowledge base, and research assistants that quote your own documents instead of guessing.

## How it works, briefly

When you ask a question, a RAG system converts it into a search, finds the most relevant chunks of text from your knowledge source (often using a [vector database](/glossary/vector-database)), and hands those chunks to the [language model](/glossary/llm) along with your question. The model then writes an answer grounded in that retrieved material — and can cite where it came from.

## RAG in one sentence

If a plain chatbot is a smart person answering from memory, a RAG system is that same person with your filing cabinet open in front of them — able to look things up before they speak.
