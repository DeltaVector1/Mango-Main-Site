---
title: The New XOR Problem
date: 2023-07-20
excerpt: In 1969, Marvin Minsky and Seymour Papert published Perceptrons. In it, they showed that a single-layer perceptron cannot compute the XOR function.
---

# The New XOR Problem

In 1969, Marvin Minsky and Seymour Papert published Perceptrons: An Introduction to Computational Geometry. In it, they showed that a single-layer perceptron cannot compute the XOR function. The main argument relies on linear separability: Perceptrons are linear classifiers, which essentially means drawing a line to separate input that would result in 1 versus 0. You can do it in the OR and AND case, but not XOR. Of course, we're way past that now, neural networks with one hidden layer can solve that problem.

## The Historical Impact

The XOR problem is often cited as one of the reasons for the first AI winter. The inability of the simplest neural networks to solve this basic problem led many researchers to abandon the field, believing that neural networks had fundamental limitations that couldn't be overcome.

However, the solution was already known: multi-layer networks with non-linear activation functions. The backpropagation algorithm, which efficiently trains such networks, was developed in the 1970s and rediscovered and popularized in the 1980s.

## Modern Neural Networks and XOR

Today, solving the XOR problem is a trivial exercise for even the most basic neural networks. A simple network with one hidden layer containing two neurons can perfectly model the XOR function. This serves as an important reminder that seemingly insurmountable problems can often be solved with relatively simple extensions to existing approaches.

## The New Challenges

But as we solve old problems, new ones emerge. Modern deep learning faces its own set of "XOR problems" - challenges that seem to reveal fundamental limitations in our current approaches:

1. **Adversarial examples**: Small, imperceptible perturbations to inputs that cause neural networks to make confident but incorrect predictions

2. **Out-of-distribution generalization**: The difficulty of making reliable predictions on data that differs from the training distribution

3. **Causal reasoning**: The challenge of moving beyond correlation to understand causal relationships

4. **Sample efficiency**: The need for massive amounts of data compared to human learning

## Learning from History

The lesson of the original XOR problem is instructive. What seems like a fundamental limitation may simply require a new perspective or architectural innovation. Just as adding hidden layers solved the original XOR problem, new architectures and training methods may solve today's challenges.

For instance, techniques like contrastive learning, self-supervised learning, and various forms of regularization are already making progress on some of these problems. Hybrid systems that combine deep learning with symbolic reasoning show promise for others.

## Conclusion

The XOR problem reminds us that progress in AI often comes from recognizing and directly addressing the limitations of current approaches. Rather than being discouraged by these limitations, we should see them as signposts pointing toward the next breakthrough.

As we face the new XOR problems of our era, we can be inspired by how thoroughly the original problem was solved. Today's seemingly fundamental limitations may well be tomorrow's introductory exercises.