interface WiktionaryResponse {
  query: {
    pages: {
      [key: string]: {
        extract?: string;
      };
    };
  };
}