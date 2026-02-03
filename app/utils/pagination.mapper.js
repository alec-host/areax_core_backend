/**
 * Maps Sequelize findAndCountAll result to match mongoose-paginate-v2 structure.
 */
module.exports.mapSequelizePagination = (result, page, limit) => {
    const { count: totalDocs, rows: docs } = result;
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
        docs,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null
    };
};

