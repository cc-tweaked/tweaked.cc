const patchHeaders = (original: Headers, headers?: Headers): Headers => {
  const result = new Headers(headers);
  result.set("access-control-allow-origin", original.get("origin")!);

  const method = original.get("access-control-request-method");
  if (method) result.set("access-control-allow-methods", method);

  const allowedHeaders = original.get('access-control-request-headers');
  if (allowedHeaders) result.set('access-control-allow-headers', allowedHeaders);

  result.delete('set-cookie');
  result.delete('set-cookie2');

  // TODO: headers.set('access-control-expose-headers', headers.keys().join(","))

  return result;
}

const host = "https://copy-cat.squiddev.workers.dev/";

const handle = async (request: Request): Promise<Response> => {
  const origin = request.headers.get("origin");
  if (origin != "https://tweaked.cc" && origin != "https://copy-cat.squiddev.cc") {
    return new Response("Forbidden (invalid origin)", {
      status: 403,
    });
  }

  let path = request.url;
  if (path.startsWith(host)) {
    path = path.substr(host.length);
  } else {
    return new Response("Unknown host.", {
      status: 400,
    });
  }

  if (request.method == "OPTIONS") {
    return new Response("", {
      status: 200,
      headers: patchHeaders(request.headers),
    });
  }

  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.delete('cookie');
  const response = await fetch(path, {
    method: request.method,
    headers: forwardedHeaders,
    body: request.body,

    redirect: 'manual',
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: patchHeaders(request.headers, response.headers),
  });
}

addEventListener("fetch", event => event.respondWith(handle(event.request)));
