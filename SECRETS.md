# Core360 Enterprise CI/CD — Required GitHub Secrets Documentation

To enable complete automated Docker Hub image publishing, Kubernetes zero-downtime deployment, and automated health checks, configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

---

## 1. Container Registry & Docker Hub Secrets

| Secret Name | Description | Example / Format | Required |
| :--- | :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Your Docker Hub account username. | `adminuser` | **Yes** |
| `DOCKERHUB_TOKEN` | Docker Hub Access Token (Personal Access Token with Read/Write access). | `dch_pat_xxx...` | **Yes** |
| `REGISTRY` | Container registry host URL (defaults to `docker.io`). | `docker.io` or `ghcr.io` | Optional |
| `IMAGE_PREFIX` | Organization or account image namespace prefix (defaults to `DOCKERHUB_USERNAME`). | `mycompany` | Optional |

---

## 2. Kubernetes Cluster Deployment Secrets

| Secret Name | Description | Example / Format | Required |
| :--- | :--- | :--- | :--- |
| `KUBE_CONFIG` | Complete Base64-encoded or raw YAML `kubeconfig` file content for connecting to your target Kubernetes cluster. | `apiVersion: v1...` | **Yes** |
| `KUBE_NAMESPACE` | Kubernetes target namespace for Core360 deployments (defaults to `super-erp`). | `super-erp` | Optional |
| `ENVIRONMENT_URL` | Production environment URL for GitHub Environment badge and health check reporting (Configure under **Variables**, not Secrets). | `http://core360.example.com` | Optional |

---

> [!IMPORTANT]
> Never commit raw secret values into source code or repository manifests. Always store them securely under GitHub Secrets.
