# Stage 1: Build Angular app
FROM node:22 AS build
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve Angular app with Nginx (using standard debian-based image)
FROM nginx:stable

# Copy Angular build output
COPY --from=build /app/dist/fronte/browser /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]