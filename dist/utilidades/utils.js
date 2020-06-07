// clase para pegar a data atual do usuário
class Utils{
    
    static dateFormat(date){
        
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
        
    }
    
    
}