# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiowanie plików konfiguracyjnych
COPY package*.json ./
COPY tsconfig*.json ./

# Instalacja zależności
RUN npm ci

# Kopiowanie kodu źródłowego
COPY . .

# Budowanie aplikacji
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Kopiowanie plików konfiguracyjnych i zależności
COPY package*.json ./
RUN npm ci --only=production

# Kopiowanie zbudowanej aplikacji
COPY --from=builder /app/dist ./dist

# Ustawienie zmiennych środowiskowych
ENV NODE_ENV=production

# Uruchomienie aplikacji
CMD ["node", "dist/main.js"]
