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

export function txt2img(prompt, negativePrompt, callback) {
    const url = sdServer + '/txt2img'

    const data = {
        "prompt": prompt,
        "negative_prompt": negativePrompt
    }
    sendRequest(url, callback, data);
}

export function img2img(imgUrl, prompt, negativePrompt, callback) {
    const url = sdServer + '/img2img'

    const data = {
        "prompt": prompt,
        "negative_prompt": negativePrompt,
        "img_url": imgUrl.split('?')[0]
    }
    sendRequest(url, callback, data);
}
