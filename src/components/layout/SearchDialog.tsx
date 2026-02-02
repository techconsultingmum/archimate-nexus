import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/hooks/useSearch';
import { DOMAIN_LABELS, STATUS_LABELS } from '@/types/artifacts';
import { Loader2, FileText, Building2, Database, AppWindow, Server, Brain, Cloud } from 'lucide-react';

const domainIcons: Record<string, typeof Building2> = {
  business: Building2,
  data: Database,
  application: AppWindow,
  technology: Server,
  ai: Brain,
  cloud: Cloud,
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const { query, setQuery, results, isSearching, clearSearch } = useSearch();

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    clearSearch();
  };

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      clearSearch();
    }
  }, [open, clearSearch]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search artifacts..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isSearching ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 && query ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>Start typing to search...</CommandEmpty>
        ) : (
          <CommandGroup heading="Artifacts">
            {results.map((result) => {
              const DomainIcon = domainIcons[result.domain || 'business'] || FileText;
              return (
                <CommandItem
                  key={result.id}
                  value={result.name}
                  onSelect={() => handleSelect(result.href)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <DomainIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {DOMAIN_LABELS[result.domain as keyof typeof DOMAIN_LABELS] || result.domain}
                    </p>
                  </div>
                  {result.status && (
                    <Badge variant="outline" className="text-xs">
                      {STATUS_LABELS[result.status as keyof typeof STATUS_LABELS] || result.status}
                    </Badge>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
