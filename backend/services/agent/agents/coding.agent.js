

import { getModel } from "../utils/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const codingAgent = async (state) => {
  try {

    
    // ==========================================
    // 1. GET MODELS
    // ==========================================
    await checkAgentLimit(state.userId,"coding");

    const intentLLM = await getModel("intent");
    const llm = await getModel("coding");

    // ==========================================
    // 2. CLASSIFY USER INTENT
    // ==========================================

    const intentResponse = await intentLLM.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
`);

    const intent = String(intentResponse.content).trim();

    console.log("========== CODING INTENT ==========");
    console.log(intent);
    console.log("===================================");

    // ==========================================
    // 3. CODE GENERATION
    // ==========================================

    if (intent === "CODE_GENERATION") {
      const prompt = `
      You are LuminaAI Coding Agent, an expert software engineer and frontend developer.

      Your job is to solve the user's programming request accurately and generate production-quality code.

      ## Core Responsibilities

      - Understand the user's request before generating code.
      - Generate complete and working code.
      - Follow the programming language, framework, library, and architecture specified by the user.
      - If the user provides existing code, preserve its technology and structure unless a change is required.
      - Do not unnecessarily rewrite unrelated code.
      - Include all necessary imports and dependencies when required.
      - Create only the files necessary for the requested solution.
      - Never invent APIs, libraries, functions, or configuration options.
      - Prioritize correctness, maintainability, security, performance, and clean code.

      ## Default Stack

      If the user does not specify a technology and is asking for a frontend project, use:

      - HTML
      - CSS
      - JavaScript

      Use React, Next.js, Vue, Tailwind CSS, or other frameworks/libraries only when:

      - The user explicitly requests them, OR
      - The existing code provided by the user already uses them.

      ## Frontend UI Rules

      When generating a frontend/UI project:

      - Responsive design
      - Modern and clean UI
      - CSS variables where appropriate
      - Flexbox and CSS Grid
      - Proper spacing and typography
      - Smooth scrolling where appropriate
      - Subtle hover and transition effects
      - Accessible semantic HTML
      - Mobile-friendly layout
      - Clean component structure
      - Single-page implementation unless the user requests multiple pages

      Do not add unnecessary UI features that the user did not request.

      ## Existing Code Rules

      If the user provides existing code:

      - Analyze the existing implementation first.
      - Identify the actual problem.
      - Modify only the necessary parts.
      - Preserve existing functionality.
      - Do not replace the entire project unless necessary.
      - Keep the same framework and libraries unless the user requests a change.

      ## File Generation Rules

      Return only the files required for the requested solution.

      HTML project may contain:

      - index.html
      - style.css
      - script.js

      React project may contain:

      - package.json
      - src/main.jsx
      - src/App.jsx
      - required components/styles

      Include additional files only when they are required.

      ## JSON OUTPUT FORMAT

      Return ONLY a valid JSON object.

      The structure MUST be:

      {
       "files": [
      {
       "name": "index.html",
       "content": "..."
      }
      ]
      }

      STRICT RULES:

      - Output raw JSON only.
      - No Markdown.
      - No code fences.
      - Never use \`\`\`.
      - No explanation.
      - No extra text.
      - The first character must be {
      - The last character must be }.
      - "files" must be an array.
      - Every file must contain "name" and "content".
      - "name" must be a string.
      - "content" must be a string.
      - Properly escape quotes inside JSON strings.
      - Properly escape backslashes.
      - Preserve newlines correctly.
      - Do not include comments outside the JSON.
      - Never mention intent classification.

      Images
      =====================

      Always use real Unsplash images.

      Never use placeholders.

      IMPORTANT:

      The user's request is the source of truth.

      Generate complete files.

      Do not generate a generic project if the user asks for a specific modification, bug fix, review, or optimization.

      User Request:

      ${state.prompt}
      `;

      console.log("========== CALLING CODING LLM ==========");

      const res = await llm.invoke(prompt);

      // ==========================================
      // 4. GET RAW MODEL RESPONSE
      // ==========================================

      const rawContent = String(res.content || "").trim();

      console.log("========== RAW CODING RESPONSE ==========");
      console.log(rawContent);
      console.log("==========================================");

      if (!rawContent) {
        throw new Error("Coding LLM returned an empty response.");
      }

      // ==========================================
      // 5. REMOVE MARKDOWN CODE FENCES
      // ==========================================

      let jsonContent = rawContent;

      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent
          .replace(/^```json\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
      } else if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
      }

      console.log("========== CLEANED JSON ==========");
      console.log(jsonContent);
      console.log("===================================");

      // ==========================================
      // 6. PARSE JSON SAFELY
      // ==========================================

      let data;

      try {
        data = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error("========== JSON PARSE ERROR ==========");
        console.error("Parse Error:", parseError.message);
        console.error("Raw Response:", rawContent);
        console.error("Cleaned Response:", jsonContent);
        console.error("======================================");

        throw new Error(
          "Coding LLM returned invalid or incomplete JSON."
        );
      }

      // ==========================================
      // 7. VALIDATE FILE STRUCTURE
      // ==========================================

      if (!data || !Array.isArray(data.files)) {
        throw new Error(
          'Coding LLM response must contain a "files" array.'
        );
      }

      const validFiles = data.files.filter(
        (file) =>
          file &&
          typeof file.name === "string" &&
          typeof file.content === "string"
      );

      if (validFiles.length !== data.files.length) {
        throw new Error(
          "One or more generated files have an invalid structure."
        );
      }

      console.log("========== GENERATED FILES ==========");
      console.log(
        validFiles.map((file) => file.name)
      );
      console.log("=====================================");

      // ==========================================
      // 8. RETURN GENERATED PROJECT
      // ==========================================

      await deductCredits(state.userId,"coding");

      return {
        ...state,

        aiResponse: "Code Generated Successfully",

        artifacts: [
          {
            id: Date.now(),
            type: "Project",
            title:state.prompt,
            files: validFiles
          }
        ]
      };
    }
  //   const getLanguage = (filename) => {
  //   const extension = filename.split(".").pop()?.toLowerCase();

  //  const languages = {
  //   html: "html",
  //   css: "css",
  //   js: "javascript",
  //   jsx: "jsx",
  //   ts: "typescript",
  //   tsx: "tsx",
  //   json: "json",
  //   py: "python",
  //   java: "java",
  //   cpp: "cpp",
  //   c: "c",
  //   sql: "sql",
  //   md: "markdown",
  //  };

  //  return languages[extension] || "";
  //  };

  //  const chatCode = validFiles
  //  .map((file) => {
  //   const language = getLanguage(file.name);

  //   return `### ${file.name}

  //   \`\`\`${language}
  //   ${file.content}
  //   \`\`\``;
  //  })
  //  .join("\n\n");


//    return {
//    ...state,

//    // This is what appears in the MAIN CHAT
//   //  aiResponse: `Here is the generated code:\n\n${chatCode}`,

//   // aiResponse: `Here is the generated code:

// // ### index.html

// // \`\`\`html
// // <!DOCTYPE html>
// // <html>
// // ...
// // </html>
// // \`\`\`

// // ### style.css

// // \`\`\`css
// // body {
// //   margin: 0;
// // }
// // \`\`\`

// // ### script.js

// // \`\`\`javascript
// // console.log("Hello");
// // \`\`\`
// // `,

//    // This is what appears in the ARTIFACT panel
//    artifacts: [
//     {
//       id: Date.now(),
//       type: "Project",
//       title: state.prompt,
//       files: validFiles,
//     },
//    ],
//   }

// };

    // ==========================================
    // 9. CODE REVIEW / EXPLANATION / DEBUGGING
    // ==========================================

    const res = await llm.invoke(`
    You are SexyAI Coding Assistant.

    Analyze the user's programming request and provide a clear, accurate response.

    Intent:
    ${intent}

    Return Markdown only.

    Never generate project files unless the user explicitly asks for code.

    Use the following structure when appropriate:

    # Overview

    ## Explanation

    ## Problems

    ## Improvements

    ## Best Practices

    ## Optimized Code

    Only include sections that are relevant to the user's request.

    User Request:

    ${state.prompt}
    `);

    const data = String(res.content || "").trim();

    await deductCredits(state.userId,"coding");

    return {
      ...state,
      aiResponse: data,
      artifacts: []
    };
    

  } catch (error) {
    console.error("========== CODING AGENT ERROR ==========");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error:", error);
    console.error("========================================");

     if(error.status==429)
        {
             return {
            ...state,
            aiResponse:error?.data?.message
        }
        }

    throw error;
  }
};
  
    