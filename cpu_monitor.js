// cpu_monitor.js

import osUtils from 'os-utils';
import { exec } from 'child_process';

const osUtils = require('os-utils');
const { exec } = require('child_process');

const MAX_CPU_USAGE = 0.7;

function checkCPU() {
    osUtils.cpuUsage((usage) => {
        console.log(`Current CPU Usage: ${usage * 100}%`);

        if (usage > MAX_CPU_USAGE) {
            console.log(`CPU usage exceeds ${MAX_CPU_USAGE * 100}%. Restarting server...`);
            restartServer();
        }
    });
}

function restartServer() {
    exec('pm2 restart <your-app-name-or-server-start-command>', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restarting server: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Server restart stderr: ${stderr}`);
            return;
        }
        console.log(`Server restarted successfully: ${stdout}`);
    });
}

setInterval(checkCPU, 2000);
