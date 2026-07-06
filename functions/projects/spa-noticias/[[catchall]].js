export async function onRequest(context) {
    var url = new URL(context.request.url);
    url.pathname = '/projects/spa-noticias/index.html';
    return context.env.ASSETS.fetch(url);
}