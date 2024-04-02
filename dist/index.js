var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import OpenAI from "openai";
import fs from "fs";
import * as readline from "readline";
import { default as cyclopePlugin } from "cyclope/plugin";
import path from "path";
function isCypressFailedRunResult(result) {
    return "status" in result;
}
/**
 * Use this function as an "afterEach" hook to automatically save the
 * current page as an HTML file if the test has failed.
 * By default does it only in the non-interactive mode.
 * @example
 *  afterEach(() => savePageIfTestFailed({ ignoreFailedAssets: true }))
 */
function saveNetworkIfTestFailed(options = {}) {
    if (cy.state("test").isFailed()) {
        const isInteractive = Cypress.config("isInteractive");
        const shouldSaveInInteractiveMode = options && options.saveInteractive;
        if (isInteractive && !shouldSaveInInteractiveMode) {
            return;
        }
        const outputFolder = pathJoin("cypress", "failed", Cypress.spec.name, Cypress.currentTest.title);
        cy.log(outputFolder);
        const combinedOptions = Object.assign(Object.assign({}, defaultSavePageOptions), options);
        return savePage(outputFolder, combinedOptions);
    }
}
export function cypressAI(on, config, options = {
    apiKey: "",
    includeFailedHtml: false,
    includeNetworkFails: false,
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
                    if (test.state === "passed")
                        return;
                    const screenshotFile = fs.readFileSync(run.screenshots[0].path);
                    const screenshotBase64 = screenshotFile.toString("base64");
                    const twirlTimer = createSpinner();
                    console.log(`${run.spec.fileName}.spec${run.spec.fileExtension}`, `${test.title[1]}`);
                    const failedHtmlFull = options.includeFailedHtml
                        ? fs.existsSync(path.join(__dirname, "cypress/failed", `${run.spec.fileName}.spec${run.spec.fileExtension}`, `${test.title[1]}`, "index.html"))
                            ? fs
                                .readFileSync(path.join(__dirname, "cypress/failed", `${run.spec.fileName}.spec${run.spec.fileExtension}`, `${test.title[1]}`, "index.html"))
                                .toString()
                            : null
                        : null;
                    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
                    const bodyMatch = failedHtmlFull === null || failedHtmlFull === void 0 ? void 0 : failedHtmlFull.match(bodyRegex);
                    const failedHtml = bodyMatch ? bodyMatch[1] : "";
                    yield condenseHtml(test, run, screenshotBase64, failedHtml);
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
                        role: "system",
                        content: `You are a helpful Cypress AI. You are trying to help a user troubleshoot a Cypress test failure. You will be given the test failure, the spec file, and the html of the test. You will need to provide a general advice on what could be wrong and how to troubleshoot this type of error. Please keep your answer short and concise. This will be used for the error output in a users terminal.`,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `cypress test failure error: ${test.displayError}. spec file: ${run.spec.absolute} html: ${failedHtml}`,
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${screenshotBase64}`,
                                },
                            },
                        ],
                    },
                ],
                model: "gpt-4-vision-preview",
            });
            return chatCompletion;
        });
    }
    on("after:run", cypressAI);
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
        console.log("\r");
    });
}
function createSpinner() {
    const P = ["\\", "|", "/", "-"];
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
