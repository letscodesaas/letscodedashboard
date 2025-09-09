// src: /app/dashboard/interview-experience/[id]/edit/page.tsx

'use client';
import type React from 'react';
import type {
  InterviewExperience,
  Round,
  JobType,
  DifficultyLevel,
  OfferStatus,
} from './types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Building2,
  GraduationCap,
  FileText,
  Target,
  BookOpen,
  Tags,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const jobTypes: JobType[] = [
  'Internship',
  'Full-Time',
  'PPO',
  'On-Campus',
  'Off-Campus',
  'Referral',
];
const difficultyLevels: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];
const offerStatuses: OfferStatus[] = [
  'Selected',
  'Rejected',
  'Waiting for Results',
];

const EditExperience = () => {
  const [experience, setExperience] = useState<InterviewExperience | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { token } = useAuth();

  // Form state
  const [formData, setFormData] = useState<Partial<InterviewExperience>>({
    rounds: [],
    resourcesUsed: [],
    technologies: [],
    tags: [],
  });

  // Temporary states for array inputs
  const [newResource, setNewResource] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newTag, setNewTag] = useState('');

  const fetchExperience = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interview-experiences/${id}`);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setExperience(data.data);
      setFormData(data.data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        setError('An unknown error occurred');
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRoundChange = (
    index: number,
    field: keyof Round,
    value: string
  ) => {
    const updatedRounds = [...(formData.rounds || [])];
    updatedRounds[index] = { ...updatedRounds[index], [field]: value };
    setFormData((prev) => ({ ...prev, rounds: updatedRounds }));
  };

  const addRound = () => {
    const newRound: Round = {
      roundTitle: '',
      roundDescription: '',
      roundDate: '',
    };
    setFormData((prev) => ({
      ...prev,
      rounds: [...(prev.rounds || []), newRound],
    }));
  };

  const removeRound = (index: number) => {
    const updatedRounds = formData.rounds?.filter((_, i) => i !== index) || [];
    setFormData((prev) => ({ ...prev, rounds: updatedRounds }));
  };

  const addArrayItem = (
    arrayName: 'resourcesUsed' | 'technologies' | 'tags',
    value: string
  ) => {
    if (value.trim()) {
      const currentArray = formData[arrayName] || [];
      if (!currentArray.includes(value.trim())) {
        setFormData((prev) => ({
          ...prev,
          [arrayName]: [...currentArray, value.trim()],
        }));
      }
    }
  };

  const removeArrayItem = (
    arrayName: 'resourcesUsed' | 'technologies' | 'tags',
    index: number
  ) => {
    const currentArray = formData[arrayName] || [];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [arrayName]: updatedArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/interview-experiences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update experience');
      }

      const updatedExperience = await response.json();
      setExperience(updatedExperience.data);
      setSuccess('Experience updated successfully!');
      toast.success('Experience updated successfully!', {
        description:
          'Your interview experience has been updated, Redirecting to view page...',
      });

      // Redirect back to view page after successful update
      setTimeout(() => {
        router.push(`/dashboard/interview-experience/${id}`);
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        setError('An error occurred while updating the experience');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(`/dashboard/interview-experience/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Experience
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
          Back to Experience
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Edit Interview Experience
            </h1>
            <p className="text-muted-foreground">
              {experience?.company} - {experience?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                    placeholder="Enter role/position"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    value={formData.jobType || ''}
                    onValueChange={(value) =>
                      handleSelectChange('jobType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interviewDate">
                    Interview Date (Optional)
                  </Label>
                  <Input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    value={formData.interviewDate?.split('T')[0] || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (Optional)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 6 months"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic & Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic & Professional Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="collegeName">College Name (Optional)</Label>
                  <Input
                    id="collegeName"
                    name="collegeName"
                    value={formData.collegeName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter college name"
                  />
                </div>
                <div>
                  <Label htmlFor="graduationYear">
                    Graduation Year (Optional)
                  </Label>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    value={formData.graduationYear || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currentStatus">Current Status</Label>
                <Input
                  id="currentStatus"
                  name="currentStatus"
                  value={formData.currentStatus || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Student, Working Professional"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentRole">Current Role (Optional)</Label>
                <Input
                  id="currentRole"
                  name="currentRole"
                  value={formData.currentRole || ''}
                  onChange={handleInputChange}
                  placeholder="Enter current role"
                />
              </div>

              <div>
                <Label htmlFor="packageCTC">Package/CTC (Optional)</Label>
                <Input
                  id="packageCTC"
                  name="packageCTC"
                  value={formData.packageCTC || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 6 LPA"
                />
              </div>
            </CardContent>
          </Card>

          {/* Interview Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Interview Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Select
                    value={formData.difficultyLevel || ''}
                    onValueChange={(value) =>
                      handleSelectChange('difficultyLevel', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offerStatus">Offer Status</Label>
                  <Select
                    value={formData.offerStatus || ''}
                    onValueChange={(value) =>
                      handleSelectChange('offerStatus', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {offerStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAnonymous"
                    checked={formData.isAnonymous || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('isAnonymous', checked as boolean)
                    }
                  />
                  <Label htmlFor="isAnonymous">Post anonymously</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Links & Social
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resumeLink">Resume Link (Optional)</Label>
                <Input
                  id="resumeLink"
                  name="resumeLink"
                  type="url"
                  value={formData.resumeLink || ''}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="linkedIn">LinkedIn Profile (Optional)</Label>
                <Input
                  id="linkedIn"
                  name="linkedIn"
                  type="url"
                  value={formData.linkedIn || ''}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <Label htmlFor="github">GitHub Profile (Optional)</Label>
                <Input
                  id="github"
                  name="github"
                  type="url"
                  value={formData.github || ''}
                  onChange={handleInputChange}
                  placeholder="https://github.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-6">
          {/* Detailed Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Detailed Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="detailedExperience">
                  Share your detailed interview experience
                </Label>
                <Textarea
                  id="detailedExperience"
                  name="detailedExperience"
                  value={formData.detailedExperience || ''}
                  onChange={handleInputChange}
                  placeholder="Describe your interview experience in detail..."
                  className="min-h-[200px]"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Include details about the interview process, questions asked,
                  your preparation, etc.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interview Rounds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Interview Rounds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.rounds?.map((round, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Round {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRound(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`roundTitle-${index}`}>Round Title</Label>
                      <Input
                        id={`roundTitle-${index}`}
                        value={round.roundTitle}
                        onChange={(e) =>
                          handleRoundChange(index, 'roundTitle', e.target.value)
                        }
                        placeholder="e.g., Technical Round, HR Round"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`roundDate-${index}`}>
                        Round Date (Optional)
                      </Label>
                      <Input
                        id={`roundDate-${index}`}
                        type="date"
                        value={round.roundDate?.split('T')[0] || ''}
                        onChange={(e) =>
                          handleRoundChange(index, 'roundDate', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`roundDescription-${index}`}>
                      Round Description
                    </Label>
                    <Textarea
                      id={`roundDescription-${index}`}
                      value={round.roundDescription}
                      onChange={(e) =>
                        handleRoundChange(
                          index,
                          'roundDescription',
                          e.target.value
                        )
                      }
                      placeholder="Describe what happened in this round..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addRound}
                className="w-full bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </Button>
            </CardContent>
          </Card>

          {/* Resources, Technologies, and Tags */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Resources Used */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Resources Used
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="Add resource..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('resourcesUsed', newResource);
                        setNewResource('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addArrayItem('resourcesUsed', newResource);
                      setNewResource('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.resourcesUsed?.map((resource, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {resource}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('resourcesUsed', index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add technology..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('technologies', newTechnology);
                        setNewTechnology('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addArrayItem('technologies', newTechnology);
                      setNewTechnology('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies?.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('technologies', index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('tags', newTag);
                        setNewTag('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addArrayItem('tags', newTag);
                      setNewTag('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tags', index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditExperience;
