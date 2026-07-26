FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

ENV NODE_ENV=production
ENV PORT=5000

RUN mkdir -p uploads/gov-docs

EXPOSE 5000

USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
CMD wget --quiet --tries=1 --spider http://localhost:5000/health/live || exit 1

CMD ["npm","start"]