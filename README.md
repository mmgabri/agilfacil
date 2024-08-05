
# Agil Facil

### Preparação do ambiente

```bash
 apt update
 apt install -y nodejs
 apt install npm -y
 apt install nginx -y
 npm install pm2@latest -g
 sudo apt install net-tools
```

### Clonar projeto do git

```bash
git clone https://github.com/mmgabri/agilfacil_v2.git
```

### Configurando o Frontend - Reacj js

```bash
  cd agilfacil_v2
  cd frontend
  npm install
  npm run build
  pm2 start --name agilfacil npm -- start
  pm2 startup systemd
```


#### Configurando o Nginx

```bash
  cd /etc/nginx/sites-available
  sudo nano agilfacil
  sudo ln -s /etc/nginx/sites-available/agilfacil /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx
  pm2 restart agilfacil  
```

#### Código Nginx: agilfacil

```bash
  server {
    listen 80;
    listen [::]:80;
    server_name 54.160.193.178 agilfacil.com.br www.agilfacil.com.br;
    return 301 https://$host$request_uri;

    location /socket/ {
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		 proxy_set_header Host $host;
		 proxy_pass http://localhost:9000;
		 proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

#### No browser de sua preferência, coloque o ip publico do host para abrir a pagina principal, por ex:
```bash
  http://54.160.193.178/
```



### Configurando o Backend - Node js

```bash
  cd /home/ubuntu/agilfacil_v2/backend/src
  npm install
  npm node server/js
  pm2 start --name agilfacil npm -- start
  pm2 startup systemd
```