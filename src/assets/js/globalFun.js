function g_paramJson(con,cmd){
  var g_paramJson = {
    "head" : {
      "aid" : localStorage.userId,
      "ver" : "1.0",
      "ln" : "cn",
      "mod" : "app",
      "de" : "2019-10-16",
      "sync" : 1,
      "uuid" : localStorage.brandId,
      "chcode" : "ef19843298ae8f2134f",
      'cmd':cmd?cmd:''
    },
    "con" : con
  };
  return g_paramJson
}
export default{
  g_paramJson,
}



