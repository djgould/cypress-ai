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
import { createCypressAI } from './cypress-ai'

const cypressAI = createCypressAI({ apiKey: 'open ai api key' })

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', cypressAI)
    }
  }
})
```

### Output

```
...
 (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        1                                                                                │
  │ Passing:      0                                                                                │
  │ Failing:      1                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  1                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     6 seconds                                                                        │
  │ Spec Ran:     spec.cy.ts                                                                       │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Screenshots)

  -  /Users/devingould/nextjs-chat/cypress/screenshots/spec.cy.ts/template spec -- pa    (2560x1440)
     sses (failed).png                                                                              

The error indicates that Cypress was unable to find a `button` with the type attribute set to `"submi"`. 
This could be due to a typo in the attribute value. Double-check the actual type attribute of the button element in your application. It should likely be `"submit"` instead of `"submi"`. 
Correct the selector in your test to match the actual type attribute of the button:

\```javascript
cy.get('button[type="submit"]').click();
\```

Additionally, ensure that the button is rendered and visible in the DOM at the time the test runs.
Any conditional rendering or asynchronous behavior could affect element visibility. 
If the button loads asynchronously, consider using `.should('be.visible')` before the `.click()` 
command to ensure the button is present and clickable.

====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✖  spec.cy.ts                               00:06        1        -        1        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✖  1 of 1 failed (100%)                     00:06        1        -        1        -        -  
```

### Contributing
1. Create an project issue with proper description and expected behaviour
2. NPM command `npm run verify` have to pass locally
3. Provide a PR with implementation and tests 
