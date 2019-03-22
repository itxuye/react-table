export function timerFnc(fnc, t, beforeHook) {
  let timer = null;
  const time = t || 200;
  return function call(arg) {
    if (timer) {
      window.clearTimeout(timer);
    }
    beforeHook && beforeHook.call(this, arg);
    timer = window.setTimeout(async () => {
      await fnc.call(this, arg);
      timer = null;
    }, time);
  };
}

export function addResizeEventListener(ele, resizeHandle) {
  const obj = document.createElement("object");
  obj.setAttribute(
    "style",
    "position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;"
  );
  obj.onload = () => {
    obj.contentDocument.defaultView.addEventListener(
      "resize",
      resizeHandle,
      false
    );
  };
  obj.type = "text/html";
  ele.append(obj);
  obj.data = "about:blank";
  return obj;
}

export function getChainObject(obj, path) {
  const keys = path.split(".");
  if (keys.length === 1) {
    return obj[path];
  }
  const len = keys.length;
  let tra = obj;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const tmp = tra[key];
    if (i === len - 1) {
      return tmp;
    }
    if (tmp === undefined) {
      return undefined;
    }
    tra = tmp;
  }
}
