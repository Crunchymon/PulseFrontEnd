'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/context/auth-context';
import { pollsApi, Poll, PollsMeta } from '@/lib/api';
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
import { cn } from "@/lib/utils";
import PulseLoading from '@/components/ui/pulse-loading';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<PollsMeta>({
    totalPolls: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 4
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'question' | 'votes'>('createdAt');
  const [error, setError] = useState<string | null>(null);
  const [deletePollId, setDeletePollId] = useState<number | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when debounced search changes
  useEffect(() => {
    setMeta(prev => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearch]);

  const fetchPolls = async (silent = false) => {
    if (!silent && polls.length === 0) setLoading(true);
    if (!silent && polls.length > 0) setIsRefreshing(true);
    setError(null);
    try {
      const response = await pollsApi.getPolls({
        page: meta.currentPage,
        limit: meta.limit,
        search: debouncedSearch,
        sortBy,
        order: sortOrder
      });
      setPolls(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load polls');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [meta.currentPage, debouncedSearch, sortOrder, sortBy]);

  // Poll for updates every 10 seconds (less frequent to avoid spamming with params)
  useEffect(() => {
    const interval = setInterval(() => fetchPolls(true), 10000);
    return () => clearInterval(interval);
  }, [meta.currentPage, debouncedSearch, sortOrder, sortBy]);



  // Optimistically update polls when user profile changes
  useEffect(() => {
    if (user) {
      setPolls((currentPolls) =>
        currentPolls.map((poll) =>
          poll.author.id === user.id
            ? { ...poll, author: { ...poll.author, name: user.name, avatarUrl: user.avatarUrl } }
            : poll
        )
      );
    }
  }, [user]);



  const handleDelete = async (pollId: number) => {
    try {
      await pollsApi.deletePoll(pollId);
      // Refresh the current page
      fetchPolls(true);
      setDeletePollId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete poll');
    }
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handlePageChange = (page: number) => {
    setMeta(prev => ({ ...prev, currentPage: page }));
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
                      {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
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
            <div className="flex items-center justify-center py-12">
              <PulseLoading size="default" gradientType="coral" text="Loading polls..." />
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
              <div className={cn("space-y-4 mb-6 transition-opacity duration-200", isRefreshing && "opacity-50 pointer-events-none")}>
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
                              <span className="mx-1">•</span>
                              <span>{new Date(poll.createdAt).toLocaleDateString()} {new Date(poll.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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

              {meta.totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-6">
                  <div className="text-sm text-muted-foreground">
                    Page {meta.currentPage} of {meta.totalPages}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (meta.currentPage > 1) handlePageChange(meta.currentPage - 1);
                          }}
                          className={meta.currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {/* First Page */}
                      {meta.currentPage > 2 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(1); }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis if far from start */}
                      {meta.currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Previous Page if not first */}
                      {meta.currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(meta.currentPage - 1); }}
                          >
                            {meta.currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Current Page */}
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          {meta.currentPage}
                        </PaginationLink>
                      </PaginationItem>

                      {/* Next Page if not last */}
                      {meta.currentPage < meta.totalPages && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(meta.currentPage + 1); }}
                          >
                            {meta.currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis if far from end */}
                      {meta.currentPage < meta.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Last Page */}
                      {meta.currentPage < meta.totalPages - 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(meta.totalPages); }}
                          >
                            {meta.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (meta.currentPage < meta.totalPages) handlePageChange(meta.currentPage + 1);
                          }}
                          className={meta.currentPage >= meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
