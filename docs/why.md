---
id: why
title: Why amos
sidebar_label: Why
---

As we all know, when using React to develop large front-end projects, we
have to use some additional packages to manage the global state in the
application. There are currently two well-known state management packages:
Redux and MobX, in addition to Recoil, etc.

## Why not redux

First of all, the basic concepts of `Redux` are very complex, including
`Action`, `Reducer`, `State`, `Dispatch`, `Store`, etc., especially the
`type` in `Action`. It is undeniable that these concepts are necessary
for the `MVVM` framework. But `Redux` directly integrates these concepts
to developers, which makes it difficult for most junior developers to
grasp these concepts in depth and apply them proficiently. They can only
write code in the production environment according to the introductory
tutorial in the official documentation. Projects invested in this way
are extremely difficult to maintain. And the understanding of each
developer is different, and the projects produced are also diverse.
Although Redux provides `@reduxjs/toolkit` to standardize the engineering
paradigm of the Redux project, this solution is still not complete, and
there are still other completely different projects in the community.
Solutions, such as `redux-saga`, etc.

Secondly, centralization.

## Why not MobX
