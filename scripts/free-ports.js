const { execSync } = require('child_process');

function killOnPort(port) {
	try {
		const output = execSync(`powershell -NoProfile -Command netstat -ano ^| findstr :${port}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
		const lines = output.split(/\r?\n/).filter(Boolean);
		const pids = new Set();
		for (const line of lines) {
			const parts = line.trim().split(/\s+/);
			const pid = parts[parts.length - 1];
			if (pid && pid !== '0') pids.add(pid);
		}
		for (const pid of pids) {
			try { execSync(`powershell -NoProfile -Command taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch {}
		}
	} catch {}
}

killOnPort(5000);
killOnPort(5173);



