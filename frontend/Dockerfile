FROM nginx:alpine

# Copier notre page HTML dans Nginx
COPY src/ /usr/share/nginx/html/

# Config Nginx pour router vers les services
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/health || exit 1