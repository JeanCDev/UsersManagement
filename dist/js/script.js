/*var name = document.querySelector('#exampleInputName');
var gender = document.querySelectorAll('#form-user-create [name="gender"]:checked');
var birth = document.querySelector('#exampleInputBirth');
var country = document.querySelector('#exampleInputCountry');
var email = document.querySelector('#exampleInputEmail');
var password = document.querySelector('#exampleInputPassword');
var file = document.querySelector('#exampleInputFile');
var file = document.querySelector('#exampleInputAdmin');*/

var user = {};

// cria uma linha nova na table
function addLine(dataUser){
    
    console.log(dataUser);
    
    var tr = document.createElement('tr');
    
    tr.innerHTML = `
                    <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>Sim</td>
                    <td>02/04/2018</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                    `;
    
    document.getElementById('table-users').appendChild(tr);
        
}


//percorre o DOM e seleciona os elementos automaticamente, sem definir variável
var fields = document.querySelectorAll("#form-user-create [name]");

fields.forEach(function(field, index){
    
    if(field.name == 'gender'){
        
        //é possivel executar uma função na linha seguinte sem chaves
            if(field.checked){
                user[field.name] = field.value;
            }
            
       } else{
           user[field.name] = field.value;
       }
    
    
    
    
    
});

// instancia da classe User()
var objectUser = new User(user.name, 
                          user.gender, 
                          user.birth, 
                          user.country, 
                          user.email, 
                          user.password, 
                          user.photo, 
                          user.admin);

addLine(objectUser);

