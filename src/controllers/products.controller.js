import ProductManagerMongo from '../dao/ProductManagerMongo.js';

const productService = new ProductManagerMongo();

export const getProducts = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = Number(limit) || 10;
    page = Number(page) || 1;

    const result = await productService.getProducts({
      limit,
      page,
      sort,
      query,
    });

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    const buildLink = (pageNumber) => {
      const params = new URLSearchParams();
      params.set('page', pageNumber);
      params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: 'success',
      payload: result.products,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    console.error('Error en getProducts', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    if (!product)
      return res
        .status(404)
        .json({ status: 'error', error: 'Product not found' });

    res.json({ status: 'success', payload: product });
  } catch (error) {
    console.error('Error en getProductById', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);

    // emitir actualización por socket si quieres reutilizar realtime
    if (req.io) {
      const result = await productService.getProducts({
        limit: 100,
        page: 1,
      });
      req.io.emit('productsUpdated', result.products);
    }

    res.status(201).json({ status: 'success', newProduct });
  } catch (error) {
    console.error('Error en createProduct', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productService.deleteProduct(pid);
    if (!deleted)
      return res
        .status(404)
        .json({ status: 'error', error: 'Product not found' });

    if (req.io) {
      const result = await productService.getProducts({
        limit: 100,
        page: 1,
      });
      req.io.emit('productsUpdated', result.products);
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error en deleteProduct', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
};
