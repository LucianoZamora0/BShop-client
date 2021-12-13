/* AUTOR: Luciano Zamora
* el siguiente script tiene como finalidad realizar distintos eventos en la pagina de detalle del producto, conectado en su mayoria con api
 http://lucisno-001-site1.ftempurl.com/
* ProductApi() -> funcion maestra que engloba todas las acciones
* ProductApi.getProduct -> realiza una conexion a la API para obtener el producto por id ingresado.
* ProductApi.getByCategories -> realiza una conexion a la API para obtener 6 productos relacionados a la categoria del producto buscado
*/
function ProductApi() {

    
     function initView() {

    }

    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('product');
    let cat = -1;

    async function getProduct() {
        var id = parseInt(productId)
        var product = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `http://lucisno-001-site1.ftempurl.com/api/Product/Get`,
            data: {
                id: id
            }
        });
        
        if(product == undefined){
            await getProduct();
        }else{
            if(product.id == 0){
                $("#error").append(`
                <div class"h-100 row align-items-center" style="text-align: center;">
                <div class="col">
                <h1> Producto no encontrado</h1> <a href="../../index.html"><button type="button" class="btn btn-light btn-md mr-1 mb-2"><i
                class="fas fa-shopping-cart pr-2"></i>Volver a inicio</button></a>
                </div>
                </div> `)
            }else{
                $("#productBox").append(`<div class="col-md-6 mb-4 mb-md-0">
                <div id="mdb-lightbox-ui"></div>
                <div class="mdb-lightbox">
                  <div class="row product-gallery mx-1">
                    <div class="col-12 mb-0">
                      <figure class="view overlay rounded z-depth-1 main-img">
                          <img src="${product.urlImage}"
                            class="img-fluid z-depth-1">
                      </figure>
                    </div>
                  </div>
          
                </div>
          
              </div>
              <div class="col-md-6">
          
                <h5>${product.name}</h5>
                <p><span class="mr-1"><strong>$${product.price}</strong></span></p>
                <p class="pt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, sapiente illo. Sit
                  error voluptas repellat rerum quidem, soluta enim perferendis voluptates laboriosam. Distinctio,
                  officia quis dolore quos sapiente tempore alias.</p>
                <div class="table-responsive">
                  <table class="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr>
                        <th class="pl-0 w-25" scope="row"><strong>Stock</strong></th>
                        <td>Agotado!</td>
                      </tr>
                  </table>
                </div>
                <hr>
                <button type="button" class="btn btn-light btn-md mr-1 mb-2"><i
                    class="fas fa-shopping-cart pr-2"></i>Volver a inicio</button>
              </div>`);

              await getByCategories(product.category);
            }

            
        }
    }

    async function getByCategories(cat){
        var categoryAll = [];
        categoryAll.push(cat);
        var categoriesJson = JSON.stringify(categoryAll);
        var productFilter = await $.ajax({
            method: "GET",
            dataType: "json",
            crossDomain: true,
            url: `http://lucisno-001-site1.ftempurl.com/api/Product/GetByCategory`,
            data: {
                start: 0,
                end: 6,
                categoriesJson: categoriesJson
            }

        });

        console.log(productFilter)
        var items= ``;
        var itemCount = 0;
        $.each(productFilter, function (ix, product) {
            itemCount++;
            img = "../../Sources/Images/logo2.png";
                    if(product.urlImage.length >1){
                         img = product.urlImage;
                    }
                    if(product.discount > 0){
                        var oldPrice = Math.trunc((product.price * 100)/ (100-product.discount));
                        items += `
                            
                               <div class="col-md-3">
                                        <div  class="single-product">
                                        <a href="./index.html?product=${product.id}">
                                            <div class="part-1"  style="background-image: url('${img}'); background-repeat: no-repeat;  background-size: 197px 250px important!">
                                            <span class="discount">${product.discount}% Descuento!</span>
                                            </div>
                                        </a>
                                            <div class="part-2">
                                                <h3 class="product-title">${product.name}</h3>
                                                <h4 class="product-old-price">$${oldPrice}</h4>
                                                <h4 class="product-price">$${product.price}</h4>
                                            </div>
                                        </div>
                                </div>
                           
                             `
         
                    }else{
                        items += `
                                <div class="col-md-3">
                                            <div class="single-product">
                                            <a href="./index.html?product=${product.id}">
                                                <div class="part-1"  style="height: 280px; background-image: url('${img}'); background-repeat: no-repeat; background-size: 197px 250px important!">
                                                </div>
                                            </a>
                                                <div class="part-2">
                                                    <h3 class="product-title">${product.name}</h3>
                                                    <h4 class="product-price">$${product.price}</h4>
                                                </div>
                                          </div>
                                        </div>
                                </a>`
         
                    }
             if(itemCount == 3){
                $("#productContainer").append(items);
                items = "";
             }

        });

        $("#productContainer2").append(items);
        
        
    }



    return Object.freeze({
        init:  () =>  initView(),
        getProduct:  async () => await getProduct(),
        getByCategories: async(cat) => await getByCategories(cat)
    });
}

window.Index = function () {
    return ProductApi();
}