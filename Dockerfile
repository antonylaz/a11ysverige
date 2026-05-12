# Playwright's official image: Node 20 + Chromium + all OS deps preinstalled.
# Pin to the same Playwright minor we depend on in package.json.
FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json* ./
# Browsers already in image — skip the postinstall download.
RUN npm ci --ignore-scripts

# Bring in the rest of the source and build.
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
