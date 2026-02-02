import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchitectureArtifact } from '@/types/artifacts';

interface SearchResult {
  id: string;
  name: string;
  type: 'artifact' | 'domain';
  domain?: string;
  status?: string;
  href: string;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('architecture_artifacts')
        .select('id, name, domain, status, artifact_type')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      const searchResults: SearchResult[] = (data || []).map((artifact) => ({
        id: artifact.id,
        name: artifact.name,
        type: 'artifact' as const,
        domain: artifact.domain,
        status: artifact.status,
        href: `/repository/${artifact.domain}`,
      }));

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch: () => {
      setQuery('');
      setResults([]);
    },
  };
}
