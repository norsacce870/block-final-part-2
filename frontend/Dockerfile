# ── STAGE 1 : Build React ──
FROM node:20-alpine AS build

WORKDIR /app

# Déclarer les arguments de build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ── STAGE 2 : Servir avec Nginx ──
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]