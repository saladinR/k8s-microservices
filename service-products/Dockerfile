FROM node:18-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY src/ ./src/
COPY .env .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["node", "src/server.js"]
