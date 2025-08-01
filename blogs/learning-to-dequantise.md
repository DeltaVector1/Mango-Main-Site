---
title: Learning to Dequantise with Truncated Flows
date: 2023-08-10
excerpt: A pet idea that I've been coming back to time and again is doing autoregressive language modelling with "stochastic embeddings".
---

# Learning to Dequantise with Truncated Flows

A pet idea that I've been coming back to time and again is doing autoregressive language modelling with "stochastic embeddings". Each word would have a distribution over the embedding that represented it, instead of a deterministic embedding. The thought would be that modelling word embeddings in this way would better represent the ability for word meanings to overlap while not completely subsuming the other, or in some cases have multi-modal representations because of the distinct word senses in which they are used (think 'bank' to refer to the 'land alongside a body of water' or 'a financial institution').

## The Challenge of Discrete Data

Language is inherently discrete - words, characters, or tokens are distinct units with no natural continuous representation. This discreteness poses challenges for many machine learning methods that work best with continuous data.

Traditional approaches map these discrete tokens to continuous embeddings, but these are typically deterministic: each token maps to exactly one point in the embedding space. This fails to capture the inherent ambiguity and context-dependence of language.

## Stochastic Embeddings

The core idea of stochastic embeddings is to represent each token not as a point, but as a distribution over the embedding space. This distribution can capture:

1. **Semantic uncertainty**: Words with multiple meanings can have multi-modal distributions
2. **Contextual variation**: The same word used in different contexts can occupy different regions of the embedding space
3. **Semantic relationships**: Overlap between distributions can represent semantic similarity

## Implementation with Normalizing Flows

Normalizing flows provide a powerful framework for implementing stochastic embeddings. A flow-based model can transform a simple base distribution (like a Gaussian) into a complex, potentially multi-modal distribution that represents a token's semantic space.

The key advantages of flows for this application include:

- They can represent complex distributions with multiple modes
- They allow exact likelihood computation, which is crucial for training language models
- They can be conditioned on context, allowing the embedding distribution to shift based on surrounding words

## Truncated Flows for Efficiency

One challenge with normalizing flows is computational efficiency, especially in the high-dimensional spaces often used for embeddings. Truncated flows offer a compromise:

1. Use a full flow for a lower-dimensional projection of the embedding space
2. Model only the most important dimensions stochastically
3. Represent less important dimensions deterministically

This approach concentrates computational resources on the dimensions that capture the most semantic variation.

## Potential Benefits

Stochastic embeddings with truncated flows could offer several advantages for language modeling:

- **Improved disambiguation**: Better handling of polysemous words
- **Uncertainty representation**: The model can express uncertainty about word meanings
- **Smoother transitions**: Gradual semantic shifts can be represented more naturally
- **Improved generalization**: The stochastic nature may help prevent overfitting to specific contexts

## Conclusion

While this remains a pet idea rather than a fully implemented approach, the combination of autoregressive language modeling with stochastic embeddings implemented via truncated normalizing flows offers an intriguing direction for research. It addresses fundamental limitations in how we represent the meaning of words in computational systems and could lead to more nuanced and powerful language models.

The next steps would involve developing efficient implementations of truncated flows suitable for the high-dimensional, high-throughput requirements of modern language models, and evaluating whether the theoretical advantages translate to practical improvements in language understanding and generation.