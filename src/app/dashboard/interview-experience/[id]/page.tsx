'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  Clock,
  DollarSign,
  ExternalLink,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Github,
  Linkedin,
  FileText,
  Users,
  Target,
  BookOpen,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { InterviewExperience } from './edit/types';
import { toast } from 'sonner';

const InterviewExperiencePage = () => {
  const [experience, setExperience] = useState<InterviewExperience | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const fetchExperience = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interview-experiences/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch interview experience');
      }
      const data = await response.json();
      setExperience(data.data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExperience(id);
    } else {
      setError('Invalid interview experience ID');
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    router.push('/dashboard/interview-experience');
  };

  const handleEdit = () => {
    router.push(`/dashboard/interview-experience/${id}/edit`);
  };

  const handleViewPublic = (exp: InterviewExperience) => {
    const slug = `${exp.company.toLowerCase().replace(/\s+/g, '-')}-${exp.role.toLowerCase().replace(/\s+/g, '-')}/${exp._id}`;
    window.open(
      `https://www.lets-code.co.in/interview-experience/${slug}`,
      '_blank'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Waiting for Results':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Alert variant="destructive" ref={errorRef}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Interview experience not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {experience.company} - {experience.role}
            </h1>
            <p className="text-muted-foreground">
              Interview Experience Details
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-2 bg-transparent"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            {experience.isApproved && (
              <Button
                onClick={() => handleViewPublic(experience)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Public
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Approval Status Alert */}
      {!experience.isApproved &&
        experience.feedback && ( // if feedback exists, means admin has reviewed it and needs revision
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">
                      This experience needs revision
                    </h4>
                    <div className="bg-white/50 rounded-md p-3 border border-red-200">
                      <p className="text-sm font-medium text-red-900 mb-1">
                        Admin Feedback:
                      </p>
                      <div className="text-sm text-red-800 whitespace-pre-wrap leading-relaxed">
                        <ReactMarkdown>{experience.feedback}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800 shrink-0"
                  >
                    <Edit className="h-4 w-4" />
                    Edit & Resubmit
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

      {!experience.isApproved &&
        !experience.feedback && ( // if no feedback, means it's pending approval
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="flex items-center justify-between">
                <span>
                  This experience is pending approval. Kindly approve it, if you
                  find it suitable.
                </span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 ml-4"
                >
                  Under Review
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

      {experience.isApproved && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span>
                  This experience has been approved and is now publicly visible!
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Live
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewPublic(experience)}
                className="flex items-center gap-2 bg-white hover:bg-green-50 border-green-300 text-green-700 hover:text-green-800"
              >
                <Eye className="h-4 w-4" />
                View Public Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Detailed Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {experience.detailedExperience}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interview Rounds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Interview Rounds ({experience.rounds.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experience.rounds.map((round, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Round {index + 1}</Badge>
                      <h4 className="font-semibold">{round.roundTitle}</h4>
                    </div>
                    {round.roundDate && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(round.roundDate)}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">
                      {round.roundDescription}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources Used */}
          {experience.resourcesUsed && experience.resourcesUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Resources Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {experience.resourcesUsed.map((resource, index) => (
                    <Badge key={index} variant="secondary">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{experience.company}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{experience.role}</span>
              </div>

              {experience.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{experience.location}</span>
                </div>
              )}

              {experience.interviewDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(experience.interviewDate)}
                  </span>
                </div>
              )}

              {experience.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{experience.duration}</span>
                </div>
              )}

              {experience.packageCTC && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-green-600">
                    {experience.packageCTC}
                  </span>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Job Type
                  </span>
                  <Badge variant="secondary">{experience.jobType}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(experience.offerStatus)}>
                    {experience.offerStatus}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Difficulty
                  </span>
                  <Badge
                    className={getDifficultyColor(experience.difficultyLevel)}
                  >
                    {experience.difficultyLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          {(experience.collegeName || experience.graduationYear) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {experience.collegeName && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      College
                    </span>
                    <p className="text-sm font-medium">
                      {experience.collegeName}
                    </p>
                  </div>
                )}
                {experience.graduationYear && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Graduation Year
                    </span>
                    <p className="text-sm font-medium">
                      {experience.graduationYear}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Links */}
          {(experience.resumeLink ||
            experience.linkedIn ||
            experience.github) && (
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {experience.resumeLink && (
                  <a
                    href={experience.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4" />
                    Resume
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {experience.linkedIn && (
                  <a
                    href={experience.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {experience.github && (
                  <a
                    href={experience.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {experience.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(experience.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={
                    experience.isApproved ? 'text-green-600' : 'text-orange-600'
                  }
                >
                  {experience.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Featured</span>
                <span>{experience.isFeatured ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Anonymous</span>
                <span>{experience.isAnonymous ? 'Yes' : 'No'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewExperiencePage;
