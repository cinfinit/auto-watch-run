# **auto-watch-run** 👀🏃‍♂️

> “Why press buttons when you can let your computer do it for you?”

**auto-watch-run** is a small but mighty CLI that watches your files and automatically runs commands whenever they change. Think of it as your **dev autopilot** — linting, typechecking, testing, generating code, updating docs… all without touching a key (except to save files, obviously).  Supports **per-pattern commands**, **parallel or sequential execution**, and **dry-run mode**.

---

## **Why would you even need this?**

* Edit a TypeScript file → **lint + typecheck** automatically
* Update tests → **re-run only the changed tests**
* Change your Prisma schema → **regenerate your client**
* Update docs → **rebuild automatically**
* Basically, any repetitive task you hate doing manually

In short: **stop babysitting your build process**.

---

## **Installation**

### Local dev dependency

```bash
npm install -D auto-watch-run
```

### Or just run it directly

```bash
npx auto-watch-run
```

---

## **Configuration (package.json)**

Keep it **simple and JSON-friendly** inside your `package.json` , that's how you can configure the options , here's an example:

```json
{
  "auto-watch-run": {
    "options": {
      "parallel": false,
      "debounce": 300,
      "dry": false
    },
    "patterns": {
      "src/**/*.ts": {
        "commands": ["npm run lint", "npm run typecheck"],
        "parallel": true
      },
      "tests/**/*.test.ts": {
        "commands": ["npm run test:changed"],
        "parallel": false
      },
      "prisma/schema.prisma": {
        "commands": ["npm run prisma:generate"]
      }
    }
  }
}
```

### Setup (package.json)

This is the recommended way to run auto-watch-run:

```json
{
  "scripts": {
    "watch": "auto-watch-run"
  }
}
```

Now you can simply run:

```bash
npm run watch
```

### **Explanation**

* **Global options** (`options`):

  * `parallel` → run commands simultaneously by default
  * `debounce` → milliseconds to wait before executing commands after changes
  * `dry` → show what would run without actually executing

* **Per-pattern overrides** (`patterns`):

  * `commands` → array of commands to run when a file matching the pattern changes
  * `parallel` → optional, overrides global parallel for this pattern

---

## **CLI Flags**

Sometimes you want to **temporarily override global options** without touching `package.json`. Flags to the rescue:

| Flag              | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `--dry`           | Enable dry-run mode (show commands without running)              |
| `--parallel`      | Force all commands to run in parallel (overrides global default) |
| `--debounce <ms>` | Override debounce time in milliseconds                           |

### **Examples**

```bash
# Dry run to see what would happen
npx auto-watch-run --dry

# Force parallel execution for all commands
npx auto-watch-run --parallel

# Set debounce to 500ms
npx auto-watch-run --debounce 500
```

> ⚡ Flags are temporary and **do not modify your package.json**. Perfect for testing or one-off runs.

---

## **Usage**

```bash
npm run watch
# or
npx run auto-watch-run
```

Once running, it will watch all your configured patterns and execute commands automatically.
You can see the work around while your dev workflow runs itself.

---

## **Examples & Use Cases**

### Node/TypeScript Project

```json
"patterns": {
  "src/**/*.ts": { "commands": ["npm run lint", "npm run typecheck"], "parallel": true },
  "tests/**/*.test.ts": { "commands": ["npm run test:changed"], "parallel": false }
}
```

* Edit a TS file → lint + typecheck **in parallel**
* Edit a test → run tests **sequentially**

---

### Docs & Codegen

```json
"patterns": {
  "graphql/**/*.graphql": { "commands": ["npm run codegen"] },
  "docs/**/*.md": { "commands": ["npm run build:docs"], "parallel": true }
}
```

* Update GraphQL schemas → regenerate code automatically
* Update docs → rebuild automatically in parallel with other tasks

---

## **Debounce Magic**

If you save multiple files rapidly, `debounce` prevents command spam:

```json
"options": { "debounce": 500 }
```

* Commands only run after 500ms of inactivity.
* No more flood of repeated builds.

---

## **Why you’ll love it**

* Per-pattern **parallel or sequential execution**
* Global defaults with **CLI flag overrides**
* Debounce prevents **spammy runs**
* Dry-run mode to test your setup safely
* Works on **Windows, macOS, Linux**
* **Zero babysitting required** — let it run while you focus on the important stuff (thinking about life , universe and everything)

---

## **Pro Tips**

* Combine with **pre-commit hooks** for a smoother workflow
* Works great in **monorepos**
* Add it as a **dev dependency** and include `npm run watch` for your team

---

## **Author**

Built by [cinfinit](https://github.com/cinfinit) because
- typing npm run repeatedly felt like how many times the sameee....
- after too many "wait.. did i run the command ?" moments.
- written somewhere between "just one more save" and "why didnt that run"

 i guess if it saves you even one npm run , its' already done its job.

 Thanks 

---




