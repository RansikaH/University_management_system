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

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'PORT=${PORT:-8080}' >> /start.sh && \
    echo 'cat > /etc/nginx/nginx.conf << EOF' >> /start.sh && \
    echo 'events {' >> /start.sh && \
    echo '    worker_connections 1024;' >> /start.sh && \
    echo '}' >> /start.sh && \
    echo 'http {' >> /start.sh && \
    echo '    include /etc/nginx/mime.types;' >> /start.sh && \
    echo '    default_type application/octet-stream;' >> /start.sh && \
    echo '    server {' >> /start.sh && \
    echo '        listen $PORT;' >> /start.sh && \
    echo '        server_name localhost;' >> /start.sh && \
    echo '        root /usr/share/nginx/html;' >> /start.sh && \
    echo '        index index.html;' >> /start.sh && \
    echo '        location / {' >> /start.sh && \
    echo '            try_files $uri $uri/ /index.html;' >> /start.sh && \
    echo '        }' >> /start.sh && \
    echo '        add_header X-Frame-Options "SAMEORIGIN" always;' >> /start.sh && \
    echo '        add_header X-Content-Type-Options "nosniff" always;' >> /start.sh && \
    echo '        add_header X-XSS-Protection "1; mode=block" always;' >> /start.sh && \
    echo '        gzip on;' >> /start.sh && \
    echo '        gzip_vary on;' >> /start.sh && \
    echo '        gzip_min_length 1024;' >> /start.sh && \
    echo '        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;' >> /start.sh && \
    echo '    }' >> /start.sh && \
    echo '}' >> /start.sh && \
    echo 'EOF' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Railway sets PORT dynamically, default to 8080
ENV PORT=8080
EXPOSE $PORT

CMD ["/start.sh"]
