
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
  pm2 start --name agilfacil-frontend npm -- start
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

#### Código Nginx para http: agilfacil

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
  pm2 start --name agilfacil-backend npm -- start
  pm2 startup systemd
```

## Configurando para HTTPS

```bash
  sudo apt install certbot python3-certbot-nginx -y
  sudo certbot --nginx -d agilfacil.com.br -d www.agilfacil.com.br
```
#### Atualize a configuração do nginx com o código abaixo
```bash
  server {
    server_name agilfacil.com.br;

    # Configuração para a aplicação principal
    location / {
        proxy_pass http://localhost:3000;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/agilfacil.com.br/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/agilfacil.com.br/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    listen 80;
    listen [::]:80;
    server_name agilfacil.com.br;

    # Redireciona todas as solicitações para HTTPS
    return 301 https://$host$request_uri;
}
```
#### Executar comando para restartar o nginx
```bash
sudo systemctl restart nginx
```

## Observações Importantes

1. **Liberar Portas no Security Group:**
   - Certifique-se de liberar as portas **9000** e **3000** no grupo de segurança (security group) para permitir o tráfego necessário para a aplicação.

2. **Ajuste do Arquivo `.env` no Backend:**
   - Antes de subir a aplicação, configure o arquivo `.env` do backend conforme o ambiente (dev ou prod) em que a aplicação será executada. 

3. **Ajuste o arquivo frontend\src\constants\apiConstants.js de acordo com o ambiente que for subir a aplicação**

4. **Ajuste de IP no CloudFlare (Ambiente AWS):**
   - Quando for subir uma nova instância no ambiente AWS, é necessário ajustar o endereço IP no CloudFlare. Acesse o painel da CloudFlare através do link abaixo e atualize o IP para o novo endereço da instância:
     - [Painel CloudFlare](https://dash.cloudflare.com/)
