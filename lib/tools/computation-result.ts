/** Shared result shape for tools - import from here in UI to avoid coupling client bundles to `engine.ts`. */
export type ToolComputationResult = {
  title: string;
  value: string;
  extra?: string[];
  error?: boolean;
};
