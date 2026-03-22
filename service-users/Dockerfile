# Image de base — Node.js version légère (alpine = très petite taille)
FROM node:18-alpine

# Bonne pratique : ne pas tourner en root dans le conteneur
# On crée un utilisateur dédié
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier d'abord package.json AVANT le code source
# Pourquoi ? Docker met en cache chaque étape
# Si le code change mais pas les dépendances →
# Docker réutilise le cache de npm install ✅ (plus rapide !)
COPY package.json .

# Installer les dépendances
RUN npm install --production

# Copier le reste du code source
COPY src/ ./src/
COPY .env .

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Utiliser l'utilisateur non-root
USER appuser

# Exposer le port
EXPOSE 3001

# Health check intégré dans l'image
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3001/health || exit 1

# Commande de démarrage
CMD ["node", "src/server.js"]
