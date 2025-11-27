'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Poll, pollsApi, votesApi } from '@/lib/api';
import { PollOption } from '@/components/poll-option';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, ArrowLeft, AlertCircle, Plus, X, Copy, Check, CheckCircle2, Pencil, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import PulseLoading from '@/components/ui/pulse-loading';
import { Navbar } from '@/components/navbar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function PollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isEditingRef = useRef(isEditing);
  const [newQuestion, setNewQuestion] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const pollId = parseInt(params.id as string);

  // Keep ref in sync with state
  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  const fetchPoll = async () => {
    try {
      const data = await pollsApi.getPoll(pollId);
      setPoll(data);
      // Use ref to check current editing state inside interval closure
      if (!isEditingRef.current) {
        setNewQuestion(data.question);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
    // Poll for updates every 3 seconds
    const interval = setInterval(fetchPoll, 3000);
    return () => clearInterval(interval);
  }, [pollId]);

  const handleVote = async (optionId: number) => {
    if (!user || voting) return;

    setVoting(true);
    setError(null);

    try {
      const updatedPoll = await votesApi.vote({ pollId, optionId });
      setPoll(updatedPoll);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to vote. Please try again.');
      }
    } finally {
      setVoting(false);
    }
  };

  const handleRetractVote = async () => {
    if (!user || voting) return;

    setVoting(true);
    setError(null);

    try {
      const updatedPoll = await votesApi.retractVote(pollId);
      setPoll(updatedPoll);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to retract vote. Please try again.');
      }
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || poll?.author.id !== user.id) return;

    try {
      await pollsApi.deletePoll(pollId);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete poll');
      setShowDeleteDialog(false);
    }
  };

  const copyPollLink = async () => {
    if (!poll?.id) return;

    const pollUrl = `${window.location.origin}/polls/${poll.id}`;
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pollUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!poll || !newQuestion.trim() || newQuestion === poll.question) {
      setIsEditing(false);
      setNewQuestion(poll?.question || '');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedPoll = await pollsApi.updatePoll(poll.id, { question: newQuestion });
      // Merge the updated question with the existing poll data to preserve options and author
      setPoll((prev) => prev ? { ...prev, question: updatedPoll.question } : null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update question');
    } finally {
      setIsUpdating(false);
    }
  };


  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <PulseLoading size="large" gradientType="coral" text="Loading poll..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (!poll) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-destructive">{error || 'Poll not found'}</div>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const userVote = poll.options.find((opt) =>
    opt.voters.some((v) => v.id === user?.id)
  );
  const showResults = totalVotes > 0 || userVote !== undefined;
  const isOwner = user?.id === poll.author.id;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-4 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="text-xl font-semibold h-10"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-green-500 hover:text-green-600"
                        onClick={handleUpdateQuestion}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          setIsEditing(false);
                          setNewQuestion(poll.question);
                        }}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 group mb-2">
                      <CardTitle className="text-2xl">{poll.question}</CardTitle>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                          onClick={() => setIsEditing(true)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={poll.author.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {poll.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>by {poll.author.name}</span>
                  </div>
                </div>
                {isOwner && (
                  <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Poll</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this poll? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {poll.options.map((option) => (
                  <PollOption
                    key={option.id}
                    option={option}
                    totalVotes={totalVotes}
                    isSelected={userVote?.id === option.id}
                    onClick={
                      !voting
                        ? () => handleVote(option.id)
                        : undefined
                    }
                    showResults={true}
                  />
                ))}
              </div>

              {userVote && (
                <Button
                  variant="outline"
                  onClick={handleRetractVote}
                  disabled={voting}
                  className="mt-4 w-full"
                >
                  {voting ? 'Retracting...' : 'Retract Vote'}
                </Button>
              )}

              {showResults && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Total votes: {totalVotes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="container mx-auto p-4 max-w-3xl">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Share this poll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/polls/${poll.id}` : ''}
                  className="font-mono text-sm bg-muted/50 h-10 flex-1"
                />
                <Button
                  type="button"
                  onClick={copyPollLink}
                  className={copied ? "gradient-pulse-hover text-white h-10 px-4 min-w-[120px]" : "h-10 px-4 min-w-[120px]"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </ProtectedRoute>
  );
}

