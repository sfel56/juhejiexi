export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    const targetUrl = 'https://api.xcvts.cn/api/video_qsy/juhe' + url.search;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });

        const body = await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 0,
            msg: '请求失败：' + error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        }
    });
}
