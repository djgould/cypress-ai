# cypress-ai

This Plugin leverages OpenAI to help give tips to debugging cypress tests when they fail.

### Installation

```
npm install cypress-ai --save-dev
```

### Usage

`cypress.config.ts`

```js
import { defineConfig } from 'cypress'
import { cypressAI } from './cypress-ai'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', cypressAI)
    }
  }
})
```

### Contributing
1. Create an project issue with proper description and expected behaviour
2. NPM command `npm run verify` have to pass locally
3. Provide a PR with implementation and tests 
