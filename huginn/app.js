(function () {
    var iframeList = [
        'iframes-news.json',
        'iframes-blogs.json',
        'iframes-methods.json',
        'iframes-trading.json',
        'iframes-software-engineering.json',
    ];

    new Promise(function (res, rej) {
        var request = new XMLHttpRequest();
        request.onload = function () {
            var data = JSON.parse(this.responseText);
            res(data);
        };
        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id') || 0;
        var iframe_source = iframeList[id];
        request.open('get', iframe_source);
        request.send();
    }).then(function (iframes) {
        function load(src) {
            var iframe = document.querySelector('div.iframe-switcher iframe');
            iframe.setAttribute('src', src);
        }
        var pages = document.querySelector('div.pages-container');
        //        pages.innerHTML = null;
        var topicRegex = new RegExp(/iframes-(?<topic>.*).json/);
        for (var x = 0; x < iframeList.length; x++) {
            var page = iframeList[x];
            var btn = document.createElement('div');
            btn.classList.add('btn');
            btn.innerText = page.match(topicRegex).groups.topic;
            btn.pageIndex = x;
            btn.onclick = function() {
                window.location = window.location.href.split('?')[0] + '?id=' + this.pageIndex;
            };
            pages.appendChild(btn);
        }
        var btns = document.querySelector('div.btns-container');
        btns.innerHTML = null;
        for (var x = 0; x < iframes.length; x++) {
            var iframe = iframes[x];
            var btn = document.createElement('div');
            btn.classList.add('btn');
            btn.innerText = iframe.text;
            btn.setAttribute('data-num', x);
            btn.internalData = iframe;
            btn.onclick = function() {
                if (this.internalData.exclusive) {
                    window.open(this.internalData.link);
                } else {
                    load(this.internalData.link);
                }
            };
            btns.appendChild(btn);
        }
        load(iframes[0].link);
    });
})();
