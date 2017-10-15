require('isomorphic-fetch')
const parse = require('medium-parser');
const mkd = require("markdown").markdown;

const cors = 'https://cors-anywhere.herokuapp.com/'

window.fetchHTML = _ => {
  document.body.className = 'step2'
  const url = document.getElementById('url').value

  Promise.resolve(fetch(`${cors}${url}`, {
    credentials: 'same-origin',
  })).then(response => response.text())
  .then(text => {
    window.markdown = parse(text).markdown;
    document.body.className = 'step3'
  })

}

window.reset = _ =>  document.body.className = 'step1'

const parseURL = url => {
  const user = url.match(/\/@?([^/]+)\//)[1]
  // We don't use title from medium-parser here because we'd have to replace spaces for _ anyway and this is ready
  const title = url.match(/([^/]+)-.*$/)[1]
  return `${user}-${title}`
}

window.download = type => {
  document.body.className = 'step4';
  let filename = parseURL(document.getElementById('url').value);
  // Removing certains characters since the converter doesnt seem to like them
  filename = filename.replace(/-/g, "");
  filename = filename.replace("medium.com", "");
  const blob = new Blob([window.markdown], {type: 'application/octet-stream'})
  const formData = new FormData()
  formData.append('file', blob, filename+".md")
  Promise.resolve(fetch('https://cors-anywhere.herokuapp.com/http://www.markdowntopdf.com/app/upload', {
    method: 'post',
    body: formData,
    credentials: 'same-origin',
  })).then(response => response.blob())
  .then(blob => saveData(blob, filename))
}

const saveData = (blob, filename) => {
  let result = new FileReader();
  result.onloadend = function()
  {
    let json = JSON.parse(result.result);
    const a = document.createElement("a")
    a.style = "display: none"
    a.href = "http://www.markdowntopdf.com/app/download/"+json.foldername+"/"+json.urlfilename;
    document.body.appendChild(a)
    a.click()
  document.body.className = 'step3'
  };
  result.readAsText(blob);


}
