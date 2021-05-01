FROM node:14
WORKDIR usr/src/app

# Install packages
COPY package*.json ./
RUN npm install

# Specify production environment
ENV NODE_ENV=production

# Copy files over
COPY . .