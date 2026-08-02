# Core360 Enterprise Monitoring & Observability Stack

This directory contains the Kubernetes deployment manifests, Grafana dashboard definitions, and Prometheus scrape configurations for Core360 ERP.

---

## Directory Layout

```
monitoring/
├── README.md                           # Observability Guide & Architecture
├── prometheus/                         # Prometheus ConfigMaps, Scrape Jobs & Deployments
│   ├── prometheus-config.yaml          # Prometheus Server Configuration & Scrape Rules
│   └── prometheus-deployment.yaml      # Kubernetes Deployment, Service & ServiceAccount
└── grafana/                            # Grafana Datasources, Dashboards & Deployments
    ├── grafana-datasource.yaml         # Automated Prometheus & CloudWatch DataSources
    ├── grafana-deployment.yaml         # Kubernetes Deployment & ClusterIP Service
    └── dashboards/                     # Production JSON Dashboard Definitions
        └── core360-overview.json       # Executive & Application Metrics Dashboard
```

---

## Deploying to Amazon EKS

```bash
# 1. Create monitoring namespace
kubectl create namespace monitoring

# 2. Apply Prometheus Config & Deployment
kubectl apply -f monitoring/prometheus/ -n monitoring

# 3. Apply Grafana Datasources & Deployment
kubectl apply -f monitoring/grafana/ -n monitoring

# 4. Verify Pod Health
kubectl get pods -n monitoring
```
