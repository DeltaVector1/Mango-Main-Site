---
title: Yes it's just doing compression
date: 2023-06-15
excerpt: In Ted Chiang's New Yorker article, he likened language models to "a blurry JPEG". JPEG is a lossy compression method for images.
---

# Yes it's just doing compression

In Ted Chiang's New Yorker article, he likened language models to "a blurry JPEG". JPEG is a lossy (Edit: I meant to quote Ted Chiang, but slipped up) compression method for images. And some people absolutely hated this comparison. I'm going to attempt to convince you that the objective of maximising log-likelihood is optimising for compression. And then I'm going to cover something perhaps a little more controversial: compression and understanding aren't antithetical concepts.

## Compression is understanding

Compression is fundamentally about finding patterns and structure in data. When we compress text, we're identifying redundancies, patterns, and statistical regularities. This is not just a mechanical process; it's a form of understanding the underlying structure of the language.

Consider how a good compression algorithm works:

1. It identifies frequent patterns and assigns them shorter codes
2. It recognizes contextual dependencies between elements
3. It builds a model of the data that captures its essential characteristics

This is remarkably similar to how we might describe aspects of human understanding: recognizing patterns, understanding context, and building mental models.

## Language Models as Compressors

When a language model is trained to predict the next token in a sequence, it's essentially learning a compression model for language. The better it can predict the next token, the better it understands the patterns and structures in the language.

The log-likelihood objective used in training language models is directly related to compression. In information theory, the optimal code length for a symbol is proportional to the negative log probability of that symbol. So by maximizing log-likelihood, language models are minimizing the description length of the data - in other words, compressing it.

## Beyond Simple Compression

Of course, language models go beyond simple statistical compression. They learn hierarchical representations, capture long-range dependencies, and model complex relationships between concepts. These capabilities emerge from the compression objective combined with the architecture and scale of modern models.

The fact that language models can generate coherent text, answer questions, and perform various language tasks is evidence that the compression objective leads to a form of understanding. Not human understanding, certainly, but a statistical understanding of language structure and meaning.

## Conclusion

Rather than seeing compression and understanding as opposed concepts, we might view them as deeply connected. The process of finding efficient representations of data - compression - requires capturing the underlying structure and patterns, which is a fundamental aspect of understanding.

So perhaps Ted Chiang's comparison wasn't so far off after all, though I'd argue it doesn't tell the whole story. Language models are indeed compressors, but in compressing language, they develop a form of understanding that enables their remarkable capabilities.