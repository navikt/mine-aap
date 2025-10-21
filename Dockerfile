FROM gcr.io/distroless/nodejs20-debian12@sha256:c7c8f7522975ed2334ba0d79381d1facdd107ddf88b52a40eed79de2d56174f9


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["server.js"]
