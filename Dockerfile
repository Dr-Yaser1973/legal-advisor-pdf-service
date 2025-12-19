FROM node:20-bullseye-slim

# 1) تثبيت مكتبات Chromium اللازمة (أهمها libnss3)
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  fonts-noto \
  fonts-noto-cjk \
  fonts-noto-color-emoji \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxext6 \
  libxfixes3 \
  libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000
CMD ["npm","start"]

