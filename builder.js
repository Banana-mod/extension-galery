(async function() {
  function copyText(str) {
  navigator.clipboard.writeText(str);
}

  const defaultList = [

  ];

  async function getList() {
    try {
      return await fetch('extensions.json')
        .then(response => response.json())
        .then(response => {
          return response
        })
    } catch (uselessError) {
      throw new Error('Failed to fetch!');
      return defaultList;
    }
  };

  let extList = await getList();

  const extensions = document.getElementById('extensions');

  extList.forEach(currentValue => {
    const extension = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = currentValue["title"];

    const img = document.createElement('img');
    if(!currentValue["img"] || currentValue["img"] == null) {
      img.src = "./images/unknown-banner.png"
    } else {
      img.src = currentValue["img"];
    }
    
    const isSandboxed = Boolean(currentValue["sandboxed"]);
    
    const description = document.createElement('p');
    description.classList.add('desc');
    description.textContent = currentValue["description"]

    extension.appendChild(img);
    extension.appendChild(title);
    extension.appendChild(description);
    
    if(currentValue["docsURL"]) {
      const docsURL = document.createElement('a');
    
      docsURL.textContent = 'Documentation';
     
      docsURL.href = currentValue["docsURL"];
      
      docsURL.classList.add('docsBtn');
    
      extension.appendChild(docsURL);
    }

    const creators = currentValue["creator"];

    const creatorText = document.createElement('p');
    creatorText.textContent = `Creator(s):`

    extension.appendChild(creatorText);

    creators.forEach(currentValue => {
      const creator = document.createElement('a');
      creator.textContent = `${currentValue["name"]} `;
      creator.href = currentValue["url"] ? currentValue["url"] : '#' ;
      extension.appendChild(creator);
      extension.appendChild(document.createElement('br'));
      extension.appendChild(document.createElement('br'));
    })
    

    extension.classList.add('extension');

    const btnHolder = document.createElement('span');
    btnHolder.classList.add('extension-buttons');
    const copyURLBtn = document.createElement('button');
    const copyCodeBtn = document.createElement('button');
    const downloadBtn = document.createElement('button');
    copyURLBtn.classList.add('extension-button');
    copyURLBtn.dataset.copy = 'url';
    copyCodeBtn.classList.add('extension-button');
    copyCodeBtn.dataset.copy = 'code';
    downloadBtn.classList.add('extension-button');
    downloadBtn.dataset.copy = 'download';
    copyURLBtn.textContent = 'Copy URL';
    copyCodeBtn.textContent = 'Copy Code';
    downloadBtn.textContent = 'Download';
    btnHolder.appendChild(copyURLBtn);
    btnHolder.appendChild(copyCodeBtn);
    btnHolder.appendChild(downloadBtn);
    if(isSandboxed) {
      const tryBtn = document.createElement('button');
      tryBtn.classList.add('extension-button');
      tryBtn.dataset.copy = 'try';
      tryBtn.textContent = 'Try it out!';
      btnHolder.appendChild(tryBtn);
      
      tryBtn.addEventListener('click', () => {
        window.location.href = `https://turbowarp.org/editor?extension=${window.location.href}/${currentValue['url']}`;
      })
    }

    const lineBreak = document.createElement('br');

    copyURLBtn.addEventListener('click', function() {
      copyText(`${window.location.href}/${currentValue['url']}`);
    })

    async function getCode() {
      try {
        return await fetch(currentValue['url'])
          .then(response => response.text())
          .then(response => {
            return response;
          })
      } catch (uselessError) {
        return 'Failed to fetch code!'
      }
    }

    copyCodeBtn.addEventListener('click', async function() {
      const code = await getCode()
      copyText(code);
    })
    
    downloadBtn.addEventListener('click', async function() {
      const link = document.createElement('a');
      link.href = currentValue['url'];
      link.download = `${(currentValue["title"]. toLowerCase()).replace(/[^a-zA-Z0-9]/g, '-')}.js`;
      document.body.appendChild(link)
      try {
        link.click();
      } catch (error) {
        throw new Error('Failed to download file!');
      };
      link.remove();
    });
    
    extension.appendChild(lineBreak);

    extension.appendChild(btnHolder);

    extensions.appendChild(extension);
});})()
