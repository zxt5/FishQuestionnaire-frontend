export function loadBMap(callback) {
    var script = document.createElement('script')
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=cTsGIgzbOe4eeNykwqYy6m0lVHvWTtnF&callback=' + callback
    document.body.appendChild(script)
}