import React, { useState, useEffect } from 'react';
import { Post } from '../../types';
import { CATEGORY_ICONS } from '../../utils/constants';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  showToast: (message: string, type?: string) => void;
}

type SearchTab = 'all' | 'creators' | 'posts' | 'unities';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
}

interface Unity {
  id: string;
  name: string;
  icon: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  showToast
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveTab('all');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const newResults: any[] = [];

    // Get unique creators from posts
    const creatorMap = new Map<string, Creator>();
    posts.forEach(post => {
      if (!creatorMap.has(post.author_id)) {
        creatorMap.set(post.author_id, {
          id: post.author_id,
          name: post.author_name,
          avatar: post.author_avatar,
          category: post.category
        });
      }
    });
    const creators = Array.from(creatorMap.values());

    // Get unique unities from categories
    const unitiesMap = new Map<string, Unity>();
    posts.forEach(post => {
      if (!unitiesMap.has(post.category)) {
        unitiesMap.set(post.category, {
          id: post.category,
          name: post.category,
          icon: CATEGORY_ICONS[post.category] || CATEGORY_ICONS['Art']
        });
      }
    });
    const unities = Array.from(unitiesMap.values());

    if (activeTab === 'all' || activeTab === 'creators') {
      const matchedCreators = creators.filter(c => 
        c.name.toLowerCase().includes(lowerQuery)
      );
      newResults.push(...matchedCreators.map(c => ({ type: 'creator', ...c })));
    }

    if (activeTab === 'all' || activeTab === 'posts') {
      const matchedPosts = posts.filter(p => 
        p.content.toLowerCase().includes(lowerQuery) ||
        p.author_name.toLowerCase().includes(lowerQuery)
      );
      newResults.push(...matchedPosts.map(p => ({ type: 'post', ...p })));
    }

    if (activeTab === 'all' || activeTab === 'unities') {
      const matchedUnities = unities.filter(u => 
        u.name.toLowerCase().includes(lowerQuery)
      );
      newResults.push(...matchedUnities.map(u => ({ type: 'unity', ...u })));
    }

    setResults(newResults);
  }, [query, activeTab, posts]);

  const handleResultClick = (result: any) => {
    onClose();
    if (result.type === 'creator') {
      showToast(`👤 Viewing ${result.name}'s profile`);
    } else if (result.type === 'post') {
      showToast(`📝 Viewing post by ${result.author_name}`);
    } else if (result.type === 'unity') {
      showToast(`👥 Viewing ${result.name} Unity`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-modal-content">
        <div className="modal-header">
          <h3>Search</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <input
          type="text"
          className="search-modal-input"
          placeholder="Search creators, posts, or Unities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        
        <div className="search-modal-tabs">
          <div 
            className={`search-modal-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </div>
          <div 
            className={`search-modal-tab ${activeTab === 'creators' ? 'active' : ''}`}
            onClick={() => setActiveTab('creators')}
          >
            Creators
          </div>
          <div 
            className={`search-modal-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </div>
          <div 
            className={`search-modal-tab ${activeTab === 'unities' ? 'active' : ''}`}
            onClick={() => setActiveTab('unities')}
          >
            Unities
          </div>
        </div>
        
        <div className="search-modal-results">
          {results.length === 0 && query.trim() && (
            <div className="search-empty">
              <i className="fas fa-search"></i><br />
              No results found
            </div>
          )}
          
          {results.length === 0 && !query.trim() && (
            <div className="search-empty">
              <i className="fas fa-search"></i><br />
              Search for creators, posts, or Unities
            </div>
          )}
          
          {results.map((result, idx) => {
            if (result.type === 'creator') {
              return (
                <div key={idx} className="search-result-card" onClick={() => handleResultClick(result)}>
                  <div className="search-result-avatar">
                    {result.avatar ? (
                      <img src={result.avatar} alt={result.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      result.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="search-result-details">
                    <div className="search-result-name">{result.name}</div>
                    <div className="search-result-meta">Creator</div>
                    <div className="search-result-category">
                      <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[result.category] || CATEGORY_ICONS['Art'] }} />
                      {' '}{result.category}
                    </div>
                  </div>
                </div>
              );
            } else if (result.type === 'post') {
              return (
                <div key={idx} className="search-result-card" onClick={() => handleResultClick(result)}>
                  <div className="search-result-avatar">
                    {result.author_avatar ? (
                      <img src={result.author_avatar} alt={result.author_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      result.author_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="search-result-details">
                    <div className="search-result-name">{result.author_name}</div>
                    <div className="search-result-meta">
                      {result.content.substring(0, 60)}{result.content.length > 60 ? '...' : ''}
                    </div>
                    <div className="search-result-category">
                      <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[result.category] || CATEGORY_ICONS['Art'] }} />
                      {' '}{result.category}
                    </div>
                  </div>
                </div>
              );
            } else if (result.type === 'unity') {
              return (
                <div key={idx} className="search-result-card" onClick={() => handleResultClick(result)}>
                  <div className="search-result-avatar">
                    <span dangerouslySetInnerHTML={{ __html: result.icon }} />
                  </div>
                  <div className="search-result-details">
                    <div className="search-result-name">{result.name}</div>
                    <div className="search-result-meta">Unity Community</div>
                    <div className="search-result-category">
                      <span dangerouslySetInnerHTML={{ __html: result.icon }} />
                      {' '}{result.name}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      
      <style>{`
        .search-modal-content {
          width: 90%;
          max-width: 340px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: 32px;
          padding: 20px;
        }
        .search-modal-input {
          width: 100%;
          padding: 14px;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 24px;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          margin-bottom: 16px;
        }
        .search-modal-input:focus {
          border-color: var(--gradient-2);
        }
        .search-modal-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 8px;
        }
        .search-modal-tab {
          flex: 1;
          text-align: center;
          padding: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-tertiary);
          cursor: pointer;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .search-modal-tab.active {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          color: white;
        }
        .search-modal-results {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .search-result-card {
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 20px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .search-result-card:hover {
          background: var(--surface-glass-hover);
          transform: translateX(4px);
          border-color: var(--gradient-2);
        }
        .search-result-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          flex-shrink: 0;
          overflow: hidden;
        }
        .search-result-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .search-result-details {
          flex: 1;
        }
        .search-result-name {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .search-result-meta {
          font-size: 11px;
          color: var(--text-tertiary);
          margin-bottom: 2px;
        }
        .search-result-category {
          font-size: 10px;
          color: var(--gradient-2);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(181, 23, 158, 0.15);
          padding: 2px 8px;
          border-radius: 100px;
          width: fit-content;
        }
        .search-empty {
          text-align: center;
          padding: 40px;
          color: var(--text-tertiary);
          font-size: 13px;
        }
        .search-empty i {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
      `}</style>
    </div>
  );
};