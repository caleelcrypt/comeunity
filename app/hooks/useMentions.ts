import { useState, useRef, useCallback } from 'react';

interface User {
  username: string;
  displayName: string;
  avatar: string;
}

export const useMentions = (userEngagement: Record<string, number>) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [mentionStartPos, setMentionStartPos] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getTopEngagedUsers = useCallback((): User[] => {
    return Object.entries(userEngagement)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => ({
        username: name.toLowerCase().replace(/\s/g, ''),
        displayName: name,
        avatar: name.split(' ').map(n => n[0]).join('')
      }));
  }, [userEngagement]);

  const searchUsers = useCallback((query: string): User[] => {
    const lowerQuery = query.toLowerCase();
    return Object.keys(userEngagement)
      .filter(name => name.toLowerCase().includes(lowerQuery))
      .map(name => ({
        username: name.toLowerCase().replace(/\s/g, ''),
        displayName: name,
        avatar: name.split(' ').map(n => n[0]).join('')
      }));
  }, [userEngagement]);

  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  const insertMention = useCallback((username: string) => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const before = text.substring(0, mentionStartPos);
    const after = text.substring(mentionStartPos + currentQuery.length + 1);
    textareaRef.current.value = before + `@${username} ` + after;
    hideSuggestions();
    textareaRef.current.focus();
    
    const event = new Event('input', { bubbles: true });
    textareaRef.current.dispatchEvent(event);
  }, [currentQuery, mentionStartPos, hideSuggestions]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const cursorPos = textarea.selectionStart;
    const text = textarea.value;
    
    let atPos = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === '@') {
        atPos = i;
        break;
      }
      if (text[i] === ' ' || text[i] === '\n') break;
    }
    
    if (atPos !== -1) {
      const query = text.substring(atPos + 1, cursorPos);
      const filtered = query.length === 0 ? getTopEngagedUsers() : searchUsers(query);
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
      setCurrentQuery(query);
      setMentionStartPos(atPos);
      setSelectedIndex(-1);
      return;
    }
    
    hideSuggestions();
  }, [getTopEngagedUsers, searchUsers, hideSuggestions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        insertMention(suggestions[selectedIndex].username);
      }
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  }, [showSuggestions, suggestions, selectedIndex, insertMention, hideSuggestions]);

  return {
    textareaRef,
    showSuggestions,
    suggestions,
    selectedIndex,
    handleInput,
    handleKeyDown,
    insertMention
  };
};