FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:7ea0a1ef9417e29d3878e6326ddb92c5fa4d5cedc55217f280618f4e9637d4f5


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
