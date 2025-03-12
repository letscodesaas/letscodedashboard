import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate an email template for ${data.topic} in HTML with inline CSS for a modern, responsive design. The template should include a header, a main content section with a call-to-action button, and a footer. The design should be clean, professional, and mobile-friendly. Provide only the HTML and CSS code without any additional text or explanations.`;
    const result = await model.generateContent(prompt);
    return NextResponse.json(
      { message: result.response.text() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};
