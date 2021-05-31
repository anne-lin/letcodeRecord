const path=require('path');

module.exports={
    DB_HOST: '10.130.29.10',
    DB_PORT: 3306,
    DB_USER: 'root',
    DB_PASS: '123456',
    DB_NAME: 'chat',

    //http
    HTTP_PORT: 8087,
    HTTP_ROOT: path.resolve(__dirname, '../static/'),
    HTTP_UPLOAD: path.resolve(__dirname, '../static/upload/'),

    robotAnswer:{
        "你好":"hello,小仙女",
        "几点回家":"19：41以后我们就可以回家咯",
        "谁是世界上最帅的男孩纸":"当然是董文涛哥哥啦",
        "魔镜魔镜，世界上最漂亮的小姑凉是谁":"莹含小妹妹哦",
        "董文涛曾答应过我什么":"他说今晚给你100元钱"
    },
    allowOrigin:{
        'http://localhost:8083': true
    }
};
