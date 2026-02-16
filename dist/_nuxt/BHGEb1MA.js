const r=()=>({getFirstFile:t=>t instanceof FileList?t.item(0):Array.isArray(t)?t[0]??null:t&&typeof t=="object"&&"target"in t?t.target?.files?.[0]??null:null});export{r as u};
