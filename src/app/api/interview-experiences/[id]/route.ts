// DELETE /api/interview-experiences/:id
import InterviewExperience from '@/models/InterviewExperience.Model';
import { NextRequest, NextResponse } from 'next/server';

import { DB } from '@/utils/db';
import { isAllowed } from '@/lib/isAllowed';
DB();
// NO authentication currently, but should be added later
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }
    // Check if the request body has a valid token
    const body = await req.json();
    const token = body.token;


    try {
        await isAllowed(token, 'admin');

        const experience = await InterviewExperience.findById(id);
        if (!experience) {
            return NextResponse.json(
                { message: 'Experience not found' },
                { status: 404 }
            );
        }
        const deleted = await InterviewExperience.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json(
                { message: 'Failed to delete experience' },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: 'Experience deleted successfully',
                data: deleted,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to delete experience: ', error: error.message },
            { status: 500 }
        );
    }
}