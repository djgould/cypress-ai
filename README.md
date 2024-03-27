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
import { createCypressAI } from '@djgould/cypress-ai'

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

![output](https://private-user-images.githubusercontent.com/10077295/317336078-b5792c3e-e646-428d-93c3-9fd7b5bd18d5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE1NjEyNjYsIm5iZiI6MTcxMTU2MDk2NiwicGF0aCI6Ii8xMDA3NzI5NS8zMTczMzYwNzgtYjU3OTJjM2UtZTY0Ni00MjhkLTkzYzMtOWZkN2I1YmQxOGQ1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzI3VDE3MzYwNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE3NzRkYjYzNjM5ZjQ3MTJlMGJlNTNmMWFhNWE4NTBiMTI4YWVhZjNmMjExNTcwYzY1OGIzMDI4ZTY1YjRhMDMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.aNmLKYBCVqSQGEDj8T5nW2sT4cO-YsgSBomJdKOgAwQ)



### Contributing
1. Create an project issue with proper description and expected behaviour
2. NPM command `npm run verify` have to pass locally
3. Provide a PR with implementation and tests 
