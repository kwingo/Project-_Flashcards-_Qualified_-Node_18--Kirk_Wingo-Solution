# 🐛 Whammy Log

## 1. React Not Defined Error

**The Problem:**
After removing `import React from "react";` from multiple files to resolve an ESLint warning, the application tests began failing with the error **"React is not defined."**

**The Cause:**
Although modern versions of React do not require importing React for JSX, the testing environment used in this project (Jest/Qualified) still expects React to be explicitly in scope. Removing the import caused JSX to fail during test execution.

**The Solution:**
I reintroduced the React import in all component files using JSX. For files using hooks, I used:

```js
import React, { useState, useEffect } from "react";
```

For simpler components, I used:

```js
import React from "react";
```

This resolved the test failures while maintaining compatibility with the testing environment.

---

## 2. Duplicate Hook Import Error

**The Problem:**
The test suite failed with the error **"Identifier 'useEffect' has already been declared."** This prevented Jest from running any tests.

**The Cause:**
I accidentally imported React hooks twice in the same file:

```js
import React, { useState, useEffect } from "react";
import { useEffect, useState } from "react";
```

This caused a redeclaration error because `useEffect` and `useState` were defined multiple times in the same scope.

**The Solution:**
I removed the duplicate import and kept a single correct import:

```js
import React, { useState, useEffect } from "react";
```

This resolved the syntax error and allowed the tests to run successfully.

---

## 3. Invalid react-scripts Version

**The Problem:**
Running `npm test` resulted in the error **"react-scripts: command not found."**

**The Cause:**
The `package.json` file had an invalid version:

```json
"react-scripts": "^0.0.0"
```

This prevented the required dependencies from being installed correctly.

**The Solution:**
I updated the version to a valid one:

```json
"react-scripts": "5.0.1"
```

Then I reinstalled dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

This restored the missing scripts and allowed tests to run.

---

## 4. Study Screen Navigation Logic

**The Problem:**
The study screen incorrectly looped back to the first card automatically instead of prompting the user to restart or return home after reaching the last card.

**The Cause:**
I used modulo logic:

```js
(current + 1) % deck.cards.length
```

This caused the index to reset automatically without user interaction.

**The Solution:**
I replaced the modulo logic with a conditional check:

```js
if (isLastCard) {
  const restart = window.confirm("Restart cards?");
  if (restart) {
    setCardIndex(0);
  } else {
    navigate("/");
  }
}
```

This implemented the required behavior and aligned with project specifications.

---
