FROM node:22.16.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN node --version && npm --version && npm install --include=optional --no-audit --no-fund
COPY . .
ARG VITE_API_BASE_URL=/api
ARG VITE_SOCKET_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_BASE_URL=$VITE_SOCKET_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
ENV BACKEND_UPSTREAM=http://host.docker.internal:4000
COPY deploy/frontend-nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
