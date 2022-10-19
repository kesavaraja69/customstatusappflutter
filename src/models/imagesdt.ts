export interface Root {
  myArrayslist: MyArrayslist[][]
}

export interface MyArrayslist {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}
