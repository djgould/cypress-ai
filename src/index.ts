import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';

const openai = new OpenAI({
    apiKey: 'your openai key',
});

export async function cypressAI(result: any) {
    if ('status' in result) return;

    await Promise.all(
        result.runs.map((run) => {
            const specPath = path.join(
                __dirname,
                './cypress/e2e',
                `${run.spec.fileName}.cy${run.spec.fileExtension}`
            );
            console.log(specPath);
            const specFile: string = fs.readFileSync(specPath).toString();

            return Promise.all(
                run.tests.map(async (test) => {
                    if (test.state === 'passed') return;
                    const screenshotPath = path.join(
                        __dirname,
                        './cypress/screenshots',
                        'spec.cy.ts',
                        `${test.title[0]} -- ${test.title[1]} (failed).png`
                    );

                    const screenshotFile = fs.readFileSync(screenshotPath);
                    const screenshotBase64 = screenshotFile.toString('base64');

                    const chatCompletion = await openai.chat.completions.create(
                        {
                            messages: [
                                {
                                    role: 'user',
                                    content: [
                                        {
                                            type: 'text',
                                            text: `I have a Cypress test failure with the following error: ${test.displayError}. Here is my spec file: ${specFile} Can you provide general advice on what could be wrong and how to troubleshoot this type of error? Please keep your answer short and concise. This will be used for the error output in a users terminal.`,
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
                        }
                    );

                    chatCompletion.choices.map((choice) =>
                        console.log(choice.message.content)
                    );
                })
            );
        })
    );
}
