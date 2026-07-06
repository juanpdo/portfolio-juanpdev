export async function onRequest(context) {
    var url = new URL(context.request.url);
    
    if (url.pathname.includes('.') && !url.pathname.endsWith('.html')) {
        return context.env.ASSETS.fetch(context.request);
    }
    
    url.pathname = '/projects/spa-noticias/index.html';
    return context.env.ASSETS.fetch(url);
}