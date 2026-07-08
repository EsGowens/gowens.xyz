import type { PageServerLoad } from './$types';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  readTime: string;
  content: string;
  timestamp: number;
}

interface MediaItem {
  title: string;
  score: string;
  desc: string;
  date: string;
  status?: string;
  timestamp: number;
}

interface IngestedLog {
  status: string;
  items: { title: string; score: string; desc: string }[];
  iconName: string;
}

function parseFrontmatter(raw: string): { metadata: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content: raw };
  }
  
  const [, frontmatter, content] = match;
  const metadata: Record<string, string> = {};
  
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const val = line.slice(colonIndex + 1).trim();
      // Strip any surrounding single or double quotes
      metadata[key] = val.replace(/^['"]|['"]$/g, '');
    }
  });
  
  return { metadata, content: content.trim() };
}

export const load: PageServerLoad = async () => {
  // 1. Load blog posts using import.meta.glob
  const blogModules = import.meta.glob('./content/blog/*.md', { query: '?raw', eager: true });
  const blogPosts: BlogPost[] = [];
  
  for (const path in blogModules) {
    const rawText = (blogModules[path] as { default: string }).default;
    const { metadata, content } = parseFrontmatter(rawText);
    
    const id = Number(metadata.id) || 1;
    const title = metadata.title || 'Untitled Post';
    const date = metadata.date || 'Unknown Date';
    const readTime = metadata.readTime || '3 min read';
    const timestamp = Date.parse(date) || 0;
    
    blogPosts.push({
      id,
      title,
      date,
      readTime,
      content,
      timestamp
    });
  }
  
  // Sort blog posts so newest (highest timestamp or highest id) appear first
  blogPosts.sort((a, b) => b.timestamp - a.timestamp);
  
  // 2. Load modular input markdown logs from subdirectories
  const inputModules = import.meta.glob('./content/input/**/*.md', { query: '?raw', eager: true });
  
  const groupedItems: Record<string, MediaItem[]> = {
    books: [],
    games: [],
    meals: [],
    movies: [],
    music: [],
    tv: []
  };
  
  for (const path in inputModules) {
    // Path segment format: ./content/input/{category}/{filename}.md
    const parts = path.split('/');
    const category = parts[parts.length - 2];
    
    if (category && category in groupedItems) {
      const rawText = (inputModules[path] as { default: string }).default;
      const { metadata, content } = parseFrontmatter(rawText);
      
      const title = metadata.title || 'Untitled';
      const score = metadata.score || 'N/A';
      const date = metadata.date || 'Unknown Date';
      const timestamp = Date.parse(date) || 0;
      const desc = content || '';
      const status = metadata.status;
      
      groupedItems[category].push({
        title,
        score,
        desc,
        date,
        status,
        timestamp
      });
    }
  }
  
  const inputData: Record<string, IngestedLog> = {};
  
  // Process each category
  for (const category in groupedItems) {
    const items = groupedItems[category];
    
    // Sort chronologically descending (newest first)
    items.sort((a, b) => b.timestamp - a.timestamp);
    
    // Default fallback status
    let status = 'STREAMING // FEED_ACTIVE';
    
    // Extract status from the newest item in this category (first after sorting)
    if (items.length > 0) {
      const newestWithStatus = items.find(item => item.status);
      if (newestWithStatus && newestWithStatus.status) {
        status = newestWithStatus.status;
      } else if (items[0].status) {
        status = items[0].status;
      }
    }
    
    // Apply .slice(0, 5) boundary clamp per category
    const clampedItems = items.slice(0, 5).map(item => ({
      title: item.title,
      score: item.score,
      desc: item.desc
    }));
    
    inputData[category] = {
      status,
      items: clampedItems,
      iconName: category
    };
  }
  
  return {
    blogPosts,
    inputData
  };
};
