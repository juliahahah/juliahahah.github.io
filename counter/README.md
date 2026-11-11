# Visitor counter

A tiny Cloudflare Worker that counts visits in a D1 (SQLite) table on **your own**
Cloudflare account. Nothing expires: the number stays as long as the account exists.
Free plan limits are far above what a portfolio needs.

## One-time setup (about 5 minutes)

You need a free Cloudflare account — sign up yourself at https://dash.cloudflare.com/sign-up.
Then, from this `counter/` folder:

```bash
npx wrangler login
```

```bash
npx wrangler d1 create juliahahah-counter
```

Copy the `database_id` it prints into `wrangler.toml`, then:

```bash
npx wrangler d1 execute juliahahah-counter --remote --file=schema.sql
```

```bash
npx wrangler deploy
```

The last command prints a URL like `https://juliahahah-counter.<you>.workers.dev`.
Paste it into `COUNTER_URL` in `src/config.js` at the repo root and push.

## Check it

```bash
curl https://juliahahah-counter.<you>.workers.dev/health
```

`/hit` only answers requests coming from `https://juliahahah.github.io`; anything else
gets 403 and is logged (`npx wrangler tail` shows the logs live).

## Start from a number other than 0

```bash
npx wrangler d1 execute juliahahah-counter --remote --command "INSERT INTO counters (name, value) VALUES ('visits', 1234) ON CONFLICT(name) DO UPDATE SET value = 1234"
```
