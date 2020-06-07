class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) {

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        
        this.selectAll();

    } // fim do constructor

    onSubmit() {

        this.formEl.addEventListener('submit', event => {

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values) return false;

            this.getPhoto(this.formEl).then(
                (content) => {

                    values.photo = content;
                    
                    values.save();

                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;

                },
                (e) => {

                    console.error(e)

                });

        });

    } // fim do onSubmit 

    onEdit() {

        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener('submit', e => {

            e.preventDefault();

            let btn = this.formUpdateEl.querySelector('[type=submit]');

            btn.disable = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            
            let userOld = JSON.parse(tr.dataset.user);
            
            let result = Object.assign({}, userOld, values);
            
            this.showPanelCreate();
            
            this.getPhoto(this.formUpdateEl).then(
                (content) => {
                    
                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else{
                        result._photo = content;
                    }
                    
                    let user = new User();
                    
                    user.loadFromJSON(result);
                    
                    user.save();
                    
                    this.getTr(user, tr);

                    this.addEventsTr(tr);
            
                    this.updateCount();

                    btn.disable = false;
            
                    this.formUpdateEl.reset();

                },
                (e) => {

                    console.error(e)

                });

        });

    } // fim do  onEdit

    addEventsTr(tr) {
        
        tr.querySelector('.btn-delete').addEventListener('click', e =>{
            
            if(confirm("Deseja realmente Excluir?")){
                
                let user = new User();
                
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                
                user.remove();
                
                tr.remove();
                
                this.updateCount();
                
            }
            
        });

        tr.querySelector('.btn-edit').addEventListener('click', e => {

            let json = (JSON.parse(tr.dataset.user));
            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']');

                if (field) {
                    if (field.type == 'file') continue;

                    switch (field.type) {

                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + '][value=' + json[name] + ']');
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;

                        default:
                            field.value = json[name];

                    }
                }

            }
            
            this.formUpdateEl.querySelector('.photo').src = json._photo;

            this.showPanelUpdate();

        });

    } // fim addEventsTr

    getPhoto(formEl) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {

                if (item.name === 'photo') {

                    return item;

                }

            });

            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);

            }

            fileReader.onerror = (e) => {

                reject(e)

            }

            if (file) {

                fileReader.readAsDataURL(file);

            } else {

                resolve('dist/img/boxed-bg.jpg');

            }

        });

    } // fim getPhoto

    getValues(formEl) {

        let user = {};
        let isValid = true;

        // spread para poder usar o forEach em um objeto
        [...formEl.elements].forEach((field, index) => {

            // verifica se o campo está vazio
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                // identifica o elemento pai e impede o envio do form
                field.parentElement.classList.add('has-error');
                isValid = false;

            }

            if (field.name == 'gender') {

                //é possivel executar uma função na linha seguinte sem chaves
                if (field.checked) {
                    user[field.name] = field.value;
                }

            } else if (field.name == 'admin') {

                user[field.name] = field.checked;

            } else {

                user[field.name] = field.value;

            }

        });

        // verifica novamente se está vazio e impede de adicionar a linha
        if (!isValid) {
            return false;
        }

        // instancia da classe User()
        return new User(user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin);

        return objectUser;

    } // fim do getValues
    
    selectAll(){
        
        // adiciona linhas na tabela a partir dos dados do sessionStorage/localStorage
        let users = User.getUsersStorage();
        
        users.forEach(dataUser => {
            
            let user = new User();
            
            user.loadFromJSON(dataUser);
            
            this.addLine(user);
            
        });
        
    } // fim selectAll

    addLine(dataUser) {

        let tr = this.getTr(dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();

    } // fim do addLine
    
    getTr(dataUser, tr = null){
        
        // indformações para usar adicionando/editando a tr
        if (tr === null) tr = document.createElement('tr');
        
        tr.dataset.user = JSON.stringify(dataUser);
        
        tr.innerHTML = `
                
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Sim' : 'Não' }</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                  <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                  <button type="button" class="btn btn-delete btn-danger btn-xs btn-flat">Excluir</button>
                </td>
                `;
        
        this.addEventsTr(tr);
        
        return tr;
        
    } // fim getTr

    showPanelCreate() {

        document.querySelector('#box-user-update').style.display = 'none';
        document.querySelector('#box-user-create').style.display = 'block';

    } // fim showPanelCreate

    showPanelUpdate() {

        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';

    } // fim showPanelUpdate

    // conta quantos usuários foram cadastrados
    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-admin').innerHTML = numberAdmin;

    } // fim updateCount


}
