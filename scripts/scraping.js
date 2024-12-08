const href_elements = document.querySelectorAll('div.product-item > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)');
const label_elements = document.querySelectorAll('div.product-item > h3:nth-child(2) > a:nth-child(1)');

const hrefs = [...href_elements].map(l => l.src)
const labels = [...label_elements].map(l => l.innerText)

const zipped = hrefs.map((href, idx) => {return {"href": href, "name": labels[idx]}})

