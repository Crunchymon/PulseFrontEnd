'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/context/auth-context';
import { pollsApi, Poll } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '@/components/ui/empty';
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
import { Plus, Search, ArrowUpDown, Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [allPolls, setAllPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [deletePollId, setDeletePollId] = useState<number | null>(null);
  const limit = 10;

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all polls without pagination
      const response = await pollsApi.getPolls();
      setAllPolls(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Client-side filtering, sorting, and pagination
  const filteredAndSortedPolls = useMemo(() => {
    let result = [...allPolls];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((poll) =>
        poll.question.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      // Assuming polls have createdAt or we can use id as proxy
      // For now, using id as a proxy for creation time (higher id = newer)
      if (sortOrder === 'newest') {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });

    return result;
  }, [allPolls, searchQuery, sortOrder]);

  // Pagination
  const totalItems = filteredAndSortedPolls.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const polls = filteredAndSortedPolls.slice(startIndex, endIndex);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  const handleDelete = async (pollId: number) => {
    try {
      await pollsApi.deletePoll(pollId);
      setAllPolls(allPolls.filter((p) => p.id !== pollId));
      setDeletePollId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete poll');
    }
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}!
              </p>
            </div>
            <Button onClick={() => router.push('/polls/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>My Polls</CardTitle>
              <CardDescription>
                Manage and view all your created polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="flex gap-4 flex-col sm:flex-row">
                  <Field>
                    <FieldLabel htmlFor="search">Search Polls</FieldLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        type="text"
                        placeholder="Search by question..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </Field>
                  
                  <Field className='flex-1'>
                    <FieldLabel>Sort</FieldLabel>
                    <Button
                      variant="outline"
                      onClick={toggleSort}
                      className="min-w-[150px] w-full sm:w-auto"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                    </Button>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground">Loading polls...</div>
            </div>
          ) : polls.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Search className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>
                  {searchQuery
                    ? 'No polls found'
                    : "You haven't created any polls yet"}
                </EmptyTitle>
                <EmptyDescription>
                  {searchQuery
                    ? 'Try adjusting your search query.'
                    : 'Create your first poll to get started.'}
                </EmptyDescription>
              </EmptyHeader>
              {!searchQuery && (
                <EmptyContent>
                  <Button onClick={() => router.push('/polls/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Poll
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {polls.map((poll) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                  return (
                    <Card key={poll.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/polls/${poll.id}`}>
                              <CardTitle className="text-xl mb-2 hover:text-primary transition-colors cursor-pointer">
                                {poll.question}
                              </CardTitle>
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Avatar className="h-5 w-5">
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
                              <span>{poll.author.name}</span>
                            </div>
                          </div>
                          {poll.author.id === user?.id && (
                            <AlertDialog open={deletePollId === poll.id} onOpenChange={(open) => !open && setDeletePollId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletePollId(poll.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 gradient-pulse-text" />
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
                                    onClick={() => handleDelete(poll.id)}
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
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {poll.options.length} options • {totalVotes} total votes
                          </div>
                          <Link href={`/polls/${poll.id}`}>
                            <Button variant="outline" className="w-full">
                              View Poll
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • {totalItems} total polls
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
