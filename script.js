const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

function send(onError, onSuccess, url, method = 'GET', data = '', headers = {}, timeout = 60000) {
  let xhr;

  if (window.XMLHttpRequest) {
      // Chrome, Mozilla, Opera, Safari
      xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { 
      // Internet Explorer
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  
  for([key, value] of Object.entries(headers)){
    xhr.setRequestHeader(key, value)
  }


  xhr.timeout = timeout;

  xhr.ontimeout = onError;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if(xhr.status < 400) {
        onSuccess(xhr.responseText)
      } else {
        onError(xhr.status)
      }
    }
  }


  xhr.open(method, url, true);

  xhr.send(data);
}


function getCounter() {
  let last = 0;

  return () => ++last;
}

const stackIDGenrator = getCounter()


class Good {
  constructor({id, title, price}) {
    this.id = id;
    this.title = title;
    this.price = price;
  }

  getId() {
    return this.id;
  }

  getPrice() {
    return this.price;
  }

  getTitle() {
    return this.title;
  }
}

class GoodStack {
  constructor(good) {
    this.id = stackIDGenrator();
    this.good = good;
    this.count = 1;
  }

  getGoodId() {
    return this.good.id
  }

  getGood(){
    return this.good;
  }

  getCount() {
    return this.count;
  }

  add() {
    this.count++;
    return this.count;
  }

  remove() {
    this.count--;
    return this.count;
  }
}


class Cart {
  constructor(){
    this.list = []
    this.basket = [] //корзина для товаров из ${API}getBasket.json к ПЗ №2 (получение списка товаров корзины)
  }


  add(good) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == good.id)

    if(idx >= 0) {
      this.list[idx].add()
    } else {
      this.list.push(new GoodStack(good))
    }

  }


  remove(id) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == id)

    if(idx >= 0) {
      this.list[idx].remove()

      if(this.list[idx].getCount() <= 0) {
        this.list.splice(idx, 1)
      }
    } 
  }

  _onError(err){
    console.log(err);
  }

  _onSuccess(response){
    const data = JSON.parse(response);
    data.contents.forEach(product => {
      this.basket.push(
        new Good({id:product.id_product, title:product.product_name, price:product.price})
        )
    })
  }    
  
  // функция получения корзины с `${API}getBasket.json` к ПЗ №2 (получение списка товаров корзины)
  getBasket(){
    send(this._onError, this._onSuccess.bind(this), `${API}getBasket.json`);
  }

}



class Showcase {
  constructor(cart){
    this.list = [];
    this.cart = cart;
  }

  _onSuccess(response){
    const data = JSON.parse(response);
    data.forEach(product => {
      this.list.push(
        new Good({id:product.id_product, title:product.product_name, price:product.price})
        )
    })
  }

  _onError(err){
    console.log(err);
  }

  fetchGoods() {
    send(this._onError, this._onSuccess.bind(this), `${API}catalogData.json`)
  }

  addToCart(id) {
    const idx = this.list.findIndex((good) => id == good.id)

    if(idx >= 0) {
      this.cart.add(this.list[idx])
    }
  }


  render() {
    let listHtml = '';
    this.list.forEach(product => {
      const goodItem = new GoodsItem(product.id, product.title, product.price);

      listHtml += goodItem.render();
    });
    document.querySelector('.goods-list').innerHTML = listHtml;
  }

}


class GoodsItem {
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
  }
}




const cart = new Cart()
const showcase = new Showcase(cart)

showcase.fetchGoods();
cart.getBasket() // выполнение функции получения корзины к ПЗ №2 (получение списка товаров корзины)

setTimeout(() => {
  showcase.addToCart(123);
  showcase.addToCart(123);
  showcase.addToCart(123);
  showcase.addToCart(456);

  cart.remove(123);
  showcase.render();
  console.log(showcase);
  console.log(cart.basket) // что лежит в корзине basket к ПЗ №2 (получение списка товаров корзины)

}, 1000)

