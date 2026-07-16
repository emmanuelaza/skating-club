/**
 * Parseo puro de host -> slug de sede. Sin dependencias de servidor, seguro
 * para importar desde el middleware (Edge runtime).
 */

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000';

/**
 * Extrae el slug de sede (subdominio) a partir del host.
 *
 * - `bogota.clubx.com`  -> "bogota"
 * - `clubx.com`         -> null (dominio raíz)
 * - `bogota.localhost`  -> "bogota" (desarrollo)
 * - `localhost`         -> null
 *
 * Ignora el puerto y no trata `www` como sede.
 */
export function getSubdomainFromHost(
  host: string | null,
  rootDomain: string = ROOT_DOMAIN,
): string | null {
  if (!host) return null;

  const hostname = host.split(':')[0]?.toLowerCase() ?? '';
  const root = rootDomain.split(':')[0]?.toLowerCase() ?? '';

  if (!hostname || hostname === root) return null;

  if (hostname.endsWith(`.${root}`)) {
    const sub = hostname.slice(0, -(root.length + 1));
    if (!sub || sub === 'www') return null;
    return sub.split('.')[0] ?? null;
  }

  return null;
}
