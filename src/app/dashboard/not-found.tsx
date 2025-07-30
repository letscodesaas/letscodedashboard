/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Home,
  Search,
  ArrowLeft,
  FileQuestion,
  Users,
  Settings,
  Briefcase,
  Calendar,
} from 'lucide-react';

export default function DashboardNotFound() {
  const quickLinks = [
    {
      title: 'Dashboard Home',
      description: 'Return to the main dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Task Manager',
      description: 'Manage your tasks and projects',
      href: '/dashboard/taskmanager',
      icon: Calendar,
    },
    {
      title: 'Teams',
      description: 'View and manage team members',
      href: '/dashboard/teams',
      icon: Users,
    },
    {
      title: 'Jobs',
      description: 'Browse job listings and applications',
      href: '/dashboard/jobs',
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Icon and Title */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            404
          </h1>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            The admin page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Quick Links
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Card
                key={link.href}
                className="transition-colors hover:bg-muted/50"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3">
                    {link.description}
                  </CardDescription>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    <Link href={link.href}>Visit Page</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              Can't find what you're looking for?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Try using the search functionality or contact your system
              administrator for assistance.
            </p>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <Link href="/dashboard/search">Search Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <Link href="/dashboard/settings">
                  <Settings className="mr-1 h-3 w-3" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact the{' '}
            <Link
              href="/dashboard/support"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
