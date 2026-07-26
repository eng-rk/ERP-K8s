# 🚀 Super ERP - Enterprise Kubernetes & Microservices Architecture

> A production-grade, enterprise Enterprise Resource Planning (ERP) platform built with **React**, **Node.js**, **Express**, **MongoDB**, **Docker**, and **Kubernetes**.

---

## 📋 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Tech Stack](#-tech-stack)
- [Business Modules & Features](#-business-modules--features)
- [Repository Structure](#-repository-structure)
- [Environment Configuration](#-environment-configuration)
- [Local Development Setup](#-local-development-setup)
- [Docker & Containerization](#-docker--containerization)
- [Kubernetes Production Deployment](#-kubernetes-production-deployment)
- [Health Checks & Observability](#-health-checks--observability)
- [Security & Best Practices](#-security--best-practices)

---

## 🏗️ Overview & Architecture

**Super ERP** is an enterprise-scale application engineered for high availability, fault tolerance, and seamless cloud scalability. Originally structured as a monorepo, the platform has been optimized into decoupled micro-services ready for containerized deployment across multi-cloud environments.

```
                           ┌──────────────────────────┐
                           │      Ingress NGINX       │
                           └────────────┬─────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
       ┌─────────────────────────┐             ┌─────────────────────────┐
       │   Frontend Pods (x2)    │             │    Backend Pods (x2)    │
       │   React 19 + Nginx      │             │   Node.js + Express 5   │
       └─────────────────────────┘             └────────────┬────────────┘
                                                            │
                                                            ▼
                                               ┌─────────────────────────┐
                                               │      MongoDB Pod        │
                                               │  Stateful set with PVC  │
                                               └─────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 + Vite 8
* **Routing**: React Router v7
* **UI & Visualizations**: Recharts, Custom HSL Vanilla CSS Design System
* **Rich Text Editing**: Tiptap Editor Suite
* **Interactive Drag-and-Drop**: `@hello-pangea/dnd` (Sales Kanban)
* **Web Server**: Nginx (Stable-Alpine)

### **Backend**
* **Runtime**: Node.js 22 (Alpine)
* **API Framework**: Express 5
* **ORM / Database**: Mongoose 9 (MongoDB 6.0)
* **Security & Auth**: JWT (JSON Web Tokens), bcryptjs, RBAC (Role-Based Access Control)
* **Background Jobs**: Node-cron (Graceful shutdown enabled)
* **Email & Communications**: Nodemailer with dynamic MongoDB settings

### **DevOps & Cloud Native**
* **Containerization**: Docker & Multi-stage builds
* **Orchestration**: Docker Compose v2 & Kubernetes (K8s)
* **Routing**: Kubernetes Ingress NGINX Controller
* **Storage**: Kubernetes PersistentVolumeClaims (PVC)

---

## 📦 Business Modules & Features

1. **Sales & CRM**:
   * Lead Acquisition & Pipeline Tracking (`LeadsPage`, `LeadDetailsPage`).
   * Interactive Drag-and-Drop Sales Board (`SalesKanbanPage`).
   * Campaign Management & Automated Offer Expiration (`CampaignsPage`, `Offers`).

2. **Inventory & Supply Chain**:
   * Multi-Warehouse Operations (`WarehousesPage`, `InventoryItemsPage`).
   * Serial Number & Batch/Lot Tracking (`Serials`, `Lots`).
   * Physical Inventory & Cycle Counting (`CycleCountPage`, `PhysicalInventoryPage`).
   * Replenishment Reorder Point Alerts & Stock Adjustments.

3. **Human Resource Management (HRM) & ESS**:
   * Employee Profiles, Contracts & Organizational Hierarchy (`PersonalPage`).
   * Payroll Run Automation, Loans & Deductions (`PayrollPage`, `ESS`).
   * Leave Management & Attendance Schedules (`DetailedSchedule`).

4. **Helpdesk & Email Systems**:
   * Rich HTML Email Composer (`EmailComposer`).
   * Ticket Support Desk (`SupportTicketsPage`).

---

## 📂 Repository Structure

```text
ERP-K8s/
├── Super-ERP-backend/          # Express API Server Source Code
│   ├── src/                    # Controllers, Models, Routes, Services
│   ├── .dockerignore           # Optimized build exclusions
│   ├── Dockerfile              # Production Multi-Stage Node.js Dockerfile
│   └── package.json            # Node.js dependencies & scripts
├── Super-ERP-frontend/         # React SPA Source Code
│   ├── src/                    # Components, Pages, Context, Assets
│   ├── nginx.conf              # SPA Routing & Proxy configuration
│   ├── Dockerfile              # Production Nginx Dockerfile
│   └── package.json            # React dependencies & scripts
├── k8s/                        # Production Kubernetes Manifests
│   ├── 01-namespace.yaml       # K8s Isolated Namespace
│   ├── 02-secrets.yaml         # Base64 Production Secrets
│   ├── 03-configmap.yaml       # Environment Configuration
│   ├── 04-mongo.yaml           # MongoDB PVC, Deployment & Service
│   ├── 05-backend.yaml         # Backend Deployment (With Probes) & Service
│   ├── 06-frontend.yaml        # Frontend Deployment & Service
│   └── 07-ingress.yaml         # Nginx Ingress Routing Rules
├── docker-compose.yml          # Local multi-container development orchestration
└── README.md                   # Project Documentation
```

---

## ⚙️ Environment Configuration

Both backend and frontend leverage environment variables for operational parameters.

### **Backend (`Super-ERP-backend/.env`)**

| Variable | Description | Safe Dev Default | K8s Mapping |
| :--- | :--- | :--- | :--- |
| `PORT` | Node.js Express Listening Port | `5000` | ConfigMap |
| `NODE_ENV` | Environment Runtime Mode | `production` | ConfigMap |
| `MONGODB_URI` | MongoDB Connection URI | `mongodb://database:27017/super-erp` | Secret |
| `JWT_SECRET` | Secret key for signing auth tokens | `your_jwt_signing_secret_key` | Secret |
| `ENCRYPTION_SECRET` | Key for AES-256 field encryption | `your-encryption-secret` | Secret |
| `ENABLE_CRON_JOBS` | Toggle background cron jobs | `true` | ConfigMap |
| `SHUTDOWN_TIMEOUT_MS` | Graceful shutdown timeout | `10000` | ConfigMap |

---

## 💻 Local Development Setup

### **Prerequisites**
- Node.js `v22+`
- MongoDB `v6.0+`

### **1. Backend Setup**
```bash
cd Super-ERP-backend
npm install
npm run dev
```
The API server will start on `http://localhost:5000`.

### **2. Frontend Setup**
```bash
cd Super-ERP-frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

---

## 🐳 Docker & Containerization

### **Run Entire Stack via Docker Compose**
Execute the following command in the project root directory:

```bash
docker compose up --build -d
```

### **Service Endpoints**
- **Frontend App**: `http://localhost:8080` (or `http://localhost:80`)
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `localhost:27017`

### **Inspect Container Logs & Status**
```bash
# View active container status
docker compose ps

# Follow backend logs
docker compose logs -f backend
```

---

## ☸️ Kubernetes Production Deployment

### **Prerequisites**
- A running Kubernetes Cluster (`Minikube`, `GKE`, `EKS`, `AKS`, or `MicroK8s`)
- `kubectl` configured with cluster access

### **Step-by-Step Deployment**

1. **Deploy All Kubernetes Resources**:
   ```bash
   kubectl apply -f k8s/
   ```

2. **Verify Deployment & Services**:
   ```bash
   kubectl get all -n super-erp
   ```

3. **Check Live Pod Progress**:
   ```bash
   kubectl get pods -n super-erp -w
   ```

---

## 🩺 Health Checks & Observability

The backend incorporates cloud-native HTTP probes designed for Kubernetes Kubelet monitoring:

* **Liveness Probe**: `GET /health/live`
  * **Status**: `200 OK`
  * **Payload**: Includes uptime, service status, and timestamp.
* **Readiness Probe**: `GET /health/ready`
  * **Status**: `200 OK` (when MongoDB `readyState === 1`) / `503 Service Unavailable` (when disconnected).

### **Verification Commands**
```bash
# Liveness Check
curl http://localhost:5000/health/live

# Readiness Check
curl http://localhost:5000/health/ready
```

---

## 🔒 Security & Best Practices

- **Non-Root Container User**: Node.js runtime executes under the unprivileged `node` user (`USER node`).
- **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` signals cleanly, draining HTTP connections and terminating cron jobs before process exit.
- **Resource Constraints**: CPU & Memory requests and limits are explicitly defined across all K8s deployments to prevent OOM-Kills and noisy-neighbor issues.

---

<p center>
  Developed for <b>Super ERP</b> Kubernetes & Cloud Native Migration.
</p>
