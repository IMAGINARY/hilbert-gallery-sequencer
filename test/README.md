# Test requests

The test requests in `test-api.http` can be run with JetBrains HTTP client.

Create a file called `http-client.private.env.json` with the following format:

```
{
  "dev": {
    "API_KEY": "<A valid API key included in the sequencer's API_KEYS list>"
  }
}
```
