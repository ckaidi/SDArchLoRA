FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY ssl/ /ssl
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80