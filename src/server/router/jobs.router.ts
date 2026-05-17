import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    .input(z.object({
      text: z.string(),
    }))
    .mutation(async (opts) => {
      try {
        const { input } = opts;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
          throw new Error('Gemini API key not configured');
        }

        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Extract job information from the following text and return a JSON object with these fields:
- title: Job title/position (string)
- company: Company name (string)
- location: Job location (string)
- type: Job type - choose from: "Full-Time", "Part-Time", "Contract", "Internship" (string)
- experience: Experience level - choose from: "0+ years", "1+ years", "2+ years", "3+ years", "5+ years" (string)
- salary: Salary information if available, else return "Not specified" (string)
- applyLink: Application URL if available, else return empty string (string)

Text to parse:
${input.text}

Return ONLY a valid JSON object, no additional text or markdown formatting.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        console.log('Gemini response:', responseText);

        // Parse the JSON response - try multiple approaches
        let parsedData;
        
        // First try: direct JSON parsing
        try {
          parsedData = JSON.parse(responseText);
        } catch {
          // Second try: extract JSON from markdown code block
          const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
          if (jsonMatch && jsonMatch[1]) {
            parsedData = JSON.parse(jsonMatch[1]);
          } else {
            // Third try: extract JSON object
            const objectMatch = responseText.match(/\{[\s\S]*\}/);
            if (objectMatch) {
              parsedData = JSON.parse(objectMatch[0]);
            } else {
              throw new Error('Could not extract JSON from response');
            }
          }
        }

        return {
          success: true,
          data: {
            title: (parsedData.title || '').trim(),
            company: (parsedData.company || '').trim(),
            location: (parsedData.location || '').trim(),
            type: (parsedData.type || '').trim(),
            experience: (parsedData.experience || '').trim(),
            salary: (parsedData.salary || '').trim(),
            applyLink: (parsedData.applyLink || '').trim(),
            description: `Job posting for ${(parsedData.title || 'Position').trim()} at ${(parsedData.company || 'Company').trim()}`,
          }
        };
      } catch (error) {
        console.error('Parse job text error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to parse job text'
        });
      }
    }),
});
