import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParsedJob {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  applyLink: string;
  description: string;
}

function parseJobTextLocally(text: string): ParsedJob {
  const n = text.replace(/\r\n/g, '\n').trim();

  let title = '';
  const titleLabel = n.match(
    /(?:job title|position|role|title)\s*[:\-]\s*([^\n]+)/i
  );
  if (titleLabel) {
    title = titleLabel[1].trim();
  } else {
    const lower = n.toLowerCase();
    const prefixes = [
      'is hiring',
      'are hiring',
      "we're hiring",
      'we are hiring',
      'hiring:',
      'hiring -',
      'looking for',
      'join us as',
      'opening for',
    ];
    for (const prefix of prefixes) {
      const idx = lower.indexOf(prefix);
      if (idx !== -1) {
        let rest = n.slice(idx + prefix.length).trimStart();
        rest = rest.replace(/^(a|an|the)\s+/i, '');
        const delim = rest.search(/[|,\n–]/);
        title = (delim === -1 ? rest : rest.slice(0, delim)).trim();
        break;
      }
    }
    if (!title) {
      const firstLine = n.split('\n')[0].trim();
      if (
        firstLine.length < 100 &&
        /engineer|developer|designer|manager|analyst|lead|director|specialist|coordinator|intern|consultant|architect|devops|frontend|backend|fullstack|full.stack/i.test(
          firstLine
        )
      ) {
        title = firstLine;
      }
    }
  }
  // Strip "| anything" or "– anything" — character class search, no backtracking
  const pipeIdx = title.search(/[|–]/);
  if (pipeIdx !== -1) title = title.slice(0, pipeIdx);
  // Strip " at Company" suffix — indexOf, no backtracking
  const atIdx = title.toLowerCase().lastIndexOf(' at ');
  if (atIdx !== -1) title = title.slice(0, atIdx);
  title = title.trim();

  let company = '';
  const companyLabel = n.match(
    /(?:company|employer|organisation|organization)\s*[:\-]\s*([^\n]+)/i
  );
  if (companyLabel) {
    company = companyLabel[1].trim();
  } else {
    const atMatch = n.match(/\bat\s+([A-Z][a-zA-Z0-9\s&.]+?)(?:\s*[,|\n|–|-])/);
    if (atMatch) company = atMatch[1].trim();
    else {
      const nameMatch = n.match(
        /([A-Z][a-zA-Z0-9\s&.]+?)\s+(?:is hiring|is looking|pvt\.?|ltd\.?|llc|inc\.?|corp\.?|technologies|solutions|systems)/i
      );
      if (nameMatch) company = nameMatch[1].trim();
    }
  }

  let location = '';
  const locationLabel = n.match(
    /(?:location|based in|office location|city)\s*[:\-]\s*([^\n]+)/i
  );
  if (locationLabel) {
    location = locationLabel[1].trim();
  } else if (/\bhybrid\b/i.test(n) && /\bremote\b/i.test(n)) {
    location = 'Hybrid / Remote';
  } else if (/\bremote\b/i.test(n)) {
    location = 'Remote';
  } else if (/\bhybrid\b/i.test(n)) {
    location = 'Hybrid';
  }

  let type = 'Full-Time';
  if (/\binternship\b|\bintern\b/i.test(n)) type = 'Internship';
  else if (/\bpart[\s-]?time\b/i.test(n)) type = 'Part-Time';
  else if (/\bcontract\b|\bfreelance\b/i.test(n)) type = 'Contract';

  let experience = '';
  const expRange = n.match(
    /(\d+)\s*(?:\+?\s*(?:to|[-–])\s*(\d+))?\s*\+?\s*years?/i
  );
  if (expRange) {
    const years = parseInt(expRange[1]);
    if (years === 0) experience = '0+ years';
    else if (years === 1) experience = '1+ years';
    else if (years === 2) experience = '2+ years';
    else if (years <= 4) experience = '3+ years';
    else experience = '5+ years';
  } else if (/\bfresher\b|\bentry[\s-]?level\b/i.test(n)) {
    experience = '0+ years';
  } else if (/\bjunior\b/i.test(n)) {
    experience = '1+ years';
  } else if (/\bmid[\s-]?level\b/i.test(n)) {
    experience = '3+ years';
  } else if (/\bsenior\b|\blead\b|\bprincipal\b/i.test(n)) {
    experience = '5+ years';
  }

  let salary = 'Not specified';
  const salaryLabel = n.match(
    /(?:salary|compensation|pay|ctc|package|stipend)\s*[:\-]\s*([^\n]+)/i
  );
  if (salaryLabel) {
    salary = salaryLabel[1].trim();
  } else {
    const currencyMatch = n.match(
      /(?:\$|₹|rs\.?\s*|inr|usd|eur|gbp)\s*[\d,]+(?:\s*(?:k|lpa|lac|lakh))?(?:\s*[-–to]+\s*(?:\$|₹|rs\.?\s*|inr|usd|eur|gbp)?\s*[\d,]+(?:\s*(?:k|lpa|lac|lakh))?)?/i
    );
    if (currencyMatch) salary = currencyMatch[0].trim();
    else {
      const lpaMatch = n.match(
        /[\d.]+\s*(?:[-–to]+\s*[\d.]+)?\s*(?:lpa|lac|lakh|ctc)/i
      );
      if (lpaMatch) salary = lpaMatch[0].trim();
    }
  }

  let applyLink = '';
  const urlMatch = n.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/i);
  if (urlMatch) applyLink = urlMatch[0].replace(/[.,;:)]+$/, '');

  return {
    title,
    company,
    location,
    type,
    experience,
    salary,
    applyLink,
    description: '',
  };
}

