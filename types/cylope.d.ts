declare module 'cyclope/plugin' {
  function initCyclop(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void;
  
  export default initCyclop;
}