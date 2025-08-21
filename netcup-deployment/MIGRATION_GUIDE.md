
# Helix Netcup Migration Guide

## Schritt-für-Schritt Anleitung

### 1. Vorbereitung auf Replit
```bash
# 1. Daten exportieren
node netcup-deployment/export-data-replit.js

# 2. Alle generierten JSON-Dateien herunterladen
```

### 2. Netcup Server Setup
```bash
# 1. Basis-Setup ausführen
chmod +x netcup-deployment/netcup-setup.sh
sudo ./netcup-deployment/netcup-setup.sh

# 2. Anwendungsdateien hochladen
# Alle Projektdateien nach /var/www/helix kopieren
```

### 3. Konfiguration
```bash
# 1. Environment-Datei kopieren
cp netcup-deployment/netcup.env /var/www/helix/.env

# 2. .env-Datei anpassen
nano /var/www/helix/.env
# - Datenbank-Passwort ändern
# - API-Keys eintragen  
# - Domain anpassen
```

### 4. Datenbank Migration
```bash
# 1. Datenbank Schema erstellen
sudo -u postgres psql helix_regulatory < netcup-deployment/database-migration.sql

# 2. Daten importieren (JSON-Dateien müssen im Verzeichnis sein)
./netcup-deployment/backup-and-migrate.sh import
```

### 5. Deployment
```bash
# Vollständiges Deployment ausführen
sudo ./netcup-deployment/deploy-to-netcup.sh
```

### 6. SSL Konfiguration
```bash
# Domain in nginx-helix.conf anpassen, dann:
sudo certbot --nginx -d ihre-domain.com -d www.ihre-domain.com
```

### 7. Finalisierung
```bash
# 1. Services prüfen
sudo systemctl status nginx postgresql redis-server
pm2 status

# 2. Anwendung testen
curl http://localhost:5000/api/health

# 3. Logs prüfen
pm2 logs helix-regulatory
```

## Wichtige Befehle

### Service Management
```bash
# PM2 Commands
pm2 start helix-regulatory
pm2 restart helix-regulatory
pm2 stop helix-regulatory
pm2 logs helix-regulatory

# System Services
sudo systemctl restart nginx
sudo systemctl restart postgresql
sudo systemctl restart redis-server
```

### Monitoring
```bash
# System Status
pm2 monit
htop
df -h

# Logs
tail -f /var/www/helix/logs/helix.log
tail -f /var/log/nginx/helix-access.log
```

### Backup
```bash
# Datenbank Backup
./netcup-deployment/backup-and-migrate.sh backup

# Anwendung Backup
tar -czf helix-backup-$(date +%Y%m%d).tar.gz /var/www/helix
```

## Troubleshooting

### Database Connection Issues
```bash
# Prüfen ob PostgreSQL läuft
sudo systemctl status postgresql

# Verbindung testen
psql -h localhost -U helix_user -d helix_regulatory
```

### Nginx Issues
```bash
# Nginx Konfiguration testen
sudo nginx -t

# Nginx neu laden
sudo systemctl reload nginx
```

### PM2 Issues
```bash
# PM2 Prozesse neu starten
pm2 restart all

# PM2 Cache leeren
pm2 kill
pm2 start ecosystem.config.js
```

## Performance Optimierung

### PostgreSQL
```sql
-- Indexes für bessere Performance
CREATE INDEX CONCURRENTLY idx_regulatory_updates_search ON regulatory_updates USING GIN(to_tsvector('english', title || ' ' || content));
```

### Nginx Caching
```nginx
# In der nginx Konfiguration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Sicherheit

### Firewall Setup
```bash
# UFW Firewall konfigurieren
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Regelmäßige Updates
```bash
# Crontab für automatische Updates
0 2 * * 0 apt update && apt upgrade -y
```
