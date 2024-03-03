export const sdServer = "http://192.168.1.5:8081"

function sendRequest(url, callback, data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText)
            const images = result['images']
            if (images.length > 0) {
                const image = images[0]
                callback(image)
            }
            console.log(result);
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
