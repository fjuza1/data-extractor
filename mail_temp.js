function SendLinkByMail(href) {
    var subject= "Interesting Information";
    var body = "I thought you might find this information interesting:\r\n\r\n<";
    body += window.location.href;
    body += ">";
    var uri = "mailto:?subject=";
    uri += encodeURIComponent(subject);
    uri += "&body=";
    uri += encodeURIComponent(body);
    window.open(uri);
}