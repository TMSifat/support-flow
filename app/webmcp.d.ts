export {};

declare global {
  interface Document {
    readonly modelContext?: {
      registerTool(
        tool: {
          name: string;
          title?: string;
          description: string;
          inputSchema: Record<string, unknown>;
          annotations?: {
            readOnlyHint?: boolean;
            untrustedContentHint?: boolean;
          };
          execute(
            input: unknown,
          ):
            | void
            | Record<string, unknown>
            | Promise<void | Record<string, unknown>>;
        },
        options?: { signal?: AbortSignal },
      ): void | Promise<void>;
    };
  }
}
