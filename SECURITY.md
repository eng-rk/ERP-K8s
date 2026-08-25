# Security Policy

## Reporting a vulnerability

Please do not publish credentials, API keys, tokens, passwords, or other sensitive information in issues or pull requests.

For a suspected security issue, contact the repository owner privately through GitHub rather than opening a public issue.

## Secrets policy

Production credentials must never be committed to this repository. Use environment variables, GitHub Actions Secrets, and Kubernetes Secrets created from local or CI-protected values.

The repository may contain example configuration files, but they must use placeholders only.
