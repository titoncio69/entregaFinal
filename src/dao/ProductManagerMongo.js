import { ProductModel } from '../models/product.model.js';

export default class ProductManagerMongo {
  async createProduct(data) {
    const newProduct = await ProductModel.create(data);
    return newProduct.toObject();
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    return result;
  }

  async getProductById(id) {
    return ProductModel.findById(id).lean();
  }

  // Esta función es la clave para la consigna del GET /
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    // query por categoría o disponibilidad
    if (query) {
      // ejemplo: query=category:Electrónica o query=status:true
      const [field, value] = query.split(':');
      if (field === 'category') {
        filter.category = value;
      } else if (field === 'status') {
        filter.status = value === 'true';
      }
    }

    const sortOptions = {};
    if (sort === 'asc') sortOptions.price = 1;
    if (sort === 'desc') sortOptions.price = -1;

    const skip = (page - 1) * limit;

    const [totalDocs, products] = await Promise.all([
      ProductModel.countDocuments(filter),
      ProductModel.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      products,
      totalPages,
      page,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }
}
