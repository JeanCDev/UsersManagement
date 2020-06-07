class User{
    
    constructor(name, gender, birth, country, email, password, photo, admin, register){
        
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
        
    } // fim constructor
    
    // getters
    get id(){
        return this._id;
    }
    
    get name(){
        return this._name;
    }
    
    get gender(){
        return this._gender;
    }
    
    get birth(){
        return this._birth;
    }
    
    get country(){
        return this._country;
    }
    
    get email(){
        return this._email;
    }
    
    get password(){
        return this._password;
    }
    
    get photo(){
        return this._photo;
    }
    
    get admin(){
        return this._admin;
    }
    
    get register(){
        return this._register;
    }
    // fim geters
    
    // setters
    set photo(value){
        this._photo = value;
    }
    // fim setes
    
    loadFromJSON(json){
        
        for(let name in json){
            
            switch(name){
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }
        }
        
    } // fim loadFromJSON
    
    static getUsersStorage(){
        
        //verifica o sessionStorage/localStorage
        let users = [];
        
        if(localStorage.getItem('users')){
            
            //users = JSON.parse(sessionStorage.getItem('users'));
            users = JSON.parse(localStorage.getItem('users'));
            
        }
        
        return users;
        
    } // fim getUsers
    
    getNewId(){
        
        // pega o id se existir ou cria um
        let usersId = parseInt(localStorage.getItem('usersId'));
        
        if(!usersId > 0) usersId = 0;
        
        usersId++;
        
        localStorage.setItem('usersId', usersId);
        
        return usersId;
        
    } // fim geNewId
    
    save(){
        
        //salva dados no localStorage/sessionStorage
        let users = User.getUsersStorage();
        
        if(this.id > 0){
            
            users.map(u=>{
                
                if(u._id == this.id){
                    
                    Object.assign(u, this);
                    
                }
                
                return u;
                
            });
            
        } else{
            
            this._id = this.getNewId();
            
            users.push(this);
        }
        
        //sessionStorage.setItem( 'users', JSON.stringify(users));
        localStorage.setItem( 'users', JSON.stringify(users));
        
    }
    
    remove(){
        
        //remove os datos do localStorage/sessionStorage
        let users = User.getUsersStorage();
        
        users.forEach((userData, index)=>{
            
            if(this._id == userData._id){
                
                users.splice(index, 1);
                
            }
            
        });
        
        //sessionStorage.setItem( 'users', JSON.stringify(users));
        localStorage.setItem( 'users', JSON.stringify(users));
        
    }
    
}