function removeAccents(str: string): string {
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, "e")
  str = str.replace(/[ìíịỉĩ]/g, "i")
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
  str = str.replace(/[ùúụủũưừứựửữ]/g, "u")
  str = str.replace(/[ỳýỵỷỹ]/g, "y")
  str = str.replace(/đ/g, "d")
  str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, "A")
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, "E")
  str = str.replace(/[ÌÍỊỈĨ]/g, "I")
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, "O")
  str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, "U")
  str = str.replace(/[ỲÝỴỶỸ]/g, "Y")
  str = str.replace(/Đ/g, "D")
  str = str.replace(/\s+/g, ' ')

  return str
}

export default removeAccents