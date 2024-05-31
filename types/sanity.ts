interface Asset {
  _ref: string
  _type: string
}

interface Image {
  alt: string
  _type: string
  asset: Asset
}

interface Author {
  _type: string
  _ref: string
}

interface ContentBlock {
  _key: string
  style: string
  markDefs: any[] // Assuming this array can contain various types, specify if known
  children: any[] // Assuming this array can contain various types, specify if known
  _type: string
}

interface ContentItem {
  _key: string
  style: string
  markDefs: any[]
  children: ContentBlock[]
  _type: string
}

interface Post {
  _updatedAt: string
  title: string
  coverImage: Image
  author: Author
  _rev: string
  _createdAt: string
  content: ContentItem[]
  date: string
  slug: {
    _type: string
    current: string
  }
  excerpt: string
  _type: string
  _id: string
}
