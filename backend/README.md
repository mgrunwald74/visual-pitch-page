# Kaminkehrer Backend API

Express.js Backend für das Kontaktformular der Münchner Energie Agentur Website.

## Installation & Setup

### 1. Dependencies installieren
```bash
cd backend
npm install
```

### 2. Environment Variables konfigurieren
```bash
cp .env.example .env
```

Bearbeite `.env` mit deinen echten Werten:
```bash
RESEND_API_KEY=re_your_actual_resend_api_key
SENDER_EMAIL=kontakt@muenchnerenergieagentur.de
RECIPIENT_EMAIL=sgw@muenchnerenergieagentur.de
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://deine-domain.com
```

### 3. Development starten
```bash
npm run dev
```

### 4. Production starten
```bash
npm start
```

## PM2 Deployment (Empfohlen für Production)

### PM2 installieren (falls nicht vorhanden)
```bash
npm install -g pm2
```

### App mit PM2 starten
```bash
pm2 start ecosystem.config.js
```

### PM2 Management
```bash
pm2 list          # Apps anzeigen
pm2 logs          # Logs anzeigen  
pm2 restart all   # Apps neustarten
pm2 stop all      # Apps stoppen
pm2 save          # Konfiguration speichern
pm2 startup       # Auto-start beim Boot
```

## API Endpoints

### POST /api/send-email
Sendet eine E-Mail über Resend.com

**Request Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com", 
  "telefon": "0123 456789",
  "variante": "Variante A",
  "nachricht": "Hallo, ich interessiere mich..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Ihre Nachricht wurde erfolgreich versendet..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Fehlermeldung",
  "errors": ["Validierungsfehler..."]
}
```

### GET /api/health
Health Check Endpoint

## Security Features

- **Rate Limiting**: 5 Anfragen pro 15 Minuten pro IP
- **CORS**: Konfiguriert für Frontend-Domain
- **Helmet**: Security Headers
- **Input Validation**: Umfassende Validierung aller Eingaben
- **Environment Variables**: Sichere Konfiguration

## Server Setup (Contabo)

### 1. Node.js installieren
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. PM2 installieren
```bash
sudo npm install -g pm2
```

### 3. Nginx Reverse Proxy (Optional)
```nginx
server {
    listen 80;
    server_name deine-domain.com;
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        # Frontend static files
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. SSL mit Certbot (Empfohlen)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.com
```

## Logs

Logs werden in `./logs/` gespeichert:
- `combined.log`: Alle Logs
- `out.log`: Standard Output
- `err.log`: Error Logs