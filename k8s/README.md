# Kubernetes secrets

`02-secrets.yaml` is intentionally not stored in the public repository.

For a local deployment:

1. Copy `02-secrets.example.yaml` to `02-secrets.yaml`.
2. Replace every placeholder with a locally generated secret.
3. Keep `02-secrets.yaml` untracked.
4. Apply the local secret before the remaining manifests.

Example:

```bash
cp k8s/02-secrets.example.yaml k8s/02-secrets.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/01-namespace.yaml
kubectl apply -f k8s/03-configmap.yaml
kubectl apply -f k8s/04-mongo.yaml
kubectl apply -f k8s/05-backend.yaml
kubectl apply -f k8s/06-frontend.yaml
kubectl apply -f k8s/07-ingress.yaml
```

For CI/CD or a real production environment, inject secrets through a protected secret manager or CI/CD secret store instead of committing them to Git.
