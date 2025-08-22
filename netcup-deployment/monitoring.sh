
#!/bin/bash

# System Health Check
check_system() {
    echo "=== System Health Check ==="
    echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')"
    echo "Memory Usage: $(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')"
    echo "Disk Usage: $(df -h / | awk 'NR==2{print $5}')"
    echo "Load Average: $(uptime | awk -F'load average:' '{ print $2 }')"
}

# Service Status
check_services() {
    echo "=== Service Status ==="
    systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
    systemctl is-active postgresql && echo "✅ PostgreSQL: Running" || echo "❌ PostgreSQL: Stopped"
    systemctl is-active redis-server && echo "✅ Redis: Running" || echo "❌ Redis: Stopped"
    pm2 list | grep -q "online" && echo "✅ Helix App: Running" || echo "❌ Helix App: Stopped"
}

# Application Health
check_app() {
    echo "=== Application Health ==="
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ API Health Check: OK"
    else
        echo "❌ API Health Check: Failed (Status: $HTTP_STATUS)"
    fi
}

check_system
check_services
check_app
