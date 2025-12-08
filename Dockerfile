FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Install dependencies
# Using --legacy-peer-deps because some older packages might conflict in newer npm
# or just normal install if lockfile exists
RUN npm ci --omit=dev || npm install --omit=dev
COPY . .
EXPOSE 3005
CMD ["npm", "start"]
