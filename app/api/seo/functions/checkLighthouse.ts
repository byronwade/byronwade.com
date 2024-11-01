export async function checkLighthouse(url: string) {
  console.log("Checking Lighthouse for:", url);
  const apiKey = process.env.GOOGLE_API_KEY;
  const apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  const params = {
    url: url,
    key: apiKey ?? '',
  };

  try {
    const response = await fetch(`${apiUrl}?${new URLSearchParams(params)}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PageSpeed API Error:', errorData);
      throw new Error(`Failed to fetch Lighthouse data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Lighthouse Data:", data);

    return data;
  } catch (error) {
    console.error('Error fetching Lighthouse data:', error);
    throw error;
  }
}
