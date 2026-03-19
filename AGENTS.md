# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## What This Project Does

FocusLock is a zero-cost, serverless Telegram bot that delivers one AI-generated project idea per day. It runs entirely on GitHub Actions (no persistent server), uses Ollama to run `phi3:mini` locally on the GitHub-hosted runner, and writes its memory back to the repo as a committed JSON file.

## Commands

### Local Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Ollama (Linux/macOS only — not available natively on Windows)
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama server (background) and pull the model
ollama serve &
ollama pull phi3:mini

# Create local env file
echo "TELEGRAM_TOKEN=your_token_here" > .env
echo "CHAT_ID=your_chat_id_here" >> .env
```

### Running the Bot

```bash
# Run the full pipeline (generate idea → send to Telegram → update history)
python focuslock.py
```

There is no test suite and no linter configured in this project.

### Triggering via GitHub Actions

The workflow runs automatically daily at **07:00 UTC (10:00 AM EAT)**. To trigger it manually:
- Go to **Actions** tab → **FocusLock Daily Spark** → **Run workflow**

## Architecture

### Execution Model

The entire system is a single Python script (`focuslock.py`) orchestrated by a GitHub Actions cron workflow (`.github/workflows/focuslock.yml`). On each run:

1. GitHub spins up a fresh `ubuntu-latest` VM
2. Ollama is installed and `phi3:mini` (2.3 GB) is pulled fresh every run — there is no model caching between runs
3. `focuslock.py` runs, which:
   - Loads `data/history.json` (the persistent memory store, committed to git)
   - Picks a random entry from the hardcoded `PROBLEM_DOMAINS` list (15 domains defined in-file)
   - Calls `ollama.generate()` with a structured prompt that injects the last 8 history entries as context
   - POSTs the formatted idea to Telegram via Bot API
   - Appends a timestamped log line to `history.json`
4. The workflow commits the updated `history.json` back to the repo with `[skip ci]` to avoid loops

### Key Design Decisions

- **`data/history.json` is both state and audit log.** It starts with 4 hardcoded "persona" strings and grows unboundedly with timestamped delivery records. Only the last 8 entries are fed to the LLM as context (`get_context()`). The file is git-tracked so history survives across workflow runs without any external database.
- **`PROBLEM_DOMAINS` is hardcoded in `focuslock.py`**, not external config. There are 15 problem domains; one is selected randomly per run via `random.choice()`. To add or remove domains, edit the list directly in the script.
- **The AI model is configurable** via the `MODEL` constant at the top of `focuslock.py`. Default is `phi3:mini`. Alternatives like `llama3.2`, `gemma2:2b`, or `mistral` can be swapped in — just update the `ollama pull` step in the workflow to match.
- **No retry logic for Telegram** — the `send_telegram()` function has a 15-second timeout and prints status, but does not retry. The workflow step itself has no retry configuration.

### Secrets

Two secrets are required and must be set in **GitHub repo Settings → Secrets and variables → Actions**:
- `TELEGRAM_TOKEN` — the Telegram Bot API token from @BotFather
- `CHAT_ID` — the Telegram chat/user ID to deliver messages to

Locally, these are loaded from a `.env` file via `python-dotenv`.

### Changing the Schedule

Edit the cron expression in `.github/workflows/focuslock.yml`:

```yaml
schedule:
  - cron: '0 7 * * *'  # Currently: daily at 07:00 UTC (10 AM EAT)
```

Note: the README describes a historical 3-hour schedule; the actual workflow runs once daily.

### Commiting and Pushing
- ** After every major change and saving, you should commit,,, note that each file change has its own separate commit message and make the message short and summarized
