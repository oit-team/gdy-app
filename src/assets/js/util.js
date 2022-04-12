
import { Indicator } from 'mint-ui';


const loading = function(){
    let _this = this;
    Indicator.open({
        text: '',
        spinnerType: 'fading-circle'
    });
    setTimeout(function(){
        Indicator.close();
    },200);
}


const htmlToStr = function(val){
    return val.split("<br>").join(" ");
}

export default{
    loading:loading,
    htmlToStr:htmlToStr
}