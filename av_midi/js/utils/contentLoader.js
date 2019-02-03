export default function contentLoader(html_template) {
    let content = '';
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", html_template, false);
    httpRequest.onreadystatechange = function ()
    {
        if(httpRequest.readyState === 4)
        {
            if(httpRequest.status === 200 || httpRequest.status == 0)
            {
                content = httpRequest.responseText;
            }
        }
    }
    httpRequest.send();
    return content;
}