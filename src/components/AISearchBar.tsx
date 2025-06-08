
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, X, TrendingUp } from 'lucide-react';

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'trend' | 'ai';
}

interface AISearchBarProps {
  placeholder?: string;
  compact?: boolean;
}

const AISearchBar = ({ placeholder = "Search with AI assistance...", compact = false }: AISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock AI suggestions based on query
  const generateAISuggestions = (searchQuery: string): SearchSuggestion[] => {
    const aiSuggestions: SearchSuggestion[] = [];
    
    if (searchQuery.length > 0) {
      // Product suggestions
      const products = ['Jordan shoes', 'Barcelona jersey', 'Athletic wear', 'Running shoes'];
      products.forEach(product => {
        if (product.toLowerCase().includes(searchQuery.toLowerCase())) {
          aiSuggestions.push({ text: product, type: 'product' });
        }
      });

      // AI-powered suggestions
      if (searchQuery.toLowerCase().includes('comfortable')) {
        aiSuggestions.push({ text: 'Most comfortable running shoes', type: 'ai' });
      }
      if (searchQuery.toLowerCase().includes('best')) {
        aiSuggestions.push({ text: 'Best selling athletic wear', type: 'ai' });
      }
      if (searchQuery.toLowerCase().includes('cheap') || searchQuery.toLowerCase().includes('budget')) {
        aiSuggestions.push({ text: 'Budget-friendly options under 1000 L.E', type: 'ai' });
      }
    }

    // Add trending searches
    const trending = ['Air Jordan 4', 'Barcelona jersey', 'Yeezy 350'];
    trending.forEach(trend => {
      aiSuggestions.push({ text: trend, type: 'trend' });
    });

    return aiSuggestions.slice(0, 6);
  };

  useEffect(() => {
    if (query.length > 0) {
      const newSuggestions = generateAISuggestions(query);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      // Save to search history
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const updatedHistory = [finalQuery, ...searchHistory.filter(h => h !== finalQuery)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles className="h-3 w-3" />;
      case 'trend': return <TrendingUp className="h-3 w-3" />;
      default: return <Search className="h-3 w-3" />;
    }
  };

  const getSuggestionBadge = (type: string) => {
    switch (type) {
      case 'ai': return <Badge variant="secondary" className="text-xs">AI</Badge>;
      case 'trend': return <Badge variant="outline" className="text-xs">Trending</Badge>;
      default: return null;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${compact ? 'w-full max-w-md' : 'w-full max-w-2xl'}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          {isAIMode && <Sparkles className="text-primary h-3 w-3" />}
        </div>
        
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className={`${compact ? 'h-10' : 'h-12'} pl-${isAIMode ? '12' : '10'} pr-20 text-base`}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Button
            type="button"
            variant={isAIMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsAIMode(!isAIMode)}
            className="h-8 px-2"
          >
            <Sparkles className="h-3 w-3" />
            {!compact && <span className="ml-1 text-xs">AI</span>}
          </Button>
          
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setShowSuggestions(false);
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex items-center justify-between group"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    {getSuggestionIcon(suggestion.type)}
                    <span className="text-sm">{suggestion.text}</span>
                  </div>
                  {getSuggestionBadge(suggestion.type)}
                </button>
              ))}
            </div>
            
            {isAIMode && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI-powered suggestions enabled
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISearchBar;
