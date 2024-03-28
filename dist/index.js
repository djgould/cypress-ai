var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import OpenAI from 'openai';
import fs from 'fs';
import * as readline from 'readline';
import { default as cyclopePlugin } from 'cyclope/plugin';
import path from 'path';
function isCypressFailedRunResult(result) {
    return 'status' in result;
}
export function cypressAI(on, config, options = {
    apiKey: '',
    includeFailedHtml: false,
}) {
    cyclopePlugin(on, config);
    const openai = new OpenAI({
        apiKey: options.apiKey,
    });
    function cypressAI(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isCypressFailedRunResult(result))
                return;
            if (result.totalFailed === 0)
                return;
            yield Promise.all(result.runs.map((run) => {
                return Promise.all(run.tests.map((test) => __awaiter(this, void 0, void 0, function* () {
                    if (test.state === 'passed')
                        return;
                    const screenshotFile = fs.readFileSync(run.screenshots[0].path);
                    const screenshotBase64 = screenshotFile.toString('base64');
                    const twirlTimer = createSpinner();
                    const failedHtmlFull = options.includeFailedHtml
                        ? fs
                            .readFileSync(path.join(__dirname, 'cypress/failed', `${run.spec.fileName}.cy${run.spec.fileExtension}`, `${test.title[1]}`, 'index.html'))
                            .toString()
                        : null;
                    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
                    const bodyMatch = failedHtmlFull === null || failedHtmlFull === void 0 ? void 0 : failedHtmlFull.match(bodyRegex);
                    const failedHtml = bodyMatch ? bodyMatch[1] : '';
                    const chatCompletion = yield sendMessage(test, run, screenshotBase64, failedHtml);
                    logOutput(test, run, chatCompletion);
                    clearSpinner(twirlTimer);
                })));
            }));
            return cypressAI;
        });
    }
    function sendMessage(test, run, screenshotBase64, failedHtml) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatCompletion = yield openai.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `I have a Cypress test failure with the following error: ${test.displayError}. Here is my spec file: ${run.spec.absolute} Can you provide general advice on what could be wrong and how to troubleshoot this type of error? Please keep your answer short and concise. This will be used for the error output in a users terminal. Here is the html: ${failedHtml}`,
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${screenshotBase64}`,
                                },
                            },
                        ],
                    },
                ],
                model: 'gpt-4-vision-preview',
            });
            return chatCompletion;
        });
    }
    on('after:run', cypressAI);
}
function logOutput(test, run, chatCompletion) {
    console.log(`
==============================

[Specfile]: ${run.spec.absolute}

[Error]: ${test.displayError}

[Suggested solutions]: 
`);
    chatCompletion.choices.forEach((choice) => {
        console.log(`\x1b[33m ${choice.message.content} \x1b[0m`);
        console.log('\r');
    });
}
function createSpinner() {
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    return setInterval(function () {
        process.stdout.write(`\r  generating solutions ${P[x++]}`);
        x &= 3;
    }, 250);
}
function clearSpinner(ref) {
    clearInterval(ref);
    readline.clearLine(process.stdout, 0);
}
