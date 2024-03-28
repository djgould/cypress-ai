# THIS IS CURRENTLY AN EXPERIMENTAL PROJECT. YOU WILL PROBABLY GET ERRORS

# cypress-ai

This Plugin leverages OpenAI to help give tips to debugging cypress tests when they fail.

### Installation

```
npm install @djgould/cypress-ai --save-dev
```

### Usage

`cypress.config.ts`

```js
import { defineConfig } from 'cypress'
import { cypressAI } from '@djgould/cypress-ai'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      cypressAI(on, config, { apiKey: 'open ai api key' })
    }
  }
})
```

*Include failed html in request to open ai*
1. Configure Cyclope to save page after failure [here](https://github.com/bahmutov/cyclope/tree/main?tab=readme-ov-file#save-the-failed-page)
2. Add `includeFailedHtml: true` to options:
```
  cypressAI(on, config, { apiKey: 'open ai api key', includeFailedHtml: true })
```

### Output

![image](https://github.com/djgould/cypress-ai/assets/6018174/c273a926-12ed-488c-ad31-d6e6df49350a)




### Contributing
1. Create an project issue with proper description and expected behaviour
2. NPM command `npm run verify` have to pass locally
3. Provide a PR with implementation and tests 
