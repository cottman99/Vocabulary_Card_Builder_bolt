import { logger } from '../../utils/logger/Logger';

/**
 * Handles API response logging and error extraction
 */
export async function handleApiResponse(response: Response, context: string): Promise<any> {
  const contentType = response.headers.get('content-type');
  const responseText = await response.text();
  
  logger.api.debug(`${context} - Raw Response`, {
    status: response.status,
    contentType,
    text: responseText
  });

  if (!response.ok) {
    logger.api.error(`${context} - API Error`, {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });
    throw new Error(`API error (${response.status}): ${responseText}`);
  }

  // Handle HTML responses (usually error pages)
  if (contentType?.includes('text/html')) {
    logger.api.error(`${context} - Received HTML response`, { html: responseText });
    throw new Error('Received HTML response instead of JSON');
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    logger.api.error(`${context} - JSON Parse Error`, {
      error: error.message,
      text: responseText
    });
    throw new Error(`Failed to parse response: ${error.message}`);
  }
}