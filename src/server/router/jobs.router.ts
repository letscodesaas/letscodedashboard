import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

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
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation((opts) => {
      const text = opts.input.text;
      const n = text.replace(/\r\n/g, '\n').trim();

      // Title — extract only the role name
      let title = '';
      const titleLabel = n.match(
        /(?:job title|position|role|title)\s*[:\-]\s*([^\n]+)/i
      );
      if (titleLabel) {
        title = titleLabel[1].trim();
      } else {
        // Match "is hiring [role]", "looking for [a] [role]", "join us as [a] [role]", "hiring: [role]"
        // Negated class [^\|,\n–]+ avoids ReDoS — no ambiguous overlap with the delimiter set
        const hiringMatch = n.match(
          /(?:is hiring|are hiring|we(?:'re| are) hiring|hiring\s*[:\-]|looking for\s*(?:a\s+|an\s+)?|join us as\s*(?:a\s+|an\s+)?|opening for\s*(?:a\s+|an\s+)?)\s*([^|,\n–]+)/i
        );
        if (hiringMatch) {
          title = hiringMatch[1].trim();
        } else {
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
      // Strip any trailing "at Company", "| location", "– info" that slipped through
      title = title
        .replace(/\s*[\|–]\s*.+$/, '')
        .replace(/\s+at\s+.+$/i, '')
        .trim();
      // Strip leading articles
      title = title.replace(/^(a|an|the)\s+/i, '').trim();

      // Company
      let company = '';
      const companyLabel = n.match(
        /(?:company|employer|organisation|organization)\s*[:\-]\s*([^\n]+)/i
      );
      if (companyLabel) {
        company = companyLabel[1].trim();
      } else {
        const atMatch = n.match(
          /\bat\s+([A-Z][a-zA-Z0-9\s&.]+?)(?:\s*[,|\n|–|-])/
        );
        if (atMatch) company = atMatch[1].trim();
        else {
          const nameMatch = n.match(
            /([A-Z][a-zA-Z0-9\s&.]+?)\s+(?:is hiring|is looking|pvt\.?|ltd\.?|llc|inc\.?|corp\.?|technologies|solutions|systems)/i
          );
          if (nameMatch) company = nameMatch[1].trim();
        }
      }

      // Location
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

      // Job type — internship checked first to avoid misclassifying as full-time
      let type = 'Full-Time';
      if (/\binternship\b|\bintern\b/i.test(n)) type = 'Internship';
      else if (/\bpart[\s-]?time\b/i.test(n)) type = 'Part-Time';
      else if (/\bcontract\b|\bfreelance\b/i.test(n)) type = 'Contract';

      // Experience
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

      // Salary
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

      // Apply link — first URL in text
      let applyLink = '';
      const urlMatch = n.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/i);
      if (urlMatch) applyLink = urlMatch[0].replace(/[.,;:)]+$/, '');

      return {
        success: true,
        data: {
          title,
          company,
          location,
          type,
          experience,
          salary,
          applyLink,
          description: `Job posting for ${title || 'Position'} at ${company || 'Company'}`,
        },
      };
    }),
});
