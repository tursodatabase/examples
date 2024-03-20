FROM rust:1.67

WORKDIR /usr/src/web_traffic_checker
COPY . .

RUN mkdir -p db

RUN cargo install --path .

CMD ["web_traffic_checker"]