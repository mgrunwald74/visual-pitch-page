module.exports = {
  apps: [{
    name: 'kaminkehrer-backend',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_restarts: 10,
    restart_delay: 4000,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    // Auto-restart if app crashes
    autorestart: true,
    // Stop app if it exceeds memory limit
    max_memory_restart: '1G'
  }]
};