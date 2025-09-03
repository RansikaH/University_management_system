FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build with API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM nginx:alpine

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Railway sets PORT dynamically, default to 8080
ENV PORT=8080
EXPOSE $PORT

# Start nginx on the Railway-assigned port
CMD sh -c "sed -i 's/listen 80;/listen $PORT;/' /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
