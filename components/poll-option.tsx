'use client';

import { PollOption as PollOptionType } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';

interface PollOptionProps {
  option: PollOptionType;
  totalVotes: number;
  isSelected?: boolean;
  onClick?: () => void;
  showResults?: boolean;
}

export function PollOption({
  option,
  totalVotes,
  isSelected = false,
  onClick,
  showResults = false,
}: PollOptionProps) {
  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  console.log('Rendering option:', option);
  return (
    <div
      className={cn(
        'relative border rounded-lg p-4 transition-all',
        onClick && 'cursor-pointer hover:border-orange-500/50 hover:shadow-md',
        isSelected && 'border-orange-500 ring-2 ring-orange-500/50 shadow-md gradient-pulse-shadow'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="font-medium text-sm">{option.text}</span>
          </div>
          {showResults && (
            <div className="relative mb-3">
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <span className="absolute right-0 -top-5 text-xs font-semibold text-muted-foreground">
                  {percentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {showResults && (
        <div className='flex justify-between'>

          <div className="text-xs text-muted-foreground mt-2">
            {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
          </div>
          {showResults && option.voters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                  {option.voters
                    .slice(0, 3)
                    .map((voter) => (
                      <Avatar key={voter.id} className="h-8 w-8 border-2 border-background -ml-2 first:ml-0">
                        <AvatarImage src={voter.avatarUrl || undefined} alt={voter.name} />
                        <AvatarFallback className="text-xs">
                          {voter.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  {option.voters.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium -ml-2">
                      +{option.voters.length - 3}
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-[300px] overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  Voters ({option.voters.length})
                </div>
                {option.voters.map((voter) => (
                  <div key={voter.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarImage src={voter.avatarUrl || undefined} alt={voter.name} />
                      <AvatarFallback className="text-xs">
                        {voter.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate">{voter.name}</p>
                      {voter.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {voter.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

      )}
    </div>

  );
}

