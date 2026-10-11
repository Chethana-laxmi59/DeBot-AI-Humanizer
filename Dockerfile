# ====================================================
# Multi-Stage Dockerfile for Unified DEBOT Deployment
# Builds Frontend + Backend into a Single Web Service
# ====================================================

# ----------------------------------------------------
# Stage 1: Build Frontend (Vite + React + TypeScript)
# ----------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Python Backend (FastAPI + Uvicorn)
# ----------------------------------------------------
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/app/ ./app/
COPY backend/run.py ./

# Copy compiled frontend from Stage 1 into /app/static
COPY --from=frontend-builder /app/frontend/dist ./static

EXPOSE 8000

CMD ["python", "run.py"]
