export * from "./locales";
export * from "./paths";
export * from "./catalog";
export * from "./hreflang";
export { getUiMessages, UI_MESSAGES, type UiMessages } from "./ui-messages";
export { getWorkspaceMessages, WORKSPACE_MESSAGES, type WorkspaceMessages } from "./workspace-messages";
export { getPageCopy, pathToPageKey, type PageCopy, type StaticPageKey } from "./page-messages";
export { getToolCopy, hasToolCopy, type ToolCopy } from "./tool-messages";
export { localizedMetadata, hreflangLanguages, withHreflang } from "./metadata";
