export const sdServer = "http://gz.derper.chenkaidi.top:8081"

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

export function txt2imgRedraw(data, callback) {
    const url = sdServer + '/img2img'
    sendRequest(url, callback, data);
}

export function img2img(imgBase64, data, callback) {
    const url = sdServer + '/img2img'
    data.init_images = [imgBase64]
    if (imgBase64.startsWith('data:image/')) {
        const image = new Image();
        image.onload = () => {
            const scale2 = image.width * image.height / 512 / 512
            const scale = Math.pow(scale2, 0.5)
            data.width = parseInt((image.width / scale).toString())
            data.height = parseInt((image.height / scale).toString())
            sendRequest(url, callback, data);
        };
        image.src = imgBase64;
    }
}
