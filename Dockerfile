FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Install wget dan Cloudflared
RUN apt-get update && apt-get install -y wget && \
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && \
    dpkg -i cloudflared-linux-amd64.deb && \
    rm cloudflared-linux-amd64.deb

# Install serve
RUN npm install -g serve

# Setup script eksekusi
COPY start.sh start.sh
RUN chmod +x start.sh

EXPOSE 8081
CMD ["./start.sh"]
