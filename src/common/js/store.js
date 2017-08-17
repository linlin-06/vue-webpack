/**
 *数据的存储 读取
 */

// 存储
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__; // 存取seller
  if (!seller) {
    // 第一次存储
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse (seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify (seller);
};

// 读取
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse (seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}
