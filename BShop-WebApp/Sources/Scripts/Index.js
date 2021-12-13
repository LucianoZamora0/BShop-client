/* AUTOR: Luciano Zamora
* el siguiente script tiene como finalidad realizar distintos eventos en homepage del sitio, conectado en su mayoria con api
 http://lucisno-001-site1.ftempurl.com/
* IndexAPI() -> funcion maestra que engloba todas las acciones
* IndexApi.save -> almacena en una variable global de la funcion el texto ingresado en la barra de busqueda
* IndexApi.go -> redirecciona a la pagina de busuqueda del sitio con el texto adjunto.
* IndexApi.getCategories -> realiza una conexion a la API para obtener las categorias almacenadas en BD
* IndexApi.getProducts -> realiza una conexion a la API para obtener los primeros 12 productos almacenadas en BD
*/

function IndexApi() {

    
    let word = "";
     function initView() {

    }

    function save(){
        word = $("#buscador").val();
    }

    function go(){
        var actual = window.location.href;
        if(actual.includes("Search")){
            window.location.href =  '../../c/Search/index.html?search=' + $("#buscador").val();
        }else{
            if(actual.includes("Product")){
                window.location.href = '../Search/index.html?search=' + word;
    
            }else{
                window.location.href = './c/Search/index.html?search=' + word;
            }

        }
        
        
    }

    async function getCategories() {
        var categories = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `https://lucisno-001-site1.ftempurl.com/api/Category/GetAll`
        });
        
        var categoriesDropDown = "";
        $.each(categories, function (ix, category) {
            var actual = window.location.href;
            if(actual.includes("Search")){
                categoriesDropDown += `<a class="dropdown-item" href="../../c/Search/index.html?category=${category.id}">${category.name}</a>`
            }else{
                if(actual.includes("Product")){
                    categoriesDropDown += `<a class="dropdown-item" href="../Search/index.html?category=${category.id}">${category.name}</a>`
                }
                else{
                    categoriesDropDown += `<a class="dropdown-item" href="./c/Search/index.html?category=${category.id}">${category.name}</a>`
                }
            }
            
            
        });

        if(categoriesDropDown.length == 0 ){
            await getCategories();
        }

        $("#menu").append(categoriesDropDown);
    }

    async function getProducts() {
        var products = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `https://lucisno-001-site1.ftempurl.com/api/Product/GetAll`,
            data: {
                start: 0,
                end: 12
            }
        });
        
        var productsCard = "";
        
        $.each(products, function (ix, product) {
            img = "Sources/Images/logo2.png";
            if(product.urlImage.length >1){
                    img = product.urlImage;
            }
            if(product.discount > 0){
                var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
                productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                                <div  class="single-product">
                                <a href="./c/Product/index.html?product=${product.id}">
                                    <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                    <span class="discount">${product.discount}% Descuento!</span>
                                    </div>
                                </a>
                                    <div class="part-2">
                                        <h3 class="product-title">${product.name}</h3>
                                        <h4 class="product-old-price">$${oldPrice}</h4>
                                        <h4 class="product-price">$${product.price}</h4>
                                    </div>
                                </div>
                            </div>`

            }else{
                productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                                    <div class="single-product">
                                    <a href="./c/Product/index.html?product=${product.id}">
                                        <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                        </div>
                                    </a>
                                        <div class="part-2">
                                            <h3 class="product-title">${product.name}</h3>
                                            <h4 class="product-price">$${product.price}</h4>
                                        </div>
                                  </div>
                                </div>`

            }
        });

        if(productsCard.length == 0 ){
            await getProducts();
        }

        $("#productContainer").append(productsCard);
    }


    return Object.freeze({
        init:  () =>  initView(),
        save:  () =>  save(),
        go:  () =>  go(),
        categories: async () => await getCategories(),
        products:  async () => await getProducts()
    });
}

window.Index = function () {
    return IndexApi();
}