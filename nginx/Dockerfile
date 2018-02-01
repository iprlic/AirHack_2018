FROM nginx:1.13.3
COPY sites-enabled/ /etc/nginx/sites-enabled
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx
