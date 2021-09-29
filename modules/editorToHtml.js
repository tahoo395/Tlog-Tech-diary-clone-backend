const hljs = require('highlight.js');

module.exports = (data) => {
    let html = ''

    data.map(block => {

        switch (block.type) {
            case 'header':
                html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`

                break

            case 'paragraph':
                html += `<p>${block.data.text}</p>`

                break

            case 'delimiter':
                html += '<hr />'

                break

            case 'image':
                let imageUrl = block.data.file.url
                let title = block.data.caption ? block.data.caption : 'Article image'
                html += `
                    <figure class='img ${block.data.stretched ? 'image--stretched' : 'image--normal'}'>
                        <img src='${imageUrl}' title='Tlog: ${title}' alt='Tlog: ${title}' loading='lazy' />
                        ${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ''}
                    </figure/>`

                    break
            case 'warning':
                html += `
                <blockquote class='warning'>
                    <div class='upper'>
                        <svg class='w-8 h-8 text-yellow-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                            <path fill-rule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clip-rule='evenodd' />
                        </svg>
                        <span class='Title'>${block.data.title}</span>
                    </div>
                    <div class='message'>
                        ${block.data.message}
                    </div>
                </blockquote>`

                break

            case 'quote':
                html += `
                <blockquote class="quote">
                    <q class='text'>
                        ${block.data.text}
                    </q>
                    ${block.data.caption !== null ? `<p class='author'> - ${block.data.caption}</p>` : ''
                    }
                </blockquote>`

                break

            case 'table':
                const rows = block.data.content.map((row) => {
                    return `<tr>${row.reduce(
                        (acc, cell) =>
                            acc + `<td class=' p-2 border border-gray-200'>${cell}</td>`,
                        ''
                    )}</tr>`
                })

                html += `<table class=' w-full my-8'>${rows.join('')}</table>`

                break

            case 'checklist':
                html += `<ul>`
                block.data.items.forEach(function (li) {
                    html += `<li class="checklist-item">
                        <svg class="w-5 h-5 ${li.checked ? 'text-green-500' : 'hidden'}" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-square" class="svg-inline--fa fa-check-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zm-204.686-98.059l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L184 302.745l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.25 16.379 6.25 22.628.001z"></path></svg>
                        <svg class="w-5 h-5 ${!li.checked ? 'text-gray-500' : 'hidden'}" aria-hidden="true" focusable="false" data-prefix="far" data-icon="square" class="svg-inline--fa fa-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg>
                            ${li.text}
                        </li>`
                })
                html += `</ul>`

                break

            case 'list':
                html += `<${block.data.style === 'ordered' ? 'o' : 'u'}l>`
                block.data.items.forEach(function (li) {
                    html += `
                    <li class="list-item">
                    <svg class="w-2 h-2 text-gray-500" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path></svg>
                        ${li}
                    </li>`
                })
                html += `</${block.data.style === 'ordered' ? 'o' : 'u'}l>`

                break

            case 'CodeTool':
                html += `<pre class="hljs"><code>${hljs.highlight(block.data.code, { language: block.data.languageCode }).value}</code></pre>`

                break

            default:
                break;
        }
    })

    return html
}