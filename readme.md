**Documentation**

**Routes**

- Search
- Scraper

Search endpoints:

| TYPE | PATH                                 | DESCRIPTION       |
| ---- | ------------------------------------ | ----------------- |
| GET  | /search?search=TEXT&page=PAGE_NUMBER | Get search result |

Scraper endpoints:

| TYPE | PATH     | BODY              | DESCRIPTION       |
| ---- | -------- | ----------------- | ----------------- |
| POST | /scraper | `{query: "test"}` | Get search result |
