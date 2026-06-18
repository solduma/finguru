# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

# uv for fast, reproducible installs
RUN pip install uv

COPY pyproject.toml ./
RUN uv pip install --system -r <(uv pip compile pyproject.toml 2>/dev/null) || uv pip install --system .

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
