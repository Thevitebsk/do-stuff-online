const $ = x => document.getElementById(x)
fetch('./langs.json')
.then(x => x.json())
.then(langs => DSO.modeList = langs)
.then(langs => {
    // Sort the languages by name, case-insensitive
    langs = Object.entries(langs);
    langs.sort((langA, langB) => {
        const nameA = langA[1].name.toLowerCase();
        const nameB = langB[1].name.toLowerCase();
        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    });
    // Populate the language dropdown
    for([key, value] of langs) {
        let option = document.createElement('option');
        option.value = key;
        option.innerText = value.name;
        $('select').appendChild(option);
    }
})
.then(() => DSO.selectLanguage())
.then(() => {
    for(let i of ['header', 'code', 'footer','input', 'flags'] ){
        if($(i).value) toggle($(i),true)
    }
    if(!$('code').value) toggle($('code', true))
})
function init(){
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            var panel = this.nextElementSibling;
            var disp = panel.style.display;
            if (disp === "block") {
                this.classList.remove("active");
                panel.style.display = "none";
            } else {
                this.classList.add("active");
                panel.style.display = "block";
            }
        });
        acc[i].click()
        acc[i].click()
    }
    window.toggle = (elem, open = false) => {
        let details = elem.parentNode
        if(open){
            details.open = "true"
        } else {
            details.open = details.open ? "" : "true"
        }
        resize(elem)
    }
    window.resize = (elem) => {
        elem.style.height = "";
        elem.style.height = elem.scrollHeight - 4 + "px";
    }
    [...document.querySelectorAll('textarea')].map(elem => {
        elem.addEventListener('input',_ => resize(elem))
        elem.addEventListener('change',_ => resize(elem))
    });
    window.addEventListener('resize', _ => {
        [...document.querySelectorAll('textarea')].map(resize);
    })
    $('code').addEventListener('input', updateByteCount)
    $('code').addEventListener('change', updateByteCount)
    updateByteCount()
    window.addEventListener('keydown', e => {
        if(e.ctrlKey || e.metaKey){
            if(e.key == 'Enter'){
                e.preventDefault();
                DSO.run();
            }
        }
    })
}
window.addEventListener('load',init)
function createLink(type){
    let link = DSO.makeLink();
    if(type == 'markdown'){
        link = `[Try It Online!](${link})`
    } else if(type == 'codegolf'){
        link = `# [${DSO.activeMode.name}], ${formatByteCount()}\n` + 
        `\`\`\`\n${$('code').value}\n\`\`\`\n`+
        `[Try It Online!][DSO]\n\n` +
        `[${DSO.activeMode.name}]: ${DSO.activeMode.link}\n` +
        `[DSO]: ${link}`
    } else if(type == 'html'){
        link = `<a href="${link}">Try It Online!</a>`
    } else if(type == 'cmc') {
        link = `[${DSO.activeMode.name}](${DSO.activeMode.link}), ${formatByteCount()}: [\`${$('code').value.replace(/`/g, '\\`')}\`](${link})`
    }
    $('output').value = link;
    toggle($('output'), true)
}
function getByteCount(){
    let text = $('code').value
    if(DSO.activeMode.bytecount){
        return DSO.activeMode.bytecount(text)
    } else {
        return new Blob([text]).size
    }
}
function formatByteCount() {
    let byteCount = getByteCount()
    if (byteCount === 1) {
        return "1 byte"
    } else {
        return `${byteCount} bytes`
    }
}
function updateByteCount(){
    $('bytecount').innerText = getByteCount();
    $('s').innerText = getByteCount() == 1 ? '' : 's'
}
