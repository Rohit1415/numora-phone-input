# Contributing to Numora

Thank you for your interest in contributing to Numora! As an open-source library, we welcome contributions from the community to help make this project more robust, performant, and accessible.

To maintain high code quality and consistency, please review and follow these guidelines when contributing.

---

## Code of Conduct

By participating in this project, you agree to maintain a professional, welcoming, and inclusive environment. Please treat all contributors with respect.

---

## Development Setup

### 1. Requirements
Ensure you have the following tools installed locally:
- Node.js (v18+)
- Bun (preferred package manager)

### 2. Getting Started
Clone the repository and install the development dependencies:
```bash
git clone https://github.com/rohit-ywppl/numora.git
cd numora
bun install
```

### 3. Available Scripts
Use the following commands during development:
- **Build**: Compiles ESM/CJS bundles.
  ```bash
  bun run build
  ```
- **Lint**: Run ESLint to check for stylistic and syntax errors.
  ```bash
  bun run lint
  ```
- **Test**: Execute the Vitest unit test suite.
  ```bash
  bun run test
  ```
- **Storybook**: Start a local preview server for components.
  ```bash
  bun run storybook
  ```

---

## Contribution Rules & Code Style

To ensure a clean codebase, we enforce the following rules:

1. **No Inline Comments**: Write clean, self-documenting code. Avoid adding block or inline comments unless required by third-party configuration files.
2. **Strict TypeScript**: Avoid `any` types. Provide full, explicit type definitions for all new functions, props, and hooks.
3. **Accessibility (WCAG 2.2 AA)**: Any changes to components must support keyboard navigation and include necessary ARIA properties (`aria-expanded`, `aria-controls`, `role="listbox"`, etc.).
4. **Hydration Safety**: Ensure all dynamic unique IDs use React's `useId()` hook to maintain hydration compatibility in Next.js Server Components.
5. **No Speculative Code**: Keep changes focused exactly on the problem or feature requested. Do not add unused utility code or speculative features.

---

## Commit Message Conventions

We follow the **Conventional Commits** specification. Commit messages must be structured as follows:

```
<type>(<scope>): <description>
```

### Allowed Types:
- `feat`: A new user-facing feature.
- `fix`: A bug fix.
- `docs`: Documentation changes only.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Updates to build processes, tools, or dependencies.

### Examples:
- `feat(ui): add optional flag URL overrides`
- `fix(a11y): correct keyboard focus trap in dropdown list`
- `docs(readme): add troubleshooting steps for Next.js app router`

---

## Pull Request Process

1. **Create a Branch**: Create a descriptive branch from `main` (e.g. `feat/dropdown-search` or `fix/esc-key`).
2. **Verify Locally**: Before pushing your branch, ensure all tests and linters pass:
   ```bash
   bun run lint
   bun run test
   bun run build
   ```
3. **Open a Pull Request**: Submit a PR to the `main` branch. Provide a clear description of the problem solved or the feature added.
4. **CI Checks**: The GitHub Actions workflow will validate your PR. All checks (Build, Lint, Type Check, Tests) must pass before a review is requested.
