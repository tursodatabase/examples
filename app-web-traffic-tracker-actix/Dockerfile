FROM rust:1.67

WORKDIR /usr/src/web_traffic_tracker
COPY . .

RUN mkdir -p db

RUN cargo install --path .

CMD ["web_traffic_tracker"]