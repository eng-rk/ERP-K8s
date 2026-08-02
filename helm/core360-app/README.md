# Core360 ERP Helm Chart (`core360-app`)

Official Helm chart packaging for the **Core360 Enterprise ERP** microservices, static assets, database persistent storage, and NGINX ingress routing.

---

## 1. Quick Start Installation

```bash
# Dry-run template compilation
helm template core360 ./helm/core360-app/

# Install/upgrade Helm release into 'super-erp' namespace
helm upgrade --install core360 ./helm/core360-app/ \
  --namespace super-erp \
  --create-namespace \
  --set backend.image.tag=sha-1a2b3c \
  --set frontend.image.tag=sha-1a2b3c
```

---

## 2. Configurable Values Parameters

| Key | Description | Default |
| :--- | :--- | :--- |
| `global.environment` | Deployment environment name | `prod` |
| `global.namespace` | Target Kubernetes namespace | `super-erp` |
| `backend.replicaCount` | Pod scale for Node.js backend | `2` |
| `backend.image.repository` | ECR repository for backend | `<account>.dkr.ecr.<region>.amazonaws.com/core360-backend` |
| `frontend.replicaCount` | Pod scale for React/Vite frontend | `2` |
| `frontend.image.repository` | ECR repository for frontend | `<account>.dkr.ecr.<region>.amazonaws.com/core360-frontend` |
| `mongodb.storage.size` | Storage capacity for PersistentVolumeClaim | `10Gi` |
