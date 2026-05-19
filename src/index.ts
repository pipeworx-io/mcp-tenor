interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Tenor v2 MCP.
 */


const BASE = 'https://tenor.googleapis.com/v2';
const UA = 'pipeworx-mcp-tenor/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'GIF/sticker search.',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string' },
        locale: { type: 'string' },
        contentfilter: { type: 'string', description: 'off|low|medium|high' },
        media_filter: { type: 'string' },
        ar_range: { type: 'string' },
        random: { type: 'boolean' },
        limit: { type: 'number' },
        pos: { type: 'string' },
        client_key: { type: 'string' },
      },
      required: ['q'],
    },
  },
  {
    name: 'featured',
    description: 'Featured GIFs.',
    inputSchema: {
      type: 'object',
      properties: {
        locale: { type: 'string' },
        contentfilter: { type: 'string' },
        media_filter: { type: 'string' },
        ar_range: { type: 'string' },
        limit: { type: 'number' },
        pos: { type: 'string' },
      },
    },
  },
  { name: 'categories', description: 'Categories.', inputSchema: { type: 'object', properties: { locale: { type: 'string' }, type: { type: 'string' }, contentfilter: { type: 'string' } } } },
  {
    name: 'search_suggestions',
    description: 'Suggestions.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' }, locale: { type: 'string' }, limit: { type: 'number' }, client_key: { type: 'string' } }, required: ['q'] },
  },
  {
    name: 'autocomplete',
    description: 'Autocomplete.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' }, locale: { type: 'string' }, limit: { type: 'number' }, client_key: { type: 'string' } }, required: ['q'] },
  },
  { name: 'trending_terms', description: 'Trending search terms.', inputSchema: { type: 'object', properties: { locale: { type: 'string' }, limit: { type: 'number' } } } },
  {
    name: 'posts',
    description: 'Posts by id (comma-sep).',
    inputSchema: { type: 'object', properties: { ids: { type: 'string' }, media_filter: { type: 'string' }, client_key: { type: 'string' } }, required: ['ids'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Tenor requires an API key. Set PLATFORM_TENOR_KEY or pass ?_apiKey=… (free at https://developers.google.com/tenor/guides/quickstart).');
  const get = async (path: string, extra: Record<string, unknown> = {}) => {
    const p = new URLSearchParams({ key: apiKey });
    for (const [k, v] of Object.entries(extra)) {
      if (v == null) continue;
      p.set(k, String(v));
    }
    const res = await fetch(`${BASE}${path}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('Tenor: invalid API key.');
    if (!res.ok) throw new Error(`Tenor: ${res.status}`);
    return res.json();
  };
  const pick = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, args[k]]));
  switch (name) {
    case 'search':
      return get('/search', { ...pick(['q', 'locale', 'contentfilter', 'media_filter', 'ar_range', 'random', 'limit', 'pos', 'client_key']) });
    case 'featured':
      return get('/featured', pick(['locale', 'contentfilter', 'media_filter', 'ar_range', 'limit', 'pos']));
    case 'categories':
      return get('/categories', pick(['locale', 'type', 'contentfilter']));
    case 'search_suggestions':
      return get('/search_suggestions', pick(['q', 'locale', 'limit', 'client_key']));
    case 'autocomplete':
      return get('/autocomplete', pick(['q', 'locale', 'limit', 'client_key']));
    case 'trending_terms':
      return get('/trending_terms', pick(['locale', 'limit']));
    case 'posts':
      return get('/posts', pick(['ids', 'media_filter', 'client_key']));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
