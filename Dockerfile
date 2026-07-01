FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --chown=www-data:www-data --chmod=755 . .
