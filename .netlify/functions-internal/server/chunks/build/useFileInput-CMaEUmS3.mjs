const useFileInput = () => {
  const getFirstFile = (payload) => {
    var _a, _b, _c, _d;
    if (payload instanceof FileList) {
      return payload.item(0);
    }
    if (Array.isArray(payload)) {
      return (_a = payload[0]) != null ? _a : null;
    }
    if (payload && typeof payload === "object" && "target" in payload) {
      return (_d = (_c = (_b = payload.target) == null ? void 0 : _b.files) == null ? void 0 : _c[0]) != null ? _d : null;
    }
    return null;
  };
  return {
    getFirstFile
  };
};

export { useFileInput as u };
//# sourceMappingURL=useFileInput-CMaEUmS3.mjs.map
