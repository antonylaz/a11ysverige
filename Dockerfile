# Playwright's official image: Node 20 + Chromium + all OS deps preinstalled.
# Image version must match the playwright npm package's installed version
# (see node_modules/playwright/package.json). Mismatch causes runtime
# "Executable doesn't exist" because the npm package looks for a browser
# revision the image doesn't have.
FROM mcr.microsoft.com/playwright:v1.60.0-jammy

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
