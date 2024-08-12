# Menggunakan node LTS sebagai base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file dari current directory ke dalam container
COPY . .

# Build aplikasi
RUN npm run build

# Install server static files untuk aplikasi React
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["serve", "-s", "dist"]
