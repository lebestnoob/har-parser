const inputElement = document.getElementById("file");

inputElement.addEventListener("change", handleFiles);

function handleFiles() {
  const file = this.files[0]; 
  if (file.name.endsWith(".har")){
      new Response(file).json().then((json) =>{
          const container = document.querySelector("#container");
          const uris = [];

          for (const content of json.log.entries) {
            const tr = document.createElement("tr");
            
            const a = document.createElement("a");
            a.href = `data:${content.response.content.mimeType};${content.response.content.encoding},${content.response.content.text}`;
            
            const t = new Date(content.startedDateTime).valueOf() + content.time;
            // const t = content.time;
            // let t;

            // for(const a of content.response.headers){
            //     if(a.name == "date"){
            //         t = new Date(a.value).valueOf();
            //     }
            // }

            uris.push({download: a.href, filename: t});
            a.textContent = `data:${content.response.content.mimeType};${content.response.content.encoding},${content.response.content.text}`;
            a.target = "_blank";
            a.setAttribute("download", "");
            const data_td = document.createElement("td");
            data_td.appendChild(a);
           
            const p = document.createElement("p");
            p.textContent = content.response.content.size;
            const size_td = document.createElement("td");
            size_td.appendChild(p);
            
            const p_time = document.createElement("p");
            p_time.textContent = t;
            const time_td = document.createElement("td");
            time_td.appendChild(p_time);

            tr.appendChild(data_td);
            tr.appendChild(p_time);
            tr.appendChild(size_td);

            container.appendChild(tr);
          }
          

          const downloadAll = document.querySelector("button#downloadAll");
          downloadAll.addEventListener("click", (e)=>{
            e.preventDefault();
            download_files(uris);
          })
        })
      } 
    }

// Source - https://stackoverflow.com/a/29606450
// Posted by speedplane, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-13, License - CC BY-SA 4.0

/**
 * Download a list of files.
 * @author speedplane
 */
function download_files(files) {
  function download_next(i) {
    if (i >= files.length) {
      return;
    }
    var a = document.createElement('a');
    a.href = files[i].download;
    a.target = '_parent';
    // Use a.download if available, it prevents plugins from opening.
    if ('download' in a) {
      a.download = files[i].filename;
    }
    // Add a to the doc for click to work.
    (document.body || document.documentElement).appendChild(a);
    if (a.click) {
      a.click(); // The click method is supported by most browsers.
    } else {
      $(a).click(); // Backup using jquery
    }
    // Delete the temporary link.
    a.parentNode.removeChild(a);
    // Download the next file with a small timeout. The timeout is necessary
    // for IE, which will otherwise only download the first file.
    setTimeout(function() {
      download_next(i + 1);
    }, 500);
  }
  // Initiate the first download.
  download_next(0);
}