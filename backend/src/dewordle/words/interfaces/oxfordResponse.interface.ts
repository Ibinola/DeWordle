interface OxfordResponse {
  results: {
    lexicalEntries: {
      entries: {
        senses: {
          definitions: string[];
        }[];
      }[];
    }[];
  }[];
}