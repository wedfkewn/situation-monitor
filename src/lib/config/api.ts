/**
 * API Configuration
 */

import { browser } from '$app/environment';

/**
 * Finnhub API key
 * Get your free key at: https://finnhub.io/
 */
export const FINNHUB_API_KEY = browser
	? (import.meta.env?.VITE_FINNHUB_API_KEY ?? '')
	: (process.env.VITE_FINNHUB_API_KEY ?? '');

export const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

/**
 * FRED API key (St. Louis Fed)
 */
export const FRED_API_KEY = browser
	? (import.meta.env?.VITE_FRED_API_KEY ?? '')
	: (process.env.VITE_FRED_API_KEY ?? '');

export const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

/**
 * Check if we're in development mode
 */
const isDev = browser ? (import.meta.env?.DEV ?? false) : false;

/**
 * CORS proxy URLs for external API requests
 * 已修改：使用你部署成功的专属代理地址
 */
export const CORS_PROXIES = {
	// 这里已经替换为你刚部署好的新地址
	primary: 'https://api-proxy.399495950abc.workers.dev/?url=',
	fallback: 'https://corsproxy.io/?url='
} as const;

// 为了保持兼容性，默认代理也指向你的新地址
export const CORS_PROXY_URL = CORS_PROXIES.primary;

/**
 * Fetch with CORS proxy fallback
 * 优先使用你的 Worker 代理，失败时尝试公共代理
 */
export async function fetchWithProxy(url: string): Promise<Response> {
	const encodedUrl = encodeURIComponent(url);

	// 尝试你的专属代理 (Primary)
	try {
		const response = await fetch(CORS_PROXIES.primary + encodedUrl);
		if (response.ok) {
			return response;
		}
		logger.warn('API', `专属代理请求失败 (${response.status})，尝试备用代理`);
	} catch (error) {
		logger.warn('API', '专属代理连接错误，尝试备用代理:', error);
	}

	// 备用公共代理 (Fallback)
	return fetch(CORS_PROXIES.fallback + encodedUrl);
}

/**
 * API request delays (ms)
 */
export const API_DELAYS = {
	betweenCategories: 500,
	betweenRetries: 1000
} as const;

/**
 * Cache TTLs (ms)
 */
export const CACHE_TTLS = {
	weather: 10 * 60 * 1000,
	news: 5 * 60 * 1000,
	markets: 60 * 1000,
	default: 5 * 60 * 1000
} as const;

/**
 * Debug/logging configuration
 */
export const DEBUG = {
	enabled: isDev,
	logApiCalls: isDev,
	logCacheHits: false
} as const;

/**
 * Conditional logger
 */
export const logger = {
	log: (prefix: string, ...args: unknown[]) => {
		if (DEBUG.logApiCalls) {
			console.log(`[${prefix}]`, ...args);
		}
	},
	warn: (prefix: string, ...args: unknown[]) => {
		console.warn(`[${prefix}]`, ...args);
	},
	error: (prefix: string, ...args: unknown[]) => {
		console.error(`[${prefix}]`, ...args);
	}
};
