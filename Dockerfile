FROM gcr.io/distroless/nodejs20-debian12@sha256:7fff8fb4a6463da2765532290c958f7e6fc01d54d7539f0d2bda1e93c7636d7c


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
