
#!/bin/bash
# Complete Helix Deployment Script for Netcup

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="/var/www/helix"
SERVICE_NAME="helix-regulatory"

echo -e "${BLUE}🚀 Deploying Helix to Netcup${NC}"
echo ""

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        echo -e "${RED}❌ This script must be run as root or with sudo${NC}"
        exit 1
    fi
}

# Install application
install_application() {
    echo -e "${YELLOW}📦 Installing Helix application...${NC}"
    
    cd $APP_DIR
    
    # Install dependencies
    npm install --production
    
    # Build application
    npm run build
    
    # Create logs directory
    mkdir -p logs
    chown -R www-data:www-data logs
    
    # Set permissions
    chown -R www-data:www-data $APP_DIR
    chmod -R 755 $APP_DIR
    
    echo -e "${GREEN}✅ Application installed${NC}"
}

# Configure services
configure_services() {
    echo -e "${YELLOW}⚙️ Configuring services...${NC}"
    
    # Copy Nginx configuration
    cp netcup-deployment/nginx-helix.conf /etc/nginx/sites-available/helix
    ln -sf /etc/nginx/sites-available/helix /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    nginx -t
    
    # Start services
    systemctl restart postgresql
    systemctl restart redis-server
    systemctl restart nginx
    
    # Enable services
    systemctl enable postgresql
    systemctl enable redis-server
    systemctl enable nginx
    
    echo -e "${GREEN}✅ Services configured${NC}"
}

# Setup PM2
setup_pm2() {
    echo -e "${YELLOW}🔄 Setting up PM2...${NC}"
    
    cd $APP_DIR
    
    # Copy PM2 configuration
    cp netcup-deployment/ecosystem.config.js .
    
    # Start application with PM2
    su -c "pm2 start ecosystem.config.js --env production" www-data
    su -c "pm2 save" www-data
    
    # Setup PM2 startup
    env PATH=$PATH:/usr/bin pm2 startup systemd -u www-data --hp /var/www
    
    echo -e "${GREEN}✅ PM2 configured${NC}"
}

# Setup SSL (Let's Encrypt)
setup_ssl() {
    echo -e "${YELLOW}🔒 Setting up SSL certificate...${NC}"
    
    # Install Certbot
    apt install -y certbot python3-certbot-nginx
    
    echo "Please run the following command to get SSL certificate:"
    echo "certbot --nginx -d your-domain.com -d www.your-domain.com"
    
    echo -e "${YELLOW}Note: Update your-domain.com with your actual domain${NC}"
}

# Setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
    
    # Create logrotate configuration
    cat > /etc/logrotate.d/helix << EOF
/var/www/helix/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

    # Setup basic monitoring script
    cat > /usr/local/bin/helix-health-check << 'EOF'
#!/bin/bash
HEALTH_URL="http://localhost:5000/api/health"
if ! curl -f -s "$HEALTH_URL" > /dev/null; then
    echo "Helix health check failed - restarting service"
    pm2 restart helix-regulatory
fi
EOF

    chmod +x /usr/local/bin/helix-health-check
    
    # Add to cron
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/helix-health-check") | crontab -
    
    echo -e "${GREEN}✅ Monitoring configured${NC}"
}

# Main deployment
main() {
    check_permissions
    
    echo -e "${YELLOW}📋 Starting Helix deployment on Netcup...${NC}"
    
    install_application
    configure_services
    setup_pm2
    setup_ssl
    setup_monitoring
    
    echo ""
    echo -e "${GREEN}🎉 Helix deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo -e "1. Configure your domain in nginx-helix.conf"
    echo -e "2. Run: certbot --nginx -d your-domain.com"
    echo -e "3. Update .env file with your API keys"
    echo -e "4. Import your data using backup-and-migrate.sh"
    echo -e "5. Test the application: http://your-server-ip"
    echo ""
    echo -e "${BLUE}📊 Monitoring:${NC}"
    echo -e "- Application status: pm2 status"
    echo -e "- Application logs: pm2 logs helix-regulatory"
    echo -e "- Nginx logs: tail -f /var/log/nginx/helix-*.log"
    echo -e "- System logs: journalctl -u nginx -f"
}

main "$@"
