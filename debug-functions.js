// Debug script to test server endpoints
import http from 'http';

console.log("=== DEBUG: Testing Daily Mood Check Functions ===");

function testEndpoint(path, method = 'GET', postData = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',  // Use the correct IP
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log(`✅ ${method} ${path}: ${res.statusCode}`);
        if (res.statusCode === 200 && data) {
          try {
            const parsed = JSON.parse(data);
            if (path === '/api/health') {
              console.log('   Health check:', parsed.status);
            } else if (path.includes('quotes')) {
              console.log(`   Found ${parsed.length || 0} quotes`);
            }
          } catch (e) {
            // Non-JSON response
          }
        }
        resolve(res.statusCode);
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${method} ${path}: ${error.message}`);
      resolve(null);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log("Testing server endpoints...");
  
  // Test health endpoint
  await testEndpoint('/api/health');
  
  // Test quotes endpoint
  await testEndpoint('/api/quotes/happy');
  
  // Test mood analysis (should return 401 without auth)
  await testEndpoint('/api/journal/analyze-advanced', 'POST', { entryText: 'test' });
  
  // Test mood patterns (should return 401 without auth)
  await testEndpoint('/api/journal/mood-patterns');
  
  console.log("=== Debug tests completed ===");
}

runTests();
