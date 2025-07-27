import mongoose, { model, models } from 'mongoose';

const InterviewExperienceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: 'Anonymous',
        },
        email: {
            type: String,
            required: false,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        jobType: {
            type: String,
            enum: [
                'Internship',
                'Full-Time',
                'PPO',
                'On-Campus',
                'Off-Campus',
                'Referral',
            ],
            required: true,
        },
        location: {
            type: String,
            default: '',
        },
        interviewDate: {
            type: Date,
            required: false,
        },
        graduationYear: {
            type: Number,
            required: false,
        },
        rounds: [
            {
                roundTitle: {
                    type: String,
                    required: true,
                },
                roundDescription: {
                    type: String,
                    required: true,
                },
            },
        ],
        detailedExperience: {
            type: String,
            required: true,
        },
        difficultyLevel: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium',
        },
        tags: {
            type: [String],
            default: [],
        },
        offerStatus: {
            type: String,
            enum: ['Selected', 'Rejected', 'Waiting for Results'],
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        feedback: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const InterviewExperience =
    models.InterviewExperience ||
    model('InterviewExperience', InterviewExperienceSchema);

export default InterviewExperience;
