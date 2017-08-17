/**
 * Created by linhong.li on 2017/8/10.
 * 解析url参数
 * @example ?id=123456&a=b
 * @return Object {id:123456,a:b}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  // [xyz] 匹配这个集合中的任一一个字符
  // [^xyz] 不匹配这个集合中的任何一个字符
  let arr = url.match (reg); // ['?id=123456','&a=b']
  if (arr) {
    arr.forEach ((item) => {
      let tempArr = item.substring (1).split ('=');
      let key = decodeURIComponent (tempArr[0]);
      let val = decodeURIComponent (tempArr[1]);
      obj[key] = val;
    });
  }
 // console.log (obj);
  return obj;
};
