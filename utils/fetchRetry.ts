export async function fetchWithRetry(url:any, options:any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // fail after max retries
      }

      console.log(`Retry attempt ${attempt} failed. Retrying...`);
    }
  }
}

