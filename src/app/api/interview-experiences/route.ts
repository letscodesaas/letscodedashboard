// GET all interview experiences
import InterviewExperience from '@/models/InterviewExperience.Model';
import { DB } from '@/utils/db';
import { NextResponse } from 'next/server';

DB();
export const GET = async () => {
    try {
        const experiences = await InterviewExperience.find();
        return NextResponse.json({
            success: true,
            message: 'Interview experiences retrieved successfully',
            data: experiences
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching interview experiences:', error);
        return NextResponse.json({ message: 'Failed to fetch experiences', error }, { status: 500 });
    }
}