export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.toLowerCase();

  // If the path exactly matches the destination pages, proceed normally without redirecting to avoid infinite loops
  if (path === '/air-duct-cleaning-houston.html' || path === '/99-air-duct-cleaning-houston.html') {
    return context.next();
  }

  // Only apply custom redirects to potential HTML pages or missing paths, ignoring static images and CSS
  if (path.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|xml|txt)$/)) {
    return context.next();
  }

  // Check if it's an air duct related path
  if (path.includes('air-duct') || path.includes('air duct') || path.includes('airduct')) {
    if (path.includes('99')) {
      return Response.redirect(url.origin + '/99-air-duct-cleaning-houston.html', 301);
    } else {
      return Response.redirect(url.origin + '/air-duct-cleaning-houston.html', 301);
    }
  }

  return context.next();
}