const jobInfo = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.string(),
  experience: z.string(),
  salary: z.string(),
  description: z.string(),
  applyLink: z.string(),
  status: z.boolean(),
});

const updateJobInfo = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.string(),
  experience: z.string(),
  salary: z.string(),
  description: z.string(),
  applyLink: z.string(),
  status: z.boolean(),
});

export const jobRouter = router({
  createJobPost: publicProcedure.input(jobInfo).mutation(async (opts) => {
    const { input } = await opts;
    if (!input) {
      return new TRPCError({ code: 'NOT_FOUND' });
    }
    await opts.ctx.db.Jobs.insertMany(opts.input);
    return {
      message: 'created',
    };
  }),
  updateJobPost: publicProcedure.input(updateJobInfo).mutation(async (opts) => {
    const { input } = await opts;
    if (!input) {
      return new TRPCError({ code: 'NOT_FOUND' });
    }
    await opts.ctx.db.Jobs.findByIdAndUpdate(
      { _id: input.id },
      {
        title: input.title,
        company: input.company,
        location: input.location,
        type: input.type,
        experience: input.experience,
        salary: input.salary,
        description: input.description,
        applyLink: input.applyLink,
        status: input.status,
      }
    );

    return {
      message: 'updated',
    };
  }),
  deleteJobPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = await opts;
      if (!input) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }
      await opts.ctx.db.Jobs.findByIdAndDelete({ _id: input.id });
      return {
        status: 200,
        message: 'Deleted',
      };
    }),

  deactivateJob: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { input } = opts;
        await opts.ctx.db.Jobs.findByIdAndUpdate(input.id, {
          status: false,
        });
        return {
          status: 200,
          message: 'Done',
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  getAllJobs: publicProcedure.query(async (opts) => {
    const data = await opts.ctx.db.Jobs.find({
      status: true,
    }).sort({ createdAt: -1 });
    return {
      data,
    };
  }),
  getJob: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = await opts;
      if (!input) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }
      const data = await opts.ctx.db.Jobs.findById(input.id);
      return {
        message: data,
      };
    }),

  parseJobText: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async (opts) => {
      const text = opts.input.text;

      // --- Try AI first ---
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const client = new GoogleGenerativeAI(apiKey);
          const model = client.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
          });
          const prompt = `Extract job info from the text below. Return ONLY a valid JSON object with exactly these keys:
{
  "title": "job role/title only — no company name, no articles like a/an/the",
  "company": "company name",
  "location": "city, country, Remote, or Hybrid",
  "type": "Full-Time | Part-Time | Contract | Internship",
  "experience": "0+ years | 1+ years | 2+ years | 3+ years | 5+ years",
  "salary": "salary info or Not specified",
  "applyLink": "full URL or empty string"
}
Text:
${text}`;
          const result = await model.generateContent(prompt);
          const raw = result.response.text().trim();
          // Extract JSON using string ops — no regex backtracking risk
          const jsonStr = (() => {
            const fenceStart = raw.indexOf('```');
            if (fenceStart !== -1) {
              const contentStart = raw.indexOf('\n', fenceStart) + 1;
              const fenceEnd = raw.indexOf('```', contentStart);
              if (fenceEnd !== -1)
                return raw.slice(contentStart, fenceEnd).trim();
            }
            const objStart = raw.indexOf('{');
            const objEnd = raw.lastIndexOf('}');
            if (objStart !== -1 && objEnd > objStart)
              return raw.slice(objStart, objEnd + 1);
            return raw;
          })();
          const parsed = JSON.parse(jsonStr);
          return {
            success: true,
            data: {
              title: (parsed.title ?? '').trim(),
              company: (parsed.company ?? '').trim(),
              location: (parsed.location ?? '').trim(),
              type: (parsed.type ?? 'Full-Time').trim(),
              experience: (parsed.experience ?? '').trim(),
              salary: (parsed.salary ?? 'Not specified').trim(),
              applyLink: (parsed.applyLink ?? '').trim(),
              description: '',
            },
          };
        } catch {
          // fall through to regex
        }
      }

      // AI unavailable — use local regex parser
      return { success: true, data: parseJobTextLocally(text) };
    }),

  generateDescription: publicProcedure
    .input(
      z.object({
        command: z.string(),
        existingContent: z.string().optional(),
        jobTitle: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { command, existingContent, jobTitle, company } = opts.input;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'AI not configured',
        });
      }
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
      });

      const context = [
        jobTitle ? `Job Title: ${jobTitle}` : '',
        company ? `Company: ${company}` : '',
        existingContent
          ? `Existing description:\n${existingContent.replace(/<[^>]+>/g, ' ').trim()}`
          : '',
      ]
        .filter(Boolean)
        .join('\n');

      const prompt = `You are writing a job description for a job board website.
${context ? `Context:\n${context}\n` : ''}
Instruction: ${command}

Write a professional, engaging job description in HTML. Use only these tags: <p>, <ul>, <li>, <strong>, <br>.
Include sections for: About the Role, Responsibilities, Requirements, and What We Offer.
Return ONLY the HTML — no markdown, no code fences, no extra text.`;

      try {
        const result = await model.generateContent(prompt);
        return { description: result.response.text().trim() };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate description',
        });
      }
    }),
});
