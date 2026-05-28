function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    const errors: any[] = [];
    if (promises.length === 0) {
      reject(new Error("Empty promise array"));
      return;
    }
    promises.forEach((p, index) => {
      p.then(resolve).catch((err) => {
        errors[index] = err;
        rejectedCount++;
        if (rejectedCount === promises.length) {
          reject(new Error("All promises rejected"));
        }
      });
    });
  });
}

/**
 * Scans common subnets for a running BrainBlitz backend on port 4000
 */
export async function discoverLocalServer(progressCallback?: (status: string) => void): Promise<string | null> {
  const subnets = ["192.168.1", "192.168.0", "192.168.100", "192.168.50", "192.168.2", "10.0.0"];
  
  for (const subnet of subnets) {
    if (progressCallback) {
      progressCallback(`SCANNING ${subnet}.X...`);
    }
    
    const promises: Promise<string>[] = [];
    for (let i = 1; i <= 254; i++) {
      const ip = `${subnet}.${i}`;
      const url = `http://${ip}:4000/health`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 750); // Fast 750ms timeout for LAN
      
      promises.push(
        fetch(url, { 
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" }
        })
          .then(async (res) => {
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (data && data.status === "ok") {
                return `http://${ip}:4000/graphql`;
              }
            }
            throw new Error();
          })
          .catch(() => {
            clearTimeout(timeoutId);
            return Promise.reject(new Error("Not found"));
          })
      );
    }
    
    try {
      const discoveredUrl = await promiseAny(promises);
      if (discoveredUrl) {
        return discoveredUrl;
      }
    } catch {
      // Continue to next subnet if all fail
    }
  }
  
  return null;
}
