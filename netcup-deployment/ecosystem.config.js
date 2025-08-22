
module.exports = {
  apps: [{
    name: 'helix-regulatory',
    script: '/var/www/helix/server/index.js',
    cwd: '/var/www/helix',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    env_file: '/var/www/helix/.env',
    log_file: '/var/www/helix/logs/helix.log',
    out_file: '/var/www/helix/logs/helix-out.log',
    error_file: '/var/www/helix/logs/helix-error.log',
    time: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    restart_delay: 4000,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 8000,
    shutdown_with_message: true,
    wait_ready: true
  }],
  
  deploy: {
    production: {
      user: 'root',
      host: 'your-server.netcup.net',
      ref: 'origin/main',
      repo: 'https://github.com/your-repo/helix-regulatory.git',
      path: '/var/www/helix',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
