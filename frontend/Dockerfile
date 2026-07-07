# --- ÉTAPE 1 : Base commune pour installer les modules Node ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- ÉTAPE 2 : Environnement de DÉVELOPPEMENT LOCAL ---
FROM base AS development
COPY . .
EXPOSE 5173
# Lance le serveur Vite en mode exposé pour Docker
CMD ["npm", "run", "dev", "--", "--host"]

# --- ÉTAPE 3 : Compilation pour la PRODUCTION ---
FROM base AS builder
COPY . .
RUN npm run build

# --- ÉTAPE 4 : Serveur Nginx final pour distribuer le Front en PRODUCTION ---
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]