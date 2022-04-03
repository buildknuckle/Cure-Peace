const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DBM_Admin = require('../../../database/model/DBM_Admin');

class Admin {
    static tablename = DBM_Admin.TABLENAME;
    static columns = DBM_Admin.columns;

    static role = {
        admin:"admin"
    }

    id_user=null;
    role=null;

    constructor(adminData=null){
        if(adminData!=null){
            for(var key in adminData){
                this[key] = adminData[key];
            }
        }
    }

    isAdmin(){
        return this.role==Admin.role.admin ? true:false;
    }

    isAvailable(){
        return this.id_user!==null ? true: false;
    }

    static async getData(userId){
        var paramWhere = new Map();
        paramWhere.set(this.columns.id_user, userId);
        var result = await DB.select(Admin.tablename, paramWhere);
        return result[0]!==null? result[0]:null;
    }
}

module.exports = Admin;