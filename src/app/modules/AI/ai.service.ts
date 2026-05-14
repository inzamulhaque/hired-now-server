import type { JwtPayload } from "jsonwebtoken";
import type { IAIMatchInput, IEnhancedDescription } from "./ai.interface.js";
import { Role } from "../../../generated/enums.js";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import openai from "../../../lib/openai.js";
import enhanceDescription from "./enhanceDescription.schema.json" with { type: "json" };

export const enhanceDescriptionService = async (
  loggedUser: JwtPayload,
  payload: IEnhancedDescription,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: loggedUser.id,
      role: Role.EMPLOYER,
    },
  });

  if (!user) {
    throw new AppError("User not found or unauthorized", 404);
  }

  const prompt = `
                    You are an expert job post writer and HR copywriter.

                    Your task is to rewrite and enhance a job description to make it highly attractive, engaging, and optimized for attracting top talent.

                    ## INPUT
                    - Original Job Description: ${payload.description}
                    - Suggested Skills (may or may not be relevant): ${payload.skillsRequired}

                    ---

                    ## TASKS

                    1. Improve the job description to make it:
                    - More engaging and professional
                    - Clear and structured
                    - Attractive to high-quality candidates
                    - Focused on responsibilities, expectations, and company value

                    2. Use simple and clean HTML formatting inside the description:
                    - You MAY use:
                        - <h2>, <h3> for headings
                        - <p> for paragraphs
                        - <ul>, <li> for bullet points
                        - <strong> for emphasis
                    - Do NOT use external CSS files
                    - Inline CSS is allowed only for basic styling (e.g., font-weight, margin, padding)

                    3. Extract and return the most relevant skills:
                    - Include only skills that are truly relevant to the job
                    - You may include some or all of the provided skills if appropriate
                    - You may also add missing important skills if needed

                    4. Ensure the final output is professional, concise, and structured.

                    ---

                    ## OUTPUT FORMAT (STRICT JSON)

                    Return ONLY valid JSON in the following structure:

                    {
                    "description": "Enhanced HTML formatted job description",
                    "skillsRequired": ["Skill1", "Skill2", "Skill3"]
                    }

                    ---

                    ## RULES
                    - Do NOT include explanations
                    - Do NOT include markdown or backticks
                    - Return ONLY JSON
                    - Ensure description is under 2000 characters
                    - Ensure skills are relevant
                `;

  const aiResponse = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    messages: [
      {
        role: "system",
        content: "You are an expert job description writer.",
      },

      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.7,

    stream: false,

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "enhanceDescription",
        schema: enhanceDescription,
      },
    },
  });

  const content = aiResponse.choices[0]!.message.content;

  return JSON.parse(content!);
};

export const aiMatchScoreService = async (
  input: IAIMatchInput,
): Promise<{
  aiMatchScore: number;
  aiNote: string;
}> => {
  const prompt = `
                  You are an AI hiring assistant.

                  Analyze freelancer-job compatibility.

                  Return:
                  - match score (0-100)
                  - short note (max 20 words)

                  Job Title: ${input.title}

                  Required Skills: ${input.skillsRequired.join(", ")}

                  Freelancer Skills: ${input.freelancerSkills.join(", ")}

                  Cover Note: ${input.coverNote}

                  Job Budget: ${input.jobBudget}

                  Proposed Budget: ${input.proposedBudget}

                  Return valid JSON only:
                  {
                    "aiMatchScore": number,
                    "aiNote": string
                  }
  `;

  const aiResponse = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    messages: [
      {
        role: "system",
        content: "You are an AI hiring assistant.",
      },

      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.7,

    stream: false,
  });

  const content = aiResponse.choices[0]!.message.content;

  if (
    JSON.parse(content!)?.aiMatchScore &&
    JSON.parse(content!).aiMatchScore <= 100
  ) {
    return JSON.parse(content!);
  } else {
    return {
      aiMatchScore: 0,
      aiNote: "Unable to evaluate match score.",
    };
  }
};
