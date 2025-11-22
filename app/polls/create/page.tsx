'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pollsApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, X, ArrowLeft, Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CreatePollPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedOptions = options.map((opt) => opt.trim()).filter((opt) => opt.length > 0);

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (trimmedOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setIsLoading(true);

    try {
      const poll = await pollsApi.createPoll({
        question: question.trim(),
        options: trimmedOptions,
      });
      router.push(`/polls/${poll.id}`);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = errors.map((e: any) => e.message).join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to create poll. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-4 max-w-2xl">
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
              <CardTitle className="text-2xl gradient-pulse-text">Create a New Poll</CardTitle>
              <CardDescription>
                Create a poll to gather opinions and make decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="question">Poll Question</FieldLabel>
                    <Input
                      id="question"
                      type="text"
                      placeholder="What tech stack should we use?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between mb-2">
                      <FieldLabel>Options</FieldLabel>
                      {options.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          {options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index)}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <FieldDescription>
                      Provide at least 2 options. You can add up to 10 options.
                    </FieldDescription>
                  </Field>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Field>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? 'Creating...' : 'Create Poll'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

