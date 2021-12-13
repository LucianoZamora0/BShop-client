/* AUTOR: Luciano Zamora
* el siguiente script tiene como finalidad realizar distintos eventos en la pagina de busqueda, conectado en su mayoria con api
 http://lucisno-001-site1.ftempurl.com/
* SearchApi() -> funcion maestra que engloba todas las acciones
* SearchApi.filterByPages -> realiza una conexion a la API para obtener los productos de acuerdo al orden otorgado por el boton de paginado
* SearchApi.buildNavegation -> crea la sección de paginado de acuerdo a resultados de busqueda.
* SearchApi.checkUrlParam -> realiza una conexion a la API de acuerdo a parametros ingresados por url (solo categoria o texto ingresado)
* SearchApi.filter -> realiza un conexion a la API de acuerdo a los filtros seleccionados (checkbox de categoria y slider de precios)
* SearchApi.filterByPrice -> ejecuta un llamado a la API filtrando por rango de precios.
* SearchApi.getCategoryFilter -> ejecuta un llamado a la API para obtener las categorias almacenadas en BD
*/
function SearchApi() {

    const selectedCategories = [];
    let categoryAll = [];
    let count = 0;
    const start = 0;
    const end = 12;
    const startCat = -1;
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const categoryUrl = urlParams.get('category');
    let firstLoadCatUrl = true;
    const searchUrl = urlParams.get('search')


    function initView() {

   }

   async function filterByPages(startPage, endPage){
    var productFilter;
    var rawMinPrice = $("#slider-range-value1").text();
    rawMinPrice = rawMinPrice.split(",").join("");
    rawMinPrice = rawMinPrice.split("$").join("");
    var rawMaxPrice = $("#slider-range-value2").text();
    rawMaxPrice = rawMaxPrice.split(",").join("");
    rawMaxPrice = rawMaxPrice.split("$").join("");
    var minPrice = parseInt(rawMinPrice);
    var maxPrice = parseInt(rawMaxPrice);
    if(selectedCategories.length > 0){
        var categoriesJson = JSON.stringify(selectedCategories);
         productFilter = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByFilters`,
            data: {
                start: startPage,
                end: endPage,
                categoriesJson: categoriesJson,
                minPrice: minPrice,
                maxPrice: maxPrice
            }

        });

    }else{
         productFilter = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetBySearch`,
            data: {
                start: startPage,
                end: endPage,
                text:searchUrl
            }

        });
    }

    var productsCard = "";

    $.each(productFilter, function (ix, product) {
        img = "../../Sources/Images/logo2.png";
        if(product.urlImage.length >1){
             img = product.urlImage;
        }
        if(product.discount > 0){
            var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
            productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                            <div  class="single-product">
                                <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat;  background-size: 197px 250px">
                                <span class="discount">${product.discount}% Descuento!</span>
                                </div>
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
                                    <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                    </div>
                                    <div class="part-2">
                                        <h3 class="product-title">${product.name}</h3>
                                        <h4 class="product-price">$${product.price}</h4>
                                    </div>
                              </div>
                            </div>`

        }
    });
    
    $("#productContainer").html("");
    $("#productContainer").append(productsCard);

   }

   function buildNavegation(){
        var pages = count/12;
        if(pages%1 !=0){
            pages = Math.trunc(pages +1);
        }else{
            pages = Math.trunc(pages);
        }

        var pagesBox = "";
        var startBox = -12;
        var endBox = 0;
        for(var x = 1; x <= pages; x++ ){
            startBox += 12;
            endBox += 12;
            pagesBox += `<li class="page-item"><a class="page-link" href="#" onclick="searchIndex.filterByPage(${startBox}, ${endBox})">${x}</a></li>`;
        }
        $("#paginator").html("");
        $("#paginator").append(pagesBox);
   }

   async function checkUrlParam(){
        cat = parseInt(categoryUrl)
        if(categoryUrl !=  null && firstLoadCatUrl){
            firstLoadCatUrl = false;
            $(`#c-${cat}`).prop('checked', true);
            await filter(start, end, cat);
        }
        if(categoryUrl == null && searchUrl == null){
            for(var x = 0; x <= categoryAll.length; x++){
                $(`#c-${x}`).prop('checked', true);
                selectedCategories.push(x);
            }
            var categoriesJson = JSON.stringify(categoryAll);
                var productFilter = await $.ajax({
                    method: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByCategory`,
                    data: {
                        start: start,
                        end: end,
                        categoriesJson: categoriesJson
                    }

                });

                 count = await $.ajax({
                    method: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByCategoryCount`,
                    data: {
                        start: start,
                        end: end,
                        categoriesJson: categoriesJson
                    }

                });

                var productsCard = "";
       
                $.each(productFilter, function (ix, product) {
                    img = "../../Sources/Images/logo2.png";
                    if(product.urlImage.length >1){
                         img = product.urlImage;
                    }
                    if(product.discount > 0){
                        var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
                        productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                                        <div  class="single-product">
                                            <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat;  background-size: 197px 250px">
                                            <span class="discount">${product.discount}% Descuento!</span>
                                            </div>
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
                                                <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                                </div>
                                                <div class="part-2">
                                                    <h3 class="product-title">${product.name}</h3>
                                                    <h4 class="product-price">$${product.price}</h4>
                                                </div>
                                          </div>
                                        </div>`
         
                    }
                });
                
                $("#productContainer").html("");
                $("#productContainer").append(productsCard);
                buildNavegation();
        }

        if(searchUrl != null){
            $("#buscador").val(searchUrl);
            var categoriesJson = JSON.stringify(categoryAll);
                var productFilter = await $.ajax({
                    method: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetBySearch`,
                    data: {
                        start: start,
                        end: end,
                        text: searchUrl
                    }

                });

                 count = await $.ajax({
                    method: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetBySearchCount`,
                    data: {
                        start: start,
                        end: end,
                        text: searchUrl
                    }

                });
                console.log(searchUrl)
                console.log(count);

                var productsCard = "";
                if(productFilter.length <= 0){
                    productsCard = `<div class"h-100 row align-items-center" style="text-align: center;">
                    <div class="col">
                    <h1> Producto no encontrado</h1> <a href="../../index.html"><button type="button" class="btn btn-light btn-md mr-1 mb-2"><i
                    class="fas fa-shopping-cart pr-2"></i>Volver a inicio</button></a>
                    </div>
                    </div> `;
                    $("#productContainer").html("");
                    $("#productContainer").append(productsCard);
                }else{
                    $.each(productFilter, function (ix, product) {
                        img = "../../Sources/Images/logo2.png";
                        if(product.urlImage.length >1){
                             img = product.urlImage;
                        }
                        if(product.discount > 0){
                            var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
                            productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                                            <div  class="single-product">
                                                <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat;  background-size: 197px 250px">
                                                <span class="discount">${product.discount}% Descuento!</span>
                                                </div>
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
                                                    <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                                    </div>
                                                    <div class="part-2">
                                                        <h3 class="product-title">${product.name}</h3>
                                                        <h4 class="product-price">$${product.price}</h4>
                                                    </div>
                                              </div>
                                            </div>`
             
                        }
                    });
                    
                    $("#productContainer").html("");
                    $("#productContainer").append(productsCard);
                    buildNavegation();
                }
       
                
        }

   }


   async function filter(start, end , categories){
    
    if(selectedCategories.indexOf(categories) == -1  ){
        selectedCategories.push(categories);
    }else{
        selectedCategories.splice(selectedCategories.indexOf(categories), 1);
    }

    var rawMinPrice = $("#slider-range-value1").text();
    rawMinPrice = rawMinPrice.split(",").join("");
    rawMinPrice = rawMinPrice.split("$").join("");
    var rawMaxPrice = $("#slider-range-value2").text();
    rawMaxPrice = rawMaxPrice.split(",").join("");
    rawMaxPrice = rawMaxPrice.split("$").join("");
    var minPrice = parseInt(rawMinPrice);
    var maxPrice = parseInt(rawMaxPrice);
    var categoriesJson = JSON.stringify(selectedCategories);
    var productFilter = await $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByFilters`,
        data: {
            start: start,
            end: end,
            categoriesJson: categoriesJson,
            minPrice: minPrice,
            maxPrice: maxPrice
        }

    });

    count = await $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByFiltersCount`,
        data: {
            categoriesJson: categoriesJson,
            minPrice: minPrice,
            maxPrice: maxPrice
        }

    });

    
    var productsCard = "";
       
       $.each(productFilter, function (ix, product) {
           img = "../../Sources/Images/logo2.png";
           if(product.urlImage.length >1){
                img = product.urlImage;
           }
           if(product.discount > 0){
               var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
               productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                               <div  class="single-product">
                                   <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat;  background-size: 197px 250px">
                                   <span class="discount">${product.discount}% Descuento!</span>
                                   </div>
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
                                       <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                       </div>
                                       <div class="part-2">
                                           <h3 class="product-title">${product.name}</h3>
                                           <h4 class="product-price">$${product.price}</h4>
                                       </div>
                                 </div>
                               </div>`

           }
       });
       
       $("#productContainer").html("");
       $("#productContainer").append(productsCard);
       buildNavegation();
    
   }

   async function filterByPrice(){
    
    var rawMinPrice = $("#slider-range-value1").text();
    rawMinPrice = rawMinPrice.split(",").join("");
    rawMinPrice = rawMinPrice.split("$").join("");
    var rawMaxPrice = $("#slider-range-value2").text();
    rawMaxPrice = rawMaxPrice.split(",").join("");
    rawMaxPrice = rawMaxPrice.split("$").join("");
    var minPrice = parseInt(rawMinPrice);
    var maxPrice = parseInt(rawMaxPrice);
    var categoriesJson = JSON.stringify(selectedCategories);
    var productFilter = await $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByFilters`,
        data: {
            start: start,
            end: end,
            categoriesJson: categoriesJson,
            minPrice: minPrice,
            maxPrice: maxPrice
        }

    });

    count = await $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByFiltersCount`,
        data: {
            categoriesJson: categoriesJson,
            minPrice: minPrice,
            maxPrice: maxPrice
        }

    });

    
    var productsCard = "";
       
       $.each(productFilter, function (ix, product) {
           img = "../../Sources/Images/logo2.png";
           if(product.urlImage.length >1){
                img = product.urlImage;
           }
           if(product.discount > 0){
               var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
               productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                               <div  class="single-product">
                                   <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat;  background-size: 197px 250px">
                                   <span class="discount">${product.discount}% Descuento!</span>
                                   </div>
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
                                       <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px">
                                       </div>
                                       <div class="part-2">
                                           <h3 class="product-title">${product.name}</h3>
                                           <h4 class="product-price">$${product.price}</h4>
                                       </div>
                                 </div>
                               </div>`

           }
       });
       
       $("#productContainer").html("");
       $("#productContainer").append(productsCard);
       buildNavegation();
    
   }

   async function getCategoryFilter(){
        var categories = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `http://lucisno-001-site1.ftempurl.com/api/Category/GetAll`
        });
        
        var categoriesDropDown = "";
        $.each(categories, function (ix, category) {
            categoryAll.push(category.id);
            categoriesDropDown += `<div class="form-check pl-0 mb-3" align="left" style="margin-left: 40px;">
                                    <input type="checkbox" onchange="searchIndex.filter(0, 12, ${category.id})"class="form-check-input filled-in" id="c-${category.id}">
                                    <label class="form-check-label small text-uppercase card-link-secondary" for="${category.id}">${category.name}</label>
                                </div>`
        });

        if(categoriesDropDown.length == 0 ){
            await getCategoryFilter();
        }
        $("#filtro").append(categoriesDropDown);

        await checkUrlParam();

   }
   async function getProductsSearch(start, end) {
       var products = await $.ajax({
           method: "GET",
           dataType: "json",
           crossDomain: true,
           url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetAll`,
           data: {
               start: start,
               end: end
           }
       });
       
       var productsCard = "";
       
       $.each(products, function (ix, product) {
           if(product.discount > 0){
               var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
               productsCard += `<div class="col-md-6 col-lg-4 col-xl-3">
                               <div  class="single-product">
                                   <div class="part-1"  style="background-image: url('${product.urlImage}'); background-repeat: no-repeat;">
                                   <span class="discount">${product.discount}% Descuento!</span>
                                   </div>
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
                                       <div class="part-1"  style="background-image: url('${product.urlImage}'); background-repeat: no-repeat;">
                                       </div>
                                       <div class="part-2">
                                           <h3 class="product-title">${product.name}</h3>
                                           <h4 class="product-price">$${product.price}</h4>
                                       </div>
                                 </div>
                               </div>`

           }
       });

       if(productsCard.length == 0 ){
           await getProductsSearch(start, end);
       }

       $("#productContainer").append(productsCard);
       buildNavegation();
   }


   return Object.freeze({
       init:  () =>  initView(),
       productsSearch:  async (start, end) => await getProductsSearch(start, end),
       getCategoryFilter: async() => await getCategoryFilter(),
       checkUrlParam: async() => await checkUrlParam(),
       filterByPage: async(start, end) => await filterByPages(start, end),
       filter: async (start, end, startcat) => await filter(start, end, startcat),
       filterByPrice: async () => await filterByPrice()
   });
}

window.Index = function () {
   return SearchApi();
}