export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.toLowerCase();

  // If the path exactly matches the destination pages (with or without .html), proceed normally without redirecting
  const whitelistedPaths = [
    '/air-duct-cleaning-houston.html',
    '/air-duct-cleaning-houston',
    '/air-duct-cleaning-houston/',
    '/99-air-duct-cleaning-houston.html',
    '/99-air-duct-cleaning-houston',
    '/99-air-duct-cleaning-houston/'
  ];

  if (whitelistedPaths.includes(path)) {
    return context.next();
  }

  // Only apply custom redirects to potential HTML pages or missing paths, ignoring static images and CSS
  if (path.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|xml|txt)$/)) {
    return context.next();
  }

  // Exclude DFW / Dallas / Fort Worth pages from the Houston wildcard redirects
  if (path.includes('dallas') || path.includes('dfw') || path.includes('fort-worth') || path.includes('fortworth') || path.includes('forth-worth') || path.includes('forthworth')) {
    return context.next();
  }

  // Check if it's an air duct related path
  if (path.includes('air-duct') || path.includes('air duct') || path.includes('airduct')) {
    if (path.includes('99')) {
      return Response.redirect(url.origin + '/99-air-duct-cleaning-houston', 301);
    } else {
      return Response.redirect(url.origin + '/air-duct-cleaning-houston', 301);
    }
  }

  return context.next();
}
