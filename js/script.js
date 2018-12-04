let productClass;

const modalToggle = name => new Promise((resolve, reject) => {
    try{
        let modal = document.querySelector(`[data-modal=${name}]`);
        modal.classList.toggle("modal-opened");
        resolve(true);
    }catch(err){
        reject(err);
    }
});

const get = url => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open('GET', `http://monadaweb.com/${url}`);
        req.onreadystatechange = () => {
            if(req.readyState == 4){
                if(req.status == "200")
                    resolve(JSON.parse(req.responseText))
                else
                    reject(Error(req.statusText));
            }
        }
        req.send();
    });
}

function ProductClass(){
    this.productsDOM = document.getElementById('products');
    this.productsDOM.innerHTML = "";
    this.products = [];
    this.selectedQt;
    this.loadingDOM = document.querySelector(`[data-spinner='products']`);

    this.listAll = () => {
        this.loadingDOM.style.display = 'flex';
        get('ideia2001/produtos').then(products => {
            setTimeout(() => {
                this.loadingDOM.style.display = 'none';
                if(products){
                    this.products = products;
                    this.setProductsDOM();
                }
            }, 1000);
        }).catch(err => {
            this.loadingDOM.style.display = 'none';
            console.error("Erro ao efetuar a chamada GET", err)
        });
    };

    this.setProductsDOM = () => {
        let productsDOM = [];
        this.products.forEach((product, i) => {
            let item = document.createElement('div');
            let description = document.createElement('span');
            description.innerText = product.DescricaoProduto;
            description.classList.add("item-description");
            let qt = document.createElement('span');
            qt.innerText = product.Quantidade;
            qt.classList.add("item-qt");
            item.classList.add('item');
            item.appendChild(description);
            item.appendChild(qt);
            item.setAttribute('data-qt', product.Quantidade);
            item.setAttribute('data-id', i);
            item.onclick = el => {
                this.updateItem(el.path.find(x => x.classList.contains('item')));
            };
            productsDOM.push(item);
        });

        this.sort(productsDOM);
    };

    this.updateItem = itemSelected => {
        let itemActived = this.productsDOM.querySelector('div.actived');
        if(itemActived != itemSelected){
            if(itemActived){
                itemActived.classList.remove('actived');
                itemActived.classList.add('updated');
                setTimeout(() => itemActived.classList.remove('updated'),1000);
                let id = itemSelected.getAttribute('data-id');
                this.products[id].removed = true;
                this.selectedQt = parseInt(itemSelected.getAttribute('data-qt')) + parseInt(itemActived.getAttribute('data-qt'));
                this.productsDOM.removeChild(itemSelected);
                itemActived.setAttribute('data-qt', this.selectedQt);
                itemActived.querySelector('.item-qt').innerText = this.selectedQt;
                this.sort([].slice.call(this.productsDOM.querySelectorAll('div')));
            }else{
                let id = itemSelected.getAttribute('data-id');
                this.products[id].selected = true;
                itemSelected.classList.add('actived');
            }
        }
    }

    this.sort = productsDOM=> {
        this.productsDOM.innerHTML = '';
        [].slice.call(productsDOM).sort((a,b) => {
            return parseInt(b.getAttribute('data-qt')) - parseInt(a.getAttribute('data-qt'))
        }).forEach(item => {
            this.productsDOM.appendChild(item);
        })
    }

    this.listAll();
}

//Abrir Modals

const openProductsModal = () => {
    modalToggle('products').then(() => {
        productClass = new ProductClass();
        console.info("Products object", productClass);
    }).catch(err => console.error("Erro ao abrir o modal products", err));
}

const openResultModal = () => {
    modalToggle('result').then(() => {
        console.info("Product object", productClass);
        let selectedDOM = document.getElementById('products-selected');
        let removedDOM = document.getElementById('products-removed');
        let resultQtDOM = document.querySelector('.result-status-qt');

        resultQtDOM.innerHTML = productClass.selectedQt ? `Quantidade acumulada do último produto selecionado: <b>${productClass.selectedQt}</b>` : "Ainda nenhuma quantidade de produto foi acumulada <b>):</b>";
        selectedDOM.innerHTML = '';
        removedDOM.innerHTML  = '';

        productClass.products.forEach(product => {
            let item = document.createElement('div');
            let description = document.createElement('span');
            description.innerText = product.DescricaoProduto;
            description.classList.add("item-description");
            item.appendChild(description);
            if(product.selected){
                selectedDOM.appendChild(item.cloneNode(true));
            }
            if(product.removed){
                removedDOM.appendChild(item.cloneNode(true));
            }
        })
    }).catch(err => console.error("Erro ao abrir o modal result", err));
}

//Para exibir o modo FullScreen nos Navegadores Mobile!
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}

toggleFullScreen();

