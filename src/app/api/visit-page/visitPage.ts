import puppeteer from "puppeteer";

const visitPage = async (url: string, timeout: number) => {
  try {
    // Launch a new browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set a timeout for the page.goto and networkidle2
    const responsePromise = page.goto(url, {
      waitUntil: "networkidle2",
      timeout: timeout,
    });

    // Create a timeout promise to handle long-loading pages
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    );

    // Race between the responsePromise and the timeoutPromise
    await Promise.race([responsePromise, timeoutPromise]);

    // Wait for a specific element that indicates the page is fully loaded
    await page.waitForSelector("body", { timeout: 5000 });

    // Optionally interact with the page
    await page.click("body"); // Example interaction

    // Close the browser
    await browser.close();

    console.log("URL visited successfully");
  } catch (error) {
    console.error("Error visiting URL:", error);
  }
};

export { visitPage };
