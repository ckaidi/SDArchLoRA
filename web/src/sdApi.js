export const sdServer = "http://127.0.0.1:8081"

function sendRequest(url, callback, data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText)
            callback(result)
        } else {
            console.error('Request failed with status:', xhr.status);
        }
    };
    xhr.send(JSON.stringify(data));
}

export function txt2img(data, callback) {
    const url = sdServer + '/txt2img'
    sendRequest(url, callback, data);
}

export function img2img(imgUrl, data, callback) {
    const url = sdServer + '/img2img'
    data.img_url = imgUrl.split('?')[0]
    if (imgUrl.startsWith('data:image/')) {
        const image = new Image();
        image.onload = () => {
            const scale2 = image.width * image.height / 512 / 512
            const scale = Math.pow(scale2, 0.5)
            data.width = parseInt((image.width / scale).toString())
            data.height = parseInt((image.height / scale).toString())
            sendRequest(url, callback, data);
        };
        image.src = imgUrl;
    } else {
        sendRequest(url, callback, data);
    }
}
