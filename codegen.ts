
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://127.0.0.1:4000/graphql",
  generates: {
    "apps/graphql-adapter/src/graphql-types/graphql-types.ts": {
      plugins: ["typescript"]
    }
  }
};

export default config;
