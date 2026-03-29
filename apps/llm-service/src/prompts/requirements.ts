export function buildRequirementsPrompt(userText: string): string {
  return `
You extract database requirements from user text.
Return ONLY valid JSON.

Schema:
{
  "domain":"string",
  "actors":["string"],
  "use_cases":["string"],
  "entities":[
    {
      "name":"string",
      "description":"string",
      "attributes":[
        {
          "name":"string",
          "meaning":"string",
          "hints":["string"]
        }
      ]
    }
  ],
  "business_rules":["string"],
  "nonfunctional":["string"],
  "assumptions":["string"],
  "open_questions":["string"]
}

Rules:
- no markdown
- no explanations
- snake_case names when possible
- only extract entities that should really be stored
- if details are missing, make reasonable assumptions

User text:
<<<
${userText}
>>>
`.trim();
}
