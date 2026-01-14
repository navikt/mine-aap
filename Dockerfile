FROM gcr.io/distroless/nodejs20-debian12@sha256:773fe33b1b680078222dd0fe5cb37148ad512a8d68830feca4c10c93653f07f3


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
