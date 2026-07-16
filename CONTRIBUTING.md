# Contributing to CodeAlpha NIDS

Thank you for your interest in contributing to the CodeAlpha Network Intrusion Detection System! This project is maintained by **Muhammad Haris (@Harisx404)**. We welcome pull requests, bug reports, and feature suggestions from the open-source community.

To ensure the repository maintains its high standard of engineering, please adhere to the following guidelines.

---

## 1. Local Development Setup

1. Fork the repository and clone your fork locally.
2. Run the automated setup script to scaffold your virtual environments and Docker containers:
   ```bash
   bash scripts/setup.sh
   ```
3. Ensure the development environment passes the health checks:
   ```bash
   bash scripts/health_check.sh
   ```

## 2. Coding Standards

This project utilizes a strict Domain-Driven Design (DDD) layered architecture. 

### Backend (Python)
- **Typing**: All functions, arguments, and returns MUST be strictly typed. We use `mypy` for static analysis.
- **Linting**: We enforce `ruff` for extremely fast, uncompromising linting. 
- **Architecture**: 
  - Never import `services/` into `repositories/`.
  - Never place database `Session` logic inside API routes. Use the Repository layer.
- **Testing**: All new services must have corresponding unit tests in `tests/backend/unit/`.

### Frontend (Next.js/React)
- **State Management**: Do not use React Context for rapidly mutating data (like the WebSockets feed). Use `Zustand`.
- **Styling**: Stick to TailwindCSS utility classes. Avoid writing custom CSS files unless strictly necessary.
- **Linting**: `eslint` must pass without warnings.

## 3. Submitting a Pull Request

1. Create a new branch from `main`. Use the conventional branch naming format: `feat/your-feature`, `fix/your-fix`, or `docs/your-doc`.
2. Make your commits granular and logical. Use [Conventional Commits](https://www.conventionalcommits.org/).
   - Example: `feat(api): add endpoint for historical alert pagination`
3. Run the test suite: `pytest`
4. Push to your fork and submit a Pull Request to the `main` branch.
5. In your PR description, thoroughly explain what you changed and link any related issues.

## 4. Security Vulnerabilities

If you discover a security flaw, **DO NOT** open a public issue. Please refer to `SECURITY.md` and email **itsharis.tech@gmail.com** directly.

## 5. Adding Suricata Rules

If you are contributing to the detection engine, please place new rules in `suricata/rules/custom.rules` and document the threat vector in `docs/RULE_GUIDE.md`. Ensure that your Rule ID (`sid`) increments properly from the existing rules (starting above `1000000`).
