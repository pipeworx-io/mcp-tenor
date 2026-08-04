# @pipeworx/tenor

[Tenor v2](https://developers.google.com/tenor/guides/quickstart) MCP — animated GIFs, stickers, search. Free Google Cloud key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_TENOR_KEY`. BYO: `?_apiKey=…`.

## Tools

- `search(q, locale?, contentfilter?, media_filter?, ar_range?, random?, limit?, pos?, client_key?)` — GIF/sticker search
- `featured(locale?, contentfilter?, media_filter?, ar_range?, limit?, pos?)` — featured GIFs
- `categories(locale?, type?, contentfilter?)` — categories
- `search_suggestions(q, locale?, limit?, client_key?)` — autocomplete
- `autocomplete(q, locale?, limit?, client_key?)` — search autocomplete
- `trending_terms(locale?, limit?)` — trending search terms
- `posts(ids, media_filter?, client_key?)` — specific posts by id

## Data source

`https://tenor.googleapis.com/v2`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "tenor": {
      "url": "https://gateway.pipeworx.io/tenor/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Tenor data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
