export function githubFetchOptions(url, options) {
  const token = String(process.env.CUSTOM_GITHUB_TOKEN ?? "").trim();
  if (!token || !isGitHubURL(url)) return options;

  const headers = { ...(options?.headers ?? {}) };
  if (hasHeader(headers, "authorization")) return options;

  return {
    ...(options ?? {}),
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
}

export function isGitHubURL(url) {
  try {
    const hostname = new URL(String(url)).hostname.toLowerCase();
    return (
      hostname === "github.com" ||
      hostname.endsWith(".github.com") ||
      hostname.endsWith(".githubusercontent.com")
    );
  } catch {
    return false;
  }
}

function hasHeader(headers, name) {
  return Object.keys(headers).some((header) => header.toLowerCase() === name);
}
