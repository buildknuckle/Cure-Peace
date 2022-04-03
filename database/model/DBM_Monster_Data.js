class DBM_Monster_Data {
    static TABLENAME = "monster_data";

    static columns = {
        id:"id",
        name:"name",
        type:"name",
        series:"series",
        img_url:"img_url",
        weakness_color:"weakness_color",
        precure_buff_desc:"precure_buff_desc",
        precure_buff_effect:"precure_buff_effect",
        patch_ver:"patch_ver",
        created_at:"created_at",
    }
}

module.exports = DBM_Monster_Data;