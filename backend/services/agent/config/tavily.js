import { TavilySearch } from "@langchain/tavily";

export const searchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  searchDepth: "basic",

  // includeAnswer: true,
  // includeRawContent: true,

  includeImages: true,
  // includeImageDescriptions: true,
  
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});