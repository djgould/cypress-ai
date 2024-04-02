/// <reference types="cypress" />
export declare function cypressAI(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions, options?: {
    apiKey: string;
    includeFailedHtml?: boolean;
    includeNetworkFails?: boolean;
}): void;
