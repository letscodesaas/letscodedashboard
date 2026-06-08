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

function labelValue(lower: string, n: string, labels: string[]): string {
  for (const lbl of labels) {
    const idx = lower.indexOf(lbl);
    if (idx !== -1) {
      let rest = n.slice(idx + lbl.length).trimStart();
      if (rest.startsWith(':') || rest.startsWith('-')) {
        rest = rest.slice(1).trimStart();
        const nl = rest.indexOf('\n');
        return (nl === -1 ? rest : rest.slice(0, nl)).trim();
      }
    }
  }
  return '';
}

function stripTags(html: string): string {
  let out = '';
  let i = 0;
  while (i < html.length) {
    const open = html.indexOf('<', i);
    if (open === -1) {
      out += html.slice(i);
      break;
    }
    out += html.slice(i, open) + ' ';
    const close = html.indexOf('>', open);
    i = close === -1 ? html.length : close + 1;
  }
  return out.trim();
}

function parseJobTextLocally(text: string): ParsedJob {
  const n = text.replace(/\r\n/g, '\n').trim();
  const lower = n.toLowerCase();

  let title =
    labelValue(lower, n, ['job title', 'position', 'role', 'title']) || '';
  if (!title) {
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
        // Strip leading article (a/an/the) without regex backtracking
        for (const art of ['the ', 'an ', 'a ']) {
          if (rest.toLowerCase().startsWith(art)) {
            rest = rest.slice(art.length).trimStart();
            break;
          }
        }
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

  let company =
    labelValue(lower, n, [
      'company',
      'employer',
      'organisation',
      'organization',
    ]) || '';
  if (!company) {
    // "at CompanyName" — find " at " then take until delimiter
    const atPos = lower.indexOf(' at ');
    if (atPos !== -1) {
      const rest = n.slice(atPos + 4).trimStart();
      const delim = rest.search(/[,\n|–\-]/);
      const candidate = (delim === -1 ? rest : rest.slice(0, delim)).trim();
      if (/^[A-Z]/.test(candidate)) company = candidate;
    }
    if (!company) {
      // "CompanyName is hiring / pvt / ltd …" — find suffix, extract words before it
      const companySuffixes = [
        'is hiring',
        'is looking',
        ' pvt',
        ' ltd',
        ' llc',
        ' inc',
        ' corp',
        'technologies',
        'solutions',
        'systems',
      ];
      for (const suffix of companySuffixes) {
        const idx = lower.indexOf(suffix);
        if (idx !== -1) {
          const words = n.slice(0, idx).trim().split(/\s+/);
          const caps: string[] = [];
          for (let i = words.length - 1; i >= 0; i--) {
            if (/^[A-Z]/.test(words[i])) caps.unshift(words[i]);
            else break;
          }
          if (caps.length) {
            company = caps.join(' ');
            break;
          }
        }
      }
    }
  }

  let location =
    labelValue(lower, n, ['location', 'based in', 'office location', 'city']) ||
    '';
  if (!location) {
    if (/\bhybrid\b/i.test(n) && /\bremote\b/i.test(n))
      location = 'Hybrid / Remote';
    else if (/\bremote\b/i.test(n)) location = 'Remote';
    else if (/\bhybrid\b/i.test(n)) location = 'Hybrid';
  }

  let type = 'Full-Time';
  if (/\binternship\b|\bintern\b/i.test(n)) type = 'Internship';
  else if (lower.includes('part-time') || lower.includes('part time'))
    type = 'Part-Time';
  else if (/\bcontract\b|\bfreelance\b/i.test(n)) type = 'Contract';

  let experience = '';
  // Walk backward from "year" to find the preceding digit — no regex backtracking
  const yearIdx = lower.indexOf('year');
  if (yearIdx !== -1) {
    let p = yearIdx - 1;
    while (p >= 0 && (n[p] === ' ' || n[p] === '+')) p--;
    if (p >= 0 && n[p] >= '0' && n[p] <= '9') {
      const numEnd = p + 1;
      while (p > 0 && n[p - 1] >= '0' && n[p - 1] <= '9') p--;
      const years = parseInt(n.slice(p, numEnd), 10);
      if (years === 0) experience = '0+ years';
      else if (years === 1) experience = '1+ years';
      else if (years === 2) experience = '2+ years';
      else if (years <= 4) experience = '3+ years';
      else experience = '5+ years';
    }
  }
  if (!experience) {
    if (
      /\bfresher\b/i.test(n) ||
      lower.includes('entry-level') ||
      lower.includes('entry level')
    )
      experience = '0+ years';
    else if (/\bjunior\b/i.test(n)) experience = '1+ years';
    else if (lower.includes('mid-level') || lower.includes('mid level'))
      experience = '3+ years';
    else if (/\bsenior\b|\blead\b|\bprincipal\b/i.test(n))
      experience = '5+ years';
  }

  const salaryFromLabel = labelValue(lower, n, [
    'salary',
    'compensation',
    'pay',
    'ctc',
    'package',
    'stipend',
  ]);
  let salary = salaryFromLabel || 'Not specified';
  if (salary === 'Not specified') {
    // Search for currency-prefixed amounts — indexOf only, no nested quantifiers
    const currencyPfxs = [
      '$',
      '₹',
      'rs.',
      'rs ',
      'inr ',
      'usd ',
      'eur ',
      'gbp ',
    ];
    for (const pfx of currencyPfxs) {
      const idx = lower.indexOf(pfx);
      if (idx !== -1) {
        const nl = n.indexOf('\n', idx);
        salary = (nl === -1 ? n.slice(idx) : n.slice(idx, nl)).trim();
        break;
      }
    }
    if (salary === 'Not specified') {
      // Search for LPA/lakh/lac amounts using indexOf
      const lpaKws = ['lpa', 'lakh', 'lac'];
      for (const kw of lpaKws) {
        const idx = lower.indexOf(kw);
        if (idx !== -1) {
          const lineStart = lower.lastIndexOf('\n', idx) + 1;
          salary = n.slice(lineStart, idx + kw.length).trim();
          break;
        }
      }
    }
  }

  let applyLink = '';
  const httpIdx = n.indexOf('http');
  if (httpIdx !== -1) {
    let end = httpIdx;
    while (end < n.length) {
      const c = n[end];
      if (
        c === ' ' ||
        c === '\t' ||
        c === '\n' ||
        c === '\r' ||
        c === '<' ||
        c === '"' ||
        c === '>'
      )
        break;
      end++;
    }
    // Strip trailing punctuation without regex
    while (end > httpIdx) {
      const last = n[end - 1];
      if (
        last === '.' ||
        last === ',' ||
        last === ';' ||
        last === ':' ||
        last === ')'
      )
        end--;
      else break;
    }
    applyLink = n.slice(httpIdx, end);
  }

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
  linkedinEmployeesLink: z.string().optional(),
  interviewExperience: z.string().optional(),
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
  linkedinEmployeesLink: z.string().optional(),
  interviewExperience: z.string().optional(),
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
    const updatedJob = await opts.ctx.db.Jobs.findByIdAndUpdate(
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
        linkedinEmployeesLink: input.linkedinEmployeesLink,
        interviewExperience: input.interviewExperience,
        status: input.status,
      },
      { new: true }
    );

    return {
      message: 'updated',
      data: updatedJob,
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

  checkJobLinks: publicProcedure.mutation(async (opts) => {
    const jobs = await opts.ctx.db.Jobs.find({ status: true })
      .select('_id title company applyLink')
      .lean();

    const results = await Promise.all(
      (
        jobs as Array<{
          _id: { toString(): string };
          title: string;
          company: string;
          applyLink: string;
        }>
      ).map(async (job) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        try {
          const res = await fetch(job.applyLink, {
            method: 'HEAD',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)' },
            redirect: 'follow',
          });
          clearTimeout(timer);
          const dead = res.status === 404 || res.status === 410;
          return {
            _id: job._id.toString(),
            title: job.title,
            company: job.company,
            applyLink: job.applyLink,
            linkStatus: dead ? 'dead' : 'alive',
            httpStatus: res.status,
          };
        } catch {
          clearTimeout(timer);
          return {
            _id: job._id.toString(),
            title: job.title,
            company: job.company,
            applyLink: job.applyLink,
            linkStatus: 'error',
            httpStatus: 0,
          };
        }
      })
    );

    return results;
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
          const companyName = (parsed.company ?? '').trim();

          // Fetch LinkedIn company ID and construct employees search URL
          let linkedinEmployeesLink = '';
          if (companyName) {
            try {
              const linkedinPrompt = `Find the LinkedIn company ID (numeric ID) for "${companyName}". 
Return ONLY the numeric company ID. For example, if the company is Microsoft, return "123456" (but use the actual ID).
If you cannot find the company on LinkedIn, return "NOT_FOUND".
Do not include any other text or explanation.`;
              const linkedinResult =
                await model.generateContent(linkedinPrompt);
              const companyId = linkedinResult.response.text().trim();

              if (
                companyId &&
                companyId !== 'NOT_FOUND' &&
                /^\d+$/.test(companyId)
              ) {
                linkedinEmployeesLink = `https://www.linkedin.com/search/results/people?skipRedirect=true&origin=COMPANY_PAGE_CANNED_SEARCH&currentCompany=%5B%22${companyId}%22%5D`;
              }
            } catch {
              // Silently fail for LinkedIn lookup
              linkedinEmployeesLink = '';
            }
          }

          return {
            success: true,
            data: {
              title: (parsed.title ?? '').trim(),
              company: companyName,
              location: (parsed.location ?? '').trim(),
              type: (parsed.type ?? 'Full-Time').trim(),
              experience: (parsed.experience ?? '').trim(),
              salary: (parsed.salary ?? 'Not specified').trim(),
              applyLink: (parsed.applyLink ?? '').trim(),
              linkedinEmployeesLink,
              description: '',
            },
          };
        } catch {
          // fall through to regex
        }
      }

      // AI unavailable — use local regex parser
      const localData = parseJobTextLocally(text);
      return {
        success: true,
        data: { ...localData, linkedinEmployeesLink: '' },
      };
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
          ? `Existing description:\n${stripTags(existingContent)}`
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
