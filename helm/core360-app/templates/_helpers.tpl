{{/*
Expand the name of the chart.
*/}}
{{- define "core360-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "core360-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "core360-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "core360-app.labels" -}}
helm.sh/chart: {{ include "core360-app.chart" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}

{{/*
Selector labels for Backend
*/}}
{{- define "core360-app.backendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "core360-app.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
app: backend
{{- end }}

{{/*
Selector labels for Frontend
*/}}
{{- define "core360-app.frontendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "core360-app.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
app: frontend
{{- end }}

{{/*
Selector labels for MongoDB
*/}}
{{- define "core360-app.mongoSelectorLabels" -}}
app.kubernetes.io/name: {{ include "core360-app.name" . }}-mongo
app.kubernetes.io/instance: {{ .Release.Name }}
app: mongo
{{- end }}
