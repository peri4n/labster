ARG RUST_VERSION=1.90.0

FROM rust:${RUST_VERSION} AS builder
WORKDIR /app
COPY . .
RUN \
  --mount=type=cache,target=/app/target/ \
  --mount=type=cache,target=/usr/local/cargo/registry/ \
  cargo build --release && \
  cp ./target/release/labster-web /

FROM debian:bookworm-slim AS final
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home "/nonexistent" \
  --shell "/sbin/nologin" \
  --no-create-home \
  --uid "10001" \
  appuser
COPY --from=builder /labster-web /usr/local/bin
RUN chown appuser /usr/local/bin/labster-web
USER appuser
WORKDIR /opt/labster-web
ENTRYPOINT ["labster-web"]
EXPOSE 3000/tcp
